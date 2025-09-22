# Book Review API

A RESTful API for managing book reviews and user interactions.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Books

- GET /api/books
- POST /api/books
- GET /api/books/:id
- PUT /api/books/:id
- DELETE /api/books/:id

### Reviews

- GET /api/reviews
- POST /api/reviews
- GET /api/reviews/:id
- PUT /api/reviews/:id
- DELETE /api/reviews/:id
