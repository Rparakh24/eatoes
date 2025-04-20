# 🍽️ EATOES – Digital Restaurant Menu and Ordering System


## 📖 Description

Eatoes is a full-stack digital restaurant menu and ordering system designed to streamline the dining experience. Customers can easily browse the menu, add items to their cart, and place orders online. The system also provides administrative functionalities to manage the menu items efficiently.

## ✨ Key Features

-   **User Authentication:** Secure signup and sign-in functionality for customers.
-   **Menu Browsing:** Intuitive interface to view menu items categorized for easy navigation.
-   **Search Functionality:** Ability to search for specific menu items by name.
-   **Shopping Cart:** Add, update, and view items in the cart before placing an order.
-   **Order Placement:** Simple process for users to submit their orders.
-   **Order History:** Users can view their past order details.
-   **Admin Menu Management:** Protected routes for administrators to add and remove menu items.

## 🛠️ Technologies Used

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB (for menu items), PostgreSQL (using Prisma for user and order data)
-   **Authentication:** JSON Web Tokens (JWT)
-   **Validation:** Zod

## 🚀 Getting Started

### Prerequisites

-   Node.js (version >= 18)
-   npm or yarn
-   MongoDB installed and running
-   PostgreSQL installed and running

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file in the `backend` directory.
    -   Add the following environment variables (replace with your actual values):

        ```env
        MONGO_URI=your_mongodb_connection_string
        DATABASE_URL=your_postgresql_connection_string
        JWT_SECRET=your_secret_key_for_jwt
        ```

4.  **Set up Prisma:**
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Run the backend server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server should now be running on `http://localhost:<your_backend_port>`.

## ⚙️ API Endpoints

This section provides a brief overview of the available API endpoints and includes dummy JSON request and response examples.

### Menu Items (`/api/menu`)

-   `POST /add`: \[Admin] Add a new menu item. Requires item details in the request body.
    **Request Body Example:**
    ```json
    [
      {
        "name": "Cheeseburger",
        "description": "Classic beef burger with cheese.",
        "price": 9.99,
        "category": "Burgers",
        "image": "cheeseburger.jpg"
      },
      {
        "name": "Margherita Pizza",
        "description": "Tomato sauce, mozzarella, and basil.",
        "price": 12.50,
        "category": "Pizzas",
        "image": "margherita.jpg"
      }
    ]
    ```
    **Response (Status 201 Created):**
    ```json
    [
      {
        "_id": "65d9a7e4f8d7a2c3b1e09a1a",
        "name": "Cheeseburger",
        "description": "Classic beef burger with cheese.",
        "price": 9.99,
        "category": "Burgers",
        "image": "cheeseburger.jpg",
        "__v": 0
      },
      {
        "_id": "65d9a7e4f8d7a2c3b1e09a1b",
        "name": "Margherita Pizza",
        "description": "Tomato sauce, mozzarella, and basil.",
        "price": 12.50,
        "category": "Pizzas",
        "image": "margherita.jpg",
        "__v": 0
      }
    ]
    ```

-   `GET /get`: \[Admin] Get all menu items.
    **Response (Status 200 OK):**
    ```json
    [
      {
        "_id": "65d9a7e4f8d7a2c3b1e09a1a",
        "name": "Cheeseburger",
        "description": "Classic beef burger with cheese.",
        "price": 9.99,
        "category": "Burgers",
        "image": "cheeseburger.jpg",
        "__v": 0
      },
      {
        "_id": "65d9a7e4f8d7a2c3b1e09a1b",
        "name": "Margherita Pizza",
        "description": "Tomato sauce, mozzarella, and basil.",
        "price": 12.50,
        "category": "Pizzas",
        "image": "margherita.jpg",
        "__v": 0
      }
      // ... more items
    ]
    ```

-   `PUT /remove?itemId={itemId}`: \[Admin] Remove a menu item by its ID.
    **Request Example:** `/api/menu/remove?itemId=65d9a7e4f8d7a2c3b1e09a1a`
    **Response (Status 200 OK):**
    ```json
    {
      "msg": "Item deleted",
      "deletedItem": {
        "_id": "65d9a7e4f8d7a2c3b1e09a1a",
        "name": "Cheeseburger",
        "description": "Classic beef burger with cheese.",
        "price": 9.99,
        "category": "Burgers",
        "image": "cheeseburger.jpg",
        "__v": 0
      }
    }
    ```

-   `GET /`: \[User] Get menu items, optionally filtered by name using the `filter` query parameter (e.g., `/api/menu?filter=burger`). Requires user authentication.
    **Request Example:** `/api/menu` or `/api/menu?filter=pizza`
    **Response (Status 200 OK):**
    ```json
    {
      "Burgers": [
        {
          "_id": "65d9a7e4f8d7a2c3b1e09a1a",
          "name": "Cheeseburger",
          "description": "Classic beef burger with cheese.",
          "price": 9.99,
          "category": "Burgers",
          "image": "cheeseburger.jpg",
          "__v": 0
        },
        // ... more burgers
      ],
      "Pizzas": [
        {
          "_id": "65d9a7e4f8d7a2c3b1e09a1b",
          "name": "Margherita Pizza",
          "description": "Tomato sauce, mozzarella, and basil.",
          "price": 12.50,
          "category": "Pizzas",
          "image": "margherita.jpg",
          "__v": 0
        },
        // ... more pizzas
      ],
      // ... more categories
    }
    ```

