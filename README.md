# Modern Invoicing System

A full-stack mini invoicing system built with React, Node.js, Express, and MongoDB.

Test Credentials - 
E-mail - test@example.com
Password - test1234

## Features

- User registration and login
- JWT-based authentication
- Client CRUD
- Create invoices with multiple items
- Automatic subtotal, tax, and total calculation
- Invoice status management
- Filter invoices by status, client, and date
- View individual invoices
- Mark invoices as paid
- Printable invoice view
- Premium user invoice branding
- Premium logo support

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
invoice-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md
