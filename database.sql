-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- CREATE TABLE "user" (
--     "id" SERIAL PRIMARY KEY,
--     "username" VARCHAR (80) UNIQUE NOT NULL,
--     "password" VARCHAR (1000) NOT NULL
-- );

-- For the solo project
CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(100) NOT NULL,
	"password" VARCHAR(100) NOT NULL,
	"profile_image_url" text,
	"is_admin" BOOLEAN NOT NULL DEFAULT 'FALSE',
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT 'TRUE'
);

SELECT * FROM "user";

--INSERT INTO "user" ("username", "password", "image_url")


--UPDATE "user" SET "image_url" = 'test.jpg' WHERE "user"."id"=1;

CREATE TABLE "cooks" (
	"cook_id" SERIAL PRIMARY KEY,
	"user_id"  int REFERENCES "user",
	"profile_image_url" int REFERENCES "user",
	"cook_name" VARCHAR(500),
    "cook_image_url" text,
	"cook_date" date,
	"location" VARCHAR(100),
	"recipe_notes" VARCHAR,
	"cook_rating" VARCHAR,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT 'TRUE'
);

SELECT * FROM "cooks";

INSERT INTO "cooks" ("user_id", "cook_name", "image_url", "cook_date", "location", "recipe_notes", "cook_rating")
VALUES (1, 'not pizza', 'sampletest.jpg', '2024-06-17', 'kindred', 'these are notes', '5 stars');

SELECT *
FROM "cooks"
ORDER BY "created_at" DESC;

CREATE TABLE "comments" (
	"comment_id" SERIAL PRIMARY KEY,
	"post_id" int REFERENCES "cooks",
	"user_id" int REFERENCES "user",
	"comment_text" VARCHAR
);

CREATE TABLE "cookLikes" (
	"like_id" SERIAL PRIMARY KEY,
	"post_id" int NOT NULL REFERENCES "cooks",
	"user_id" int NOT NULL REFERENCES "user"
);
