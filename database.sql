-- For the solo project
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(100) NOT NULL,
  "password" VARCHAR(100) NOT NULL,
  "profile_image_url" TEXT DEFAULT 'https://t3.ftcdn.net/jpg/01/18/01/98/360_F_118019822_6CKXP6rXmVhDOzbXZlLqEM2ya4HhYzSV.jpg',
  "is_admin" BOOLEAN NOT NULL DEFAULT 'FALSE',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "is_active" BOOLEAN NOT NULL DEFAULT 'TRUE'
);

CREATE TABLE "cook_rating" (
  "id" SERIAL PRIMARY KEY,
  "rating" VARCHAR(80) NOT NULL
);


CREATE TABLE "cooks" (
	"id" SERIAL PRIMARY KEY,
	"cook_name" VARCHAR(100) NOT NULL,
	"user_id" INTEGER NOT NULL REFERENCES "user" ("id"),
	"cook_date" TIMESTAMP,
	"location" VARCHAR(255),
	"recipe_notes" TEXT,
	"cook_rating" INTEGER REFERENCES "cook_rating" ("id"),
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"is_active" BOOLEAN NOT NULL DEFAULT 'TRUE'
);

CREATE TABLE cook_images (
    id SERIAL PRIMARY KEY,
    cook_id INTEGER NOT NULL REFERENCES cooks(id),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "cookLikes" (
	"like_id" SERIAL PRIMARY KEY,
	"post_id" int NOT NULL REFERENCES "cooks",
	"user_id" int NOT NULL REFERENCES "user"
);

