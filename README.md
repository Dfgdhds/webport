Portfolio Project
Project Description
This project is a web application for creating and managing a portfolio, where users can register, log in, and add items to their portfolio. The application supports different access levels, such as administrator and editor, with the ability to add, edit, and delete portfolio items. JWT is used for user authentication.

Features
User Registration and Authentication: Users can register and log in with their username and password.
Portfolio Management: Users can add, edit, and delete portfolio items.

User Roles:
Administrator: Full access to all features.
Editor: Can add and edit portfolio items but cannot delete them.
Regular Users: Can view portfolio items.
Protected Routes: All portfolio actions are protected by JWT tokens, ensuring secure access to data.
Tech Stack

Backend:
Node.js
Express.js
MongoDB (using Mongoose for database operations)
JWT (JSON Web Tokens) for authentication
bcryptjs for password hashing
Nodemailer for sending email notifications
Frontend:
EJS (for server-side templating)
HTML, CSS for displaying data
Bootstrap (optional, for styling)


API Endpoints
Registration
POST /auth/register
Registers a new user.
Parameters:
username (string)
password (string)
firstName (string)
lastName (string)
age (number)
gender (string)
Response: Redirects to the login page.
Login
POST /auth/login
Logs in a user.
Parameters:
username (string)
password (string)
Response: Redirects to the home page and sets the JWT token.
Logout
GET /auth/logout
Logs out the user (removes the JWT token).
Portfolio Management
GET /portfolio

Displays portfolio items.
Protected by the isAuthenticated middleware.
POST /portfolio

Adds a new portfolio item.
Available only to users with the role of admin or editor.
PUT /portfolio/

Updates a portfolio item by its ID.
Available only to users with the role of admin.
DELETE /portfolio/

Deletes a portfolio item by its ID.
Available only to users with the role of admin.