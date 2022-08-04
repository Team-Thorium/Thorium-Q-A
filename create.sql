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