### User Authentication (`/api/user`)

-   `POST /signup`: Register a new user. Requires `email` and `password` in the request body.
    **Request Body Example:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
    **Response (Status 200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjc5MzEwNDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
    ```
    **Response (Status 403 Forbidden - Wrong format):**
    ```json
    {
      "msg": "Wrong format"
    }
    ```
    **Response (Status 403 Forbidden - User already exists):**
    ```json
    {
      "msg": "User already exist"
    }
    ```

-   `POST /signin`: Log in an existing user. Requires `email` and `password` in the request body. Returns a JWT token upon successful authentication.
    **Request Body Example:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
    **Response (Status 200 OK):**
    ```json
    {
      "msg": "Signin Success",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjc5MzEwNDAwfQ.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
    }
    ```
    **Response (Status 403 Forbidden - Invalid Input):**
    ```json
    {
      "msg": "Invalid Input"
    }
    ```
    **Response (Status 401 Unauthorized - User does not exist):**
    ```json
    {
      "msg": "User does not exist"
    }
    ```

### Shopping Cart (`/api/user/cart`)

-   `POST /`: \[User] Add items to the cart or update their quantities. Requires authentication and an object with `itemId` and `quantity` in the request body.
    **Request Body Example:**
    ```json
    {
      "itemId": "65d9a7e4f8d7a2c3b1e09a1a",
      "quantity": 2
    }
    ```
    **Response (Status 200 OK):**
    ```json
    {
      "msg": "Cart updated",
      "cart": [
        {
          "itemId": "65d9a7e4f8d7a2c3b1e09a1a",
          "quantity": 2
        }
        // ... other items in cart
      ]
    }
    ```
    **Response (Status 403 Forbidden - Invalid Input):**
    ```json
    {
      "msg": "Invalid Input"
    }
    ```
    **Response (Status 403 Forbidden - User not found):**
    ```json
    {
      "msg": "User not found"
    }
    ```

-   `GET /`: \[User] Get the current user's cart details, including the total price and information about each item. Requires authentication.
    **Response (Status 200 OK):**
    ```json
    {
      "cart": [
        {
          "userId": 1,
          "itemId": "65d9a7e4f8d7a2c3b1e09a1a",
          "name": "Cheeseburger",
          "price": 9.99,
          "quantity": 2,
          "itemTotal": 19.98
        }
        // ... other items in cart with details
      ],
      "totalCartPrice": 19.98
    }
    ```

### Orders (`/api/user/order`)

-   `POST /`: \[User] Place an order with the items currently in the user's cart. Requires authentication. Clears the user's cart upon successful order placement.
    **Response (Status 200 OK):**
    ```json
    {
      "msg": "Order created successfully",
      "order": {
        "id": 1,
        "userId": 1,
        "totalPrice": 19.98,
        "items": [
          {
            "itemId": "65d9a7e4f8d7a2c3b1e09a1a",
            "quantity": 2,
            "name": "Cheeseburger",
            "price": 9.99,
            "itemTotal": 19.98
          }
          // ... other ordered items
        ],
        "createdAt": "2025-04-20T16:30:00.000Z",
        "updatedAt": "2025-04-20T16:30:00.000Z"
      }
    }
    ```
    **Response (Status 403 Forbidden - Invalid Input):**
    ```json
    {
      "msg": "Invalid Input"
    }
    ```

-   `GET /allorder`: \[User] Get all past orders for the authenticated user. Requires authentication.
    **Response (Status 200 OK):**
    ```json
    {
      "orders": [
        {
          "id": 1,
          "userId": 1,
          "totalPrice": 19.98,
          "items": [
            {
              "itemId": "65d9a7e4f8d7a2c3b1e09a1a",
              "quantity": 2,
              "name": "Cheeseburger",
              "price": 9.99,
              "itemTotal": 19.98
            }
          ],
          "createdAt": "2025-04-20T16:30:00.000Z",
          "updatedAt": "2025-04-20T16:30:00.000Z"
        },
        {
          "id": 2,
          "userId": 1,
          "totalPrice": 12.50,
          "items": [
            {
              "itemId": "65d9a7e4f8d7a2c3b1e09a1b",
              "quantity": 1,
              "name": "Margherita Pizza",
              "price": 12.50,
              "itemTotal": 12.50
            }
          ],
          "createdAt": "2025-04-19T18:00:00.000Z",
          "updatedAt": "2025-04-19T18:00:00.000Z"
        }
        // ... more past orders
      ]
    }
    ```
    **Response (Status 403 Forbidden - Invalid Input):**
    ```json
    {
      "msg": "Invalid Input"
    }
    ```

## 🛡️ Authentication

Most user-related routes (browsing menu, managing cart, placing orders) are protected using JWT authentication. Users need to sign in to receive a JWT token, which must be included in the `Authorization` header as a Bearer token for accessing these protected routes.

Admin routes (adding and removing menu items) are not explicitly defined with separate middleware in the provided code. You would typically implement an admin authentication middleware to protect these routes based on user roles or specific credentials.

## Run Locally
Change the backend_url in ./frontend/src/config to "http:localhost:3000/"

## 🙏 Acknowledgements

-   [Express.js](https://expressjs.com/) for the web framework.
-   [Prisma](https://www.prisma.io/) for the modern database toolkit.
-   [MongoDB](https://www.mongodb.com/) for the NoSQL database.
-   [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for JWT implementation.
-   [zod](https://zod.dev/) for schema validation.
