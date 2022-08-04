CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50),
  email VARCHAR(255),
  CONSTRAINT unique_idx UNIQUE ("name", email)
);
CREATE TABLE question (
  id SERIAL PRIMARY KEY,
  product_id INT,
  user_id INT REFERENCES "user"(id),
  question_body VARCHAR(255),
  question_date DATE,
  question_helpfulness INT,
  reported BOOLEAN
);

CREATE TABLE answer (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES question(id),
  user_id INT REFERENCES "user"(id),
  answer_body VARCHAR(255),
  answer_date DATE,
  answer_helpfulness INT,
  reported BOOLEAN
);

CREATE TABLE photo (
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES answer(id),
  "url" VARCHAR(255)
);


    -- SELECT row_to_json(questionResult) FROM
    -- (SELECT
    --   q.id,
    --   q.question_body,
    --   q.question_date,
    --   u.username,
    --   q.reported,
    --   q.question_helpfulness,
    --   (SELECT
    --     json_object_agg(av.id,
    --       (SELECT row_to_json(answerResult) FROM
    --         (SELECT a.id, a.answer_body, a.answer_date, a.answer_helpfulness, a.reported, u.username,
    --         (SELECT array_agg("url") FROM photo p WHERE p.answer_id = a.id) AS photos
    --         FROM answer a LEFT JOIN "user" u ON a.user_id = u.id WHERE a.id = av.id) AS answerResult
    --       )
    --     )
    -- FROM answer av
    -- WHERE av.question_id = q.id AND av.reported = false) AS answers
    -- FROM question q
    -- LEFT JOIN "user" u
    -- ON q.user_id = u.id
    -- WHERE q.product_id = 6000
    -- AND q.reported = false) AS questionResult


-- create view answer_view as
-- (SELECT
--         json_object_agg(av.id,
--           (SELECT row_to_json(answerResult) FROM
--             (SELECT a.id, a.answer_body, a.answer_date, a.answer_helpfulness, a.reported, u.username,
--             (SELECT array_agg("url") FROM photo p WHERE p.answer_id = a.id) AS photos
--             FROM answer a LEFT JOIN "user" u ON a.user_id = u.id WHERE a.id = av.id) AS answerResult
--           )
--         )
--     FROM answer av
--     WHERE av.question_id = q.id AND av.reported = false) AS answers


    -- 'SELECT\
    --   u.username,\
    --   q.id,\
    --   q.question_body,\
    --   q.question_date,\
    --   q.question_helpfulness,\
    --   q.reported\
    -- FROM question q\
    -- LEFT JOIN "user" u\
    -- ON q.user_id = u.id\
    -- WHERE q.product_id = 1\
    -- AND q.reported = false'

  -- SELECT json_agg(answerResult) AS result
  -- FROM
  -- (SELECT
  -- dog.question_id,
	-- dog.id as answer_id,
	-- dog.answer_body,
	-- dog.answer_date,
	-- u."name" as answerer_name,
	-- dog.answer_helpfulness,
	-- (SELECT jsonb_agg(photo) from (SELECT id, "url" from photo where answer_id = dog.id ) as photo )
	-- FROM answer dog
 	-- LEFT JOIN "user" u
	-- ON dog.user_id = u.id
  -- WHERE dog.question_id = 1 limit 100) as answerResult;