Book Review API
A RESTful API for a Book Review system built with Node.js, Express, and MongoDB.
Features

User authentication with JWT
CRUD operations for books and reviews
Pagination and filtering
Search functionality
Average ratings for books

Database Schema
User Model
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
Book Model
{
  title: String,
  author: String,
  genre: String,
  description: String,
  publishedYear: Number,
  publisher: String,
  isbn: String,
  createdAt: Date,
  user: ObjectId (reference to User)
}
Review Model
{
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  book: ObjectId (reference to Book),
  user: ObjectId (reference to User)
}
Prerequisites

Node.js (v14+)
MongoDB (local or Atlas)
npm or yarn

Installation

Clone the repository

git clone https://github.com/yourusername/book-review-api.git
cd book-review-api

Install dependencies

npm install

Set up environment variables
Create a .env file in the root directory with the following content:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-review-api
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
Running the Application
Development Mode
npm run dev
Production Mode
npm start
API Endpoints
Authentication Routes

POST /api/v1/auth/signup - Register a new user
POST /api/v1/auth/login - Authenticate and return a token
GET /api/v1/auth/me - Get current logged in user (Protected)

Book Routes

POST /api/v1/books - Add a new book (Protected)
GET /api/v1/books - Get all books (with pagination and optional filters)
GET /api/v1/books/:id - Get book details by ID (includes average rating and reviews)
GET /api/v1/books/search - Search books by title or author

Review Routes

POST /api/v1/books/:bookId/reviews - Submit a review for a book (Protected)
PUT /api/v1/reviews/:id - Update your own review (Protected)
DELETE /api/v1/reviews/:id - Delete your own review (Protected)

Example API Requests
Register a New User
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
Create a Book (Authenticated)
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic",
    "description": "The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession with the beautiful former debutante Daisy Buchanan.",
    "publishedYear": 1925,
    "publisher": "Charles Scribner'\''s Sons"
  }'
Get All Books with Pagination
curl -X GET "http://localhost:3000/api/v1/books?page=1&limit=10&genre=Classic"
Search for Books
curl -X GET "http://localhost:3000/api/v1/books/search?query=gatsby"
Add a Review for a Book (Authenticated)
curl -X POST http://localhost:3000/api/v1/books/BOOK_ID_HERE/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "rating": 5,
    "comment": "This is an amazing book! Highly recommended."
  }'
Design Decisions

Authentication: JWT was chosen for its stateless nature and scalability.
Database Schema: Relationships between books, users, and reviews are established using MongoDB references.
Error Handling: Centralized error handling middleware for consistent error responses.
Pagination: Implemented pagination for books and reviews to optimize performance.
Search: Case-insensitive search functionality for book titles and authors.

Future Improvements

Add book cover image upload
Implement rate limiting
Add user roles (admin, moderator)
Add more advanced filtering and sorting options
Add unit and integration tests
