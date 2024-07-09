# Smokr

## Description

Duration: 2 week sprint

Welcome to the Smokr App, the ultimate platform for BBQ lovers and smoking enthusiasts! My app is designed to unite a community of passionate grillers, allowing you to share your culinary creations, learn from others, and elevate your grilling game.

## Screenshots
<img width="306" alt="Screenshot 2024-07-08 at 9 01 05 PM" src="https://github.com/cmhwood/solo-project-smokr/assets/160754329/a0259cbf-8446-4456-b2b7-4b704326f643">
<img width="304" alt="Screenshot 2024-07-08 at 9 01 33 PM" src="https://github.com/cmhwood/solo-project-smokr/assets/160754329/a717ebef-53af-46b2-82bf-7178bd506c95">

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- PostgreSQL for database

## Installation

1. Create a database named `solo_spike`,
2. The queries in the `database.sql` file are set up to create all the necessary tables and populate the needed data to allow the application to run correctly. The project is built on [Postgres](https://www.postgresql.org/download/), so you will need to make sure to have that installed. We recommend using Postico to run those queries as that was used to create the queries,
3. Create an account on Cloudinary (for image uploading) and add your Cloud Name and Upload Present (unsigned) to a .env file. In the .env file, these should be named "REACT_APP_CLOUDINARY_NAME" and "REACT_APP_CLOUDINARY_UPLOAD_PRESET".
4. Open up your editor of choice and run an `npm install`
5. Run `npm run server` in your terminal
6. Run `npm run client` in your terminal
7. Navigate to the local host in your browser

## Usage
Track Your Cooks
Keep a detailed record of all your grilling and smoking sessions.
Name your cook, and add the date, location, and any specific notes about your preparation and cooking process.
Rate each cook to remember your best (and not-so-best) moments.
Share with the Community
Post your cooks to a community feed, showcasing your skills and inspiring others.
Each post includes a profile image, the name of what you’re cooking, the location, the date, and a gallery of images.
Engage with Others
Comment on other users’ posts, provide feedback, and tips, or simply appreciate their work.
Click on profile images to explore other users' cooking history and get inspired by their journey.
Click on a cook’s name for an in-depth look at their cooking process, recipes, and notes.
Discover New Ideas
Browse the feed of recent posts to stay up-to-date with the latest grilling trends and techniques.
Find inspiration for your next cook by seeing what others are making worldwide.
Features
Profile Pages: Access other users’ profiles to see all their cooks, follow their journey, and get inspired.
Detailed Cook Entries: Dive deeper into individual cooks with detailed descriptions, recipes, preparation notes, and images.
Comments and Interactions: Engage with the community by commenting on posts, sharing tips, and asking questions.
Image Galleries: Upload multiple images to showcase each stage of your cooking process, from prep to the finished product.
Location Tagging: Add your location to each cook to connect with local grillers and discover regional grilling styles.

## Built With

- Javascript
- React
- Redux
- PostgreSQL
- Express
- Node
- Passport
(a full list of dependencies can be found in `package.json`)

## Acknowledgement
Thanks to [Emerging Digital Academy](https://emergingacademy.org/) who equipped me with the tools and helped me build this app.
