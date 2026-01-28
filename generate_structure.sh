#!/bin/bash

# Create core folders
mkdir -p public

# Create core files
touch server.js
touch users.db
touch package.json
touch package-lock.json
touch .gitignore

# Create frontend files
touch public/homepage.html
touch public/quiz.html
touch public/match.html
touch public/styles.css
touch public/script.js
touch public/quiz.js

# Create placeholder images
touch public/cc1.jpeg
touch public/cc2.jpeg
touch public/cc3.jpeg
touch public/fire2.png
touch public/matchbox1.png

echo "Project structure generated successfully."
