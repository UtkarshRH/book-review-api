# API Testing Guide

This guide provides examples of how to test all endpoints of the Book Review API using both cURL commands and Postman.

Base URL: `http://localhost:3000` (for local testing)

Deployed:

Base URL: `https://book-review-api-dwec.onrender.com`

## Authentication Endpoints

### 1. Register a New User (Signup)

```bash
curl -X POST https://book-review-api-dwec.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected Response:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 2. Login

```bash
curl -X POST https://book-review-api-dwec.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected Response:

```json
{
  "status": "success",
  "token": "your_jwt_token",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

## Books Endpoints

### 1. Add a New Book (Authenticated)

```bash
curl -X POST https://book-review-api-dwec.onrender.com/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A story of the fabulously wealthy Jay Gatsby",
    "publishedYear": 1925,
    "genre": "Fiction"
  }'
```

Expected Response:

```json
{
  "status": "success",
  "data": {
    "id": "book_id",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A story of the fabulously wealthy Jay Gatsby",
    "publishedYear": 1925,
    "genre": "Fiction",
    "createdAt": "2025-09-23T..."
  }
}
```

### 2. Get All Books (with Pagination)

```bash
# Basic pagination
curl "https://book-review-api-dwec.onrender.com/api/books?page=1&limit=10"

# With author filter
curl "https://book-review-api-dwec.onrender.com/api/books?author=Fitzgerald&page=1&limit=10"

# With genre filter
curl "https://book-review-api-dwec.onrender.com/api/books?genre=Fiction&page=1&limit=10"
```

Expected Response:

```json
{
  "status": "success",
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "limit": 10
    }
  }
}
```

### 3. Get Book Details by ID

```bash
curl https://book-review-api-dwec.onrender.com/api/books/book_id
```

Expected Response:

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "book_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "...",
      "publishedYear": 1925,
      "genre": "Fiction",
      "averageRating": 4.5,
      "reviews": {
        "items": [...],
        "pagination": {
          "currentPage": 1,
          "totalPages": 2,
          "totalItems": 15,
          "limit": 10
        }
      }
    }
  }
}
```

### 4. Search Books

```bash
# Search by title
curl "https://book-review-api-dwec.onrender.com/api/search?query=gatsby"

# Search by author
curl "https://book-review-api-dwec.onrender.com/api/search?query=fitzgerald"
```

Expected Response:

```json
{
  "status": "success",
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 2,
      "limit": 10
    }
  }
}
```

## Reviews Endpoints

### 1. Submit a Review (Authenticated)

```bash
curl -X POST https://book-review-api-dwec.onrender.com/api/books/book_id/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "rating": 5,
    "comment": "A masterpiece of American literature!"
  }'
```

Expected Response:

```json
{
  "status": "success",
  "data": {
    "id": "review_id",
    "bookId": "book_id",
    "userId": "user_id",
    "rating": 5,
    "comment": "A masterpiece of American literature!",
    "createdAt": "2025-09-23T..."
  }
}
```

### 2. Update a Review (Authenticated)

```bash
curl -X PUT https://book-review-api-dwec.onrender.com/api/reviews/review_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "rating": 4,
    "comment": "Updated: Still a great book, but not perfect."
  }'
```

Expected Response:

```json
{
  "status": "success",
  "data": {
    "id": "review_id",
    "bookId": "book_id",
    "userId": "user_id",
    "rating": 4,
    "comment": "Updated: Still a great book, but not perfect.",
    "updatedAt": "2025-09-23T..."
  }
}
```

### 3. Delete a Review (Authenticated)

```bash
curl -X DELETE https://book-review-api-dwec.onrender.com/api/reviews/review_id \
  -H "Authorization: Bearer your_jwt_token"
```

Expected Response:

```json
{
  "status": "success",
  "message": "Review deleted successfully"
}
```

## Common Error Responses

### Authentication Error

```json
{
  "status": "error",
  "message": "Unauthorized",
  "code": "AUTH_ERROR"
}
```

### Validation Error

```json
{
  "status": "error",
  "message": "Invalid input data",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "rating",
      "message": "Rating must be between 1 and 5"
    }
  ]
}
```

### Not Found Error

```json
{
  "status": "error",
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

## Testing with Postman

1. Import the following cURL commands into Postman
2. Create an environment in Postman with variables:
   - `baseUrl`: https://book-review-api-dwec.onrender.com
   - `token`: (to be set after login)
3. After successful login, set the `token` environment variable with the received JWT token
4. Use the environment variables in your requests:
   - URL: `{{baseUrl}}/api/books`
   - Headers: `Authorization: Bearer {{token}}`

## Test Flow

1. Register a new user
2. Login and save the token
3. Add a new book
4. Search for the book
5. Get book details
6. Add a review
7. Update the review
8. Delete the review
9. Test pagination and filters

Remember to:

- Handle errors appropriately
- Test edge cases
- Verify authentication is working
- Check pagination works correctly
- Ensure one review per user per book
- Verify users can only modify their own reviews
