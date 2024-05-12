# Node.js Server Setup

This repository contains the source code for a Node.js server. Follow the steps below to set up and run the server locally.

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/xyfer17/fitness-logging.git
cd fitness-logging
```

2. Create a `.env` file in the root directory and copy the contents from `.env.example` to `.env`. Modify the variables in the `.env` file as needed.

3. Set up the PostgreSQL database:

   - Install PostgreSQL if you haven't already.
   - Create a new database.
   - Update the database connection information in the `.env` file.

4. Run the database migrations to create the necessary tables:

```bash
node cli migrate
```

## Endpoints

Below are the endpoints provided by the server:

- Endpoint 1: `/api/v1/auth/register` - This endpoint allows the client to register a new user.

- Endpoint 2: `/api/v1/auth/send-verification-email` - This endpoint is used to send a verification email to the provided email address.

- Endpoint 3: `/api/v1//auth/verify-email/:token` - This endpoint is used to verify email using token.

- Endpoint 4: `/api/v1/auth/login` - This endpoint is used to authenticate a user and generate access and refresh tokens.

- Endpoint 5: `/api/v1/auth/refresh-tokens` - This endpoint is used to authenticate a user and regenerate access token using refresh token.

- Endpoint 6: `/api/v1/auth/logout` - This endpoint is used to log out the user from the application.

- Endpoint 7: `/api/v1/auth/forgot-password` - This endpoint is used to initiate the process of resetting a user's password by sending a reset link to the provided email address.

- Endpoint 8: `/api/v1/auth/reset-password/:token` - The endpoint triggers an HTTP POST request to reset the password using the provided token in the URL. The request body should contain the user's email, new password, and confirmation of the new password.

- Endpoint 9: `/api/v1/users/create-exercise-log` - The endpoint allows the creation of an exercise log for a user.

- Endpoint 10: `/api/v1/users/create-weight-log` - The endpoint allows the creation of an weight log for a user.

For detailed information about each endpoint, refer to the [Postman Documentation](https://documenter.getpostman.com/view/28605013/2sA3JNaLLg).

## Running the Server

To run the server locally, use the following command:

```bash
npm run start:dev
```

The server will start running on port 4500 by default. You can access it at `http://localhost:4500`.
