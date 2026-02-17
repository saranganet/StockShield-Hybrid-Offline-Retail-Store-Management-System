# StockShield

## Project Description

StockShield is a full-stack retail store management system designed for small and medium shops.

The system helps manage products, billing, payments, suppliers, and inventory tracking. It is designed using an offline-first approach so that the billing system can continue working even if the internet connection is unstable.

The main focus of this project is backend architecture, transaction handling, and proper database design.

---

## Problem

Many small retail shops still rely on manual billing or basic POS systems that stop working when the internet fails.

Common issues:
- Billing stops during internet downtime
- Stock records become inconsistent
- Payments are not recorded properly
- No audit or recovery mechanism

This project aims to solve these issues using a hybrid system design.

---

## Features

- Product management (Add, Update, Delete, View)
- Category management
- Billing and invoice generation
- Automatic stock deduction on sales
- Purchase order management
- Supplier management
- Multiple payment modes (Cash, UPI, Card)
- Audit logs
- Offline data storage and later synchronization

---

## System Design

The backend follows a layered architecture:

Controller Layer  
Handles incoming requests and responses.

Service Layer  
Contains business logic and validation.

Repository Layer  
Handles database operations.

This separation improves maintainability and scalability.

---

## Technologies Used

Frontend:
- React
- TypeScript
- IndexedDB (for offline storage)

Backend:
- Node.js
- Express.js
- MySQL
- Prisma ORM

Other:
- REST APIs
- WebSocket (for sync updates)

---

## Objective

The objective of this project is to design a reliable retail management system with strong backend architecture and proper transaction management.

The system emphasizes clean code structure, OOP principles, and database consistency.
