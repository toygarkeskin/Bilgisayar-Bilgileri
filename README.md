# Bilgisayar Bilgileri

A modern computer components e-commerce web application developed with HTML, CSS, JavaScript, Node.js, Express and PostgreSQL.

The project allows users to browse computer hardware products and brands, manage their shopping carts and experience a test checkout flow, while providing administrators with a dedicated management panel to manage products, stock levels and customer orders.

---

# Project Overview

Bilgisayar Bilgileri is a full-stack e-commerce web application designed to present computer components, laptops and gaming peripherals through a user-friendly online shopping experience.

The application includes:

* Public e-commerce website
* Product and brand catalog
* Shopping cart and checkout flow
* Admin management panel
* Product and stock management
* Order management and tracking
* PostgreSQL database integration

---

# Features

## Admin Panel

* Manage products with create, read, update and delete operations
* Manage product stock levels
* View customer orders and order details
* Search and filter orders by status and date
* Update order statuses
* Export order lists to CSV
* View product, order and test payment statistics
* Admin login and logout functionality

## E-commerce Website

* Browse computer components and peripherals
* View products and brands
* Explore the homepage and company information
* Add products to the shopping cart
* Remove items from the cart
* Review the cart before checkout
* Submit customer information through the order form
* Access the test checkout and order tracking flow
* User-friendly website interface

## Backend & Security

* REST-style API endpoints using Express
* PostgreSQL database integration
* Server-side product price and stock validation
* Transaction-based order creation and stock updates
* Environment variable configuration with dotenv
* Admin session token generation and verification
* Order tracking code generation and hash storage
* Basic server health check endpoint

> **Note:** The checkout flow is for testing purposes and does not process real payments. Additional security review and testing are required before production use.

---

# Technologies Used

## Backend

* Node.js
* Express.js
* PostgreSQL
* node-postgres (`pg`)
* dotenv
* REST-style API endpoints
* SQL queries and database transactions
* CRUD Operations

## Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Browser Local Storage
* Browser Session Storage

## Security & Architecture

* Environment Variable Configuration
* Admin Session Verification
* Server-Side Input Validation
* Parameterized SQL Queries
* Order Tracking Code Hashing
* Static File Serving
* Separation of Frontend and Backend Responsibilities

---

# Architecture

The project follows a client-server architecture:

```text
Browser (HTML / CSS / JavaScript)
              ↓
       Node.js + Express
              ↓
          PostgreSQL
```

This architecture improves:

* maintainability
* modularity
* separation of concerns
* data consistency
* organization of frontend and backend responsibilities

---

# Project Structure

```text
Bilgisayar-Bilgileri/
│
├── OKUL/
│   ├── anasayfa.html
│   ├── hakkimizda.html
│   ├── ürünler.html
│   ├── markalar.html
│   ├── iletişim.html
│   ├── sepet.html
│   ├── satinalma.html
│   ├── hesap.html
│   ├── admin.html
│   ├── siparis-takip.html
│   └── CSS, JavaScript and image files
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── STOK_KURULUM.txt
└── README.md
```

---

# Screenshots

## Home Page

![Home Page](DOCUMENTS/01-anasayfa.png)

## About Page

![About Page](DOCUMENTS/02-hakkimizda%20(1).png)

## Products Page

![Products Page and Add-to-Cart Notification](DOCUMENTS/03-urunler-sepete-ekleme%20(1).png)

## Brands Page

![Brands Page](DOCUMENTS/04-markalar%20(1).png)

## Contact Page

![Contact Page](DOCUMENTS/05-iletisim%20(1).png)

## Shopping Cart

![Shopping Cart](DOCUMENTS/06-sepet%20(1).png)

## User Account Page

![User Account Login Page](DOCUMENTS/07-hesap-giris%20(1).png)

## Admin Panel — Product Management

![Admin Product Management](DOCUMENTS/08-admin-urunler%20(1).png)

## Admin Panel — Order Management

![Admin Order Management](DOCUMENTS/09-admin-siparisler%20(1).png)

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/toygarkeskin/Bilgisayar-Bilgileri.git
cd Bilgisayar-Bilgileri
```

## Install dependencies

```bash
npm install
```

## Configure the environment

Create a `.env` file in the project root and configure the following variables for your local environment:

```dotenv
PORT=3000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_local_database_password
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_long_random_session_secret
```

Configure PostgreSQL and prepare the required database tables according to the project's `STOK_KURULUM.txt` instructions. Do not commit real passwords or secret keys to the repository.

## Run the project

```bash
npm start
```

Open the application in your browser:

```text
http://localhost:3000
```

## Check the server

```bash
npm run check
```

The command checks the JavaScript syntax of `server.js`. It does not test every feature or confirm that the database connection is working.

---

# Learning Outcomes

Throughout this project, I practiced and developed my knowledge in:

* Full-stack web application development
* HTML, CSS and JavaScript
* Node.js and Express application development
* REST-style API design
* PostgreSQL database integration
* CRUD operations and SQL queries
* Shopping cart and checkout workflows
* Product and stock management
* Order processing and tracking
* Git and GitHub version control

---

# Developer

Toygar Keskin

Web Development | Node.js | Express | PostgreSQL

---

# License

If the repository does not include a `LICENSE` file, no open-source license has been specified. Add an appropriate license if you intend to define reuse and redistribution permissions.
