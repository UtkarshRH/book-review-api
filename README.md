# Book Review API

A RESTful API built with Node.js and Express.js for managing books, user reviews, and authentication. This API allows users to create accounts, manage books, and share their reviews.

## Features

- User authentication and authorization
- CRUD operations for books and reviews
- Pagination support
- Error handling middleware
- MongoDB integration
- JWT-based authentication
- Docker support

## Project Structure

```
book-review-api/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── books.controller.js   # Book management logic
│   │   └── reviews.controller.js # Review management logic
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   └── error.middleware.js   # Error handling middleware
│   ├── models/
│   │   ├── Book.js        # Book schema and model
│   │   ├── Review.js      # Review schema and model
│   │   └── User.js        # User schema and model
│   ├── routes/
│   │   ├── auth.routes.js    # Authentication routes
│   │   ├── books.routes.js   # Book management routes
│   │   └── reviews.routes.js # Review management routes
│   └── utils/
│       └── paginate.js    # Pagination utility
├── Dockerfile             # Docker configuration
├── package.json           # Project dependencies and scripts
└── README.md             # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/UtkarshRH/book-review-api.git
   cd book-review-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Setup

To run the application using Docker:

```bash
# Build the Docker image
docker build -t book-review-api .

# Run the container
docker run -p 3000:3000 -d book-review-api
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Create a new user account.

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### POST /api/auth/login

Login with existing credentials.

```json
{
  "email": "string",
  "password": "string"
}
```

### Books Endpoints

#### GET /api/books

Get all books with pagination support.

- Query Parameters:
  - page: Current page number (default: 1)
  - limit: Items per page (default: 10)
  - search: Search books by title

#### POST /api/books

Create a new book (requires authentication).

```json
{
  "title": "string",
  "author": "string",
  "description": "string",
  "publishedYear": "number"
}
```

#### GET /api/books/:id

Get a specific book by ID.

#### PUT /api/books/:id

Update a book (requires authentication).

#### DELETE /api/books/:id

Delete a book (requires authentication).

### Reviews Endpoints

#### GET /api/reviews

Get all reviews with pagination support.

- Query Parameters:
  - page: Current page number (default: 1)
  - limit: Items per page (default: 10)
  - bookId: Filter reviews by book

#### POST /api/reviews

Create a new review (requires authentication).

```json
{
  "bookId": "string",
  "rating": "number",
  "comment": "string"
}
```

#### GET /api/reviews/:id

Get a specific review by ID.

#### PUT /api/reviews/:id

Update a review (requires authentication).

#### DELETE /api/reviews/:id

Delete a review (requires authentication).

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## License

This project is licensed under the MIT License.
