Task Manager API
A simple Task Manager API built using Node.js and Sequelize ORM. This API allows users to manage tasks with features like authentication, task creation, updating, and deletion. It uses a MySQL database and implements security with JWT authentication and bcrypt for password hashing.

Table of Contents
Features
Technologies
Installation
Environment Variables
API Endpoints
Running Locally
License
Features
User registration and login with JWT authentication
Task creation, update, deletion, and retrieval
Password hashing with bcrypt
Environment variable management with dotenv
Technologies
Node.js: JavaScript runtime environment
Express: Web framework for Node.js
Sequelize: Promise-based Node.js ORM for SQL databases
MySQL: Relational database used for storing user and task data
bcrypt: Library to hash passwords for authentication
jsonwebtoken (JWT): For token-based user authentication
dotenv: Loads environment variables from a .env file
nodemon: Development tool for automatically restarting the server on file changes