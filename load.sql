
CREATE TABLE question_transform (
  id VARCHAR(255),
  product_id VARCHAR(255),
  body VARCHAR(1000),
  date_written VARCHAR(255),
  asker_name VARCHAR(255),
  asker_email VARCHAR(1000),
  reported VARCHAR(255),
  helpful VARCHAR(255)
);
CREATE TABLE answer_transform (
  id VARCHAR(255),
  question_id VARCHAR(1000),
  body VARCHAR(2000),
  date_written VARCHAR(2000),
  answerer_name VARCHAR(1000),
  answerer_email VARCHAR(1000),
  reported VARCHAR(255),
  helpful VARCHAR(255)
);
CREATE TABLE photo_transform (
  id VARCHAR(255),
  answer_id VARCHAR(255),
  "url" VARCHAR(2000)
);

COPY question_transform (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/home/albert/Seip2205/SDC/Thorium-QA/csv/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answer_transform (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/home/albert/Seip2205/SDC/Thorium-QA/csv/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photo_transform (id, answer_id, "url")
FROM '/home/albert/Seip2205/SDC/Thorium-QA/csv/answers_photos.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO "user" (email, username) select asker_email as email, asker_name as username from question_transform
UNION
select answerer_email as email, answerer_name as username from answer_transform;

INSERT INTO photo SELECT id::INT, answer_id, "url" FROM photo_transform;

INSERT INTO question (id, product_id, user_id, question_body, question_date, question_helpfulness, reported)
SELECT q.id::INT, q.product_id::INT, u.id::INT, q.body, TO_TIMESTAMP(q.date_written::BIGINT / 1000), q.helpful::INT, q.reported::BOOLEAN FROM "user" u INNER JOIN question_transform q ON u.email = q.asker_email AND u.username = q.asker_name

INSERT INTO answer (id, question_id, user_id, answer_body, answer_date, answer_helpfulness, reported)
SELECT a.id::INT, a.question_id::INT, u.id::INT, a.body, TO_TIMESTAMP(a.date_written::BIGINT / 1000), a.helpful::INT, a.reported::BOOLEAN FROM "user" u INNER JOIN answer_transform a ON u.email = a.answerer_email AND u.username = a.answerer_name


