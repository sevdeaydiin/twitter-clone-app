# Twitter API 🚀
Twitter API is a backend service designed to power the core functionalities of a social media application. This API allows users to register, log in, create posts, upload images, and manage interactions. It is built with Node.js, Express, and MongoDB to ensure scalability, performance, and ease of integration.

## 📂 Features
- **User Authentication:**
  - Secure user registration and login using jsonwebtoken and bcryptjs.
- **Post Management:**
  - CRUD (Create, Read, Update, Delete) operations for posts.
- **Image Upload:**
  - Handle image uploads with multer and optimize them using sharp.
- **Data Validation:**
  - Input validation with validator for secure and consistent data.
- **Scalable Database:**
  - Use of mongoose for robust MongoDB schema and model management.

## 🛠️ Technologies Used
- **Node.js:** JavaScript runtime for building fast and scalable server-side applications.
- **Express:** Web framework for building RESTful APIs.
- **MongoDB:** NoSQL database for storing user and post data.
- **Multer:** Middleware for handling file uploads.
- **Sharp:** Image processing library for optimizing uploaded images.
- **JSON Web Tokens (JWT):** For secure authentication and authorization.
- **Dotenv:** For managing environment variables.
- **Bcrypt.js:** For password hashing and security.

## 🔧 Installation
To run this project locally, follow these steps:

1. Clone the repository:
```bash
  git clone https://github.com/sevdeaydiin/twitter-api.git
```

2. Navigate to the project directory:
```bash
  cd twitter-api
```

3. Install dependencies:
```bash
  npm install
```

4. Create a .env file in the root directory and configure your environment variables:
```bash
  PORT=3000
  MONGO_URI=mongodb+srv://sevdeaydiin:rMsZOA7LBQdBrcfR@sevdeaydin.gpinw2f.mongodb.net/
```

5. Start the server in development mode:
```bash
  npm run dev
```

6. Test API endpoints using tools like Postman or cURL.

## 🌟 Future Plans
- Add real-time functionality with WebSocket for notifications.
- Implement API rate limiting for enhanced security.
- Add detailed API documentation using Swagger or Postman Collections.

## 🤝🏻 Contribution
Contributions are welcome! Feel free to:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request for review.

# 📧 Contact
For inquiries or support, you can reach out via email: svde.aydin@gmail.com


