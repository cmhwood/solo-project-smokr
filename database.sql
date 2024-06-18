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


UPDATE "user" SET "profile_image_url" = 'https://st3.depositphotos.com/29384342/34115/i/450/depositphotos_341157888-stock-photo-recommendation-sports-student.jpg' WHERE "user"."id"=1;


CREATE TABLE "cooks" (
	"id" SERIAL PRIMARY KEY,
	"cook_name" VARCHAR(100) NOT NULL,
	"user_id" INTEGER NOT NULL REFERENCES "user" ("id"),
	"cook_image_urls" JSONB,
	"cook_date" TIMESTAMP,
	"location" VARCHAR(255),
	"recipe_notes" TEXT,
	"cook_rating" INTEGER,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO cooks (cook_name, user_id, cook_date, location, recipe_notes, cook_rating)
VALUES ('Cook Name with pic', 1, '2024-06-18', 'downtown', 'this is notes', 5);

INSERT INTO cook_images (cook_id, image_url)
VALUES
(1, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFood&psig=AOvVaw0iqgTSVOTcjl4aUmykKdlG&ust=1718820918357000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPCcsIbh5YYDFQAAAAAdAAAAABAE'),
(1, 'https://www.summahealth.org/-/media/project/summahealth/website/page-content/flourish/2_18a_fl_fastfood_400x400.webp?la=en&h=400&w=400&hash=145DC0CF6234A159261389F18A36742A');


SELECT * FROM "cooks";
SELECT * FROM cook_images WHERE cook_id = 21;


INSERT INTO "cooks" ("user_id", "cook_name", "cook_image_url", "cook_date", "location", "recipe_notes", "cook_rating")
VALUES (1, 'not pizza', 'sampletest.jpg', '2024-06-17', 'kindred', 'these are notes', 'stars');

INSERT INTO "cooks" (
    "cook_name", 
    "user_id", 
    "cook_image_url", 
    "cook_date", 
    "location", 
    "recipe_notes", 
    "cook_rating"
)
VALUES (
    'second cook',                             -- cook_name
    1,                                      -- user_id
    (SELECT "profile_image_url" FROM "user" WHERE "id" = 1),  -- cook_image_url from user table
    '2024-06-18',                           -- cook_date
    'Kindred',                         -- location
    'Delicious recipe notes.',              -- recipe_notes
    4                                       -- cook_rating
);

CREATE TABLE cook_images (
    id SERIAL PRIMARY KEY,
    cook_id INTEGER NOT NULL REFERENCES cooks(id),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM cook_images;

-- Inserting a cook
INSERT INTO cooks (cook_name, user_id, cook_date, location, recipe_notes, cook_rating)
VALUES ('Spaghetti Carbonara round two', 1, '2024-06-18', 'fargo', 'Classic Italian pasta dish', 4);

-- Retrieving the inserted cook's ID (assuming 1 in this case)
INSERT INTO cook_images (cook_id, image_url)
VALUES (13, 'https://media.post.rvohealth.io/wp-content/uploads/2022/09/frozen-dinner-meal-meatloaf-mashed-potatoes-vegetables-732x549-thumbnail-732x549.jpg'),
       (13, 'https://www.summahealth.org/-/media/project/summahealth/website/page-content/flourish/2_18a_fl_fastfood_400x400.webp?la=en&h=400&w=400&hash=145DC0CF6234A159261389F18A36742A');


-- Example inserting into the cooks table with cook_image_url (assuming no cook_images table)
INSERT INTO cooks (cook_name, user_id, cook_date, location, recipe_notes, cook_rating, cook_image_urls)
VALUES ('Cook Name', 1, '2024-06-18', 'Location', 'Recipe Notes', 5, 'https://example.com/image1.jpg');


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