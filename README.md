# BookTracker

> This project is part of a Finnish thesis project. The application UI is in Finnish.

BookTracker is a web application built with React and TypeScript that allows users to search for books, save them to favorites, and add personal notes. The project was developed as part of a thesis comparing traditional software development with no-code development.

##  Features

- User authentication (Firebase)
- Search books using Google Books API
- Save books to favorites
- Add and manage personal notes
- Edit and delete saved books
- Sort books (e.g. by publication year)

##  Technologies

- React
- TypeScript
- Vite
- Firebase Authentication
- Cloud Firestore
- Google Books API

## Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/anastasialamberg/BookTracker.git

cd BookTracker

npm install

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

npm run dev
