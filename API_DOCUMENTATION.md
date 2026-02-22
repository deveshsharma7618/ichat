# iChat Authentication API Documentation

## Setup Instructions

### 1. Environment Variables

Copy the `.env.local.example` file to `.env.local`:
```bash
cp .env.local.example .env.local
```

Then update the following variables in `.env.local`:

- **MONGODB_URI**: Your MongoDB connection string
  - Local: `mongodb://localhost:27017`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/ichat`
  
- **JWT_SECRET**: A secure random string for JWT token signing
  - Generate one using: `openssl rand -base64 32`

### 2. Install Dependencies

The following packages are required and have been installed:
- `mongodb` - MongoDB driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

## API Endpoints

### 1. Sign Up

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing fields, invalid email, or passwords don't match
- `409` - Email already registered
- `500` - Internal server error

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Internal server error

## Database Structure

### Users Collection

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,          // Stored in lowercase
  password: string,       // Hashed using bcrypt
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds of 10
2. **JWT Authentication**: Tokens expire after 7 days
3. **Email Validation**: Email format is validated before registration
4. **Case-Insensitive Email**: All emails are stored in lowercase
5. **Password Requirements**: Minimum 6 characters

## Usage in Frontend

### Example: Sign Up

```typescript
const handleSignup = async (formData) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage or cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect to dashboard
    } else {
      // Handle error
      console.error(data.error);
    }
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

### Example: Login

```typescript
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage or cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect to dashboard
    } else {
      // Handle error
      console.error(data.error);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## Next Steps

1. Create protected routes using the JWT token
2. Add email verification
3. Implement password reset functionality
4. Add refresh token mechanism
5. Implement session management
6. Add rate limiting for security
