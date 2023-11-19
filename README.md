# Description

## Project description

### Overview

"Discover and reserve unique places effortlessly with our dynamic web and mobile app. Powered by the MERN stack, our platform offers seamless registration and login through Google, Facebook, and GitHub. Explore curated locations, view detailed information, and make reservations with ease using an interactive map and user-friendly calendar. The application supports flexible role-based access, allowing administrators to manage users, places, and reservations. Future updates will introduce online payment, tournaments, and detailed user statistics. Experience a modern, intuitive, and feature-rich way to connect with places and events."

### Future features

we will include online payment integration, tournament hosting, and ranks with stats (wins - losses).

## Project details

### Stack used

Mern stack (MongoDB , Express.js , React and Node.js)

### Technologies

- Node.js
- Express
- MongoDB
- React and React-native (frontend)

## Packages used

- JWT
- bcrypt
- mongoose
- passport
- cors

### User Authentication

- Use Express.js to create endpoints for user registration and login.
- Integrate various authentication strategies for Google, Facebook, and GitHub using relevant npm packages.
- Implement middleware for user authentication and authorization.
- Define user roles and permissions to manage access levels.

### Place Management

- Set up MongoDB as the database to store information about different types of places, details, and reservations.
- Create Express.js endpoints for retrieving place information, managing reservations, and handling other place-related actions.

### Administration

-Implement admin-related functionality using Express.js, allowing admins to manage users, places, and reservations.
-Use role-based access control to ensure that only authorized users can perform administrative actions.

### Authentication Integration

Develop middleware to integrate authentication with various user actions, ensuring that only authenticated users can perform certain actions.
Implement token-based authentication for secure communication between the frontend and backend.

TODOS : moved to [backend tasks](backend_tasks.md)
