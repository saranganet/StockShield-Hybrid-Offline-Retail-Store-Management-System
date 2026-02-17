# ER Diagram — StockShield

### **1. Overview**

The StockShield database serves as the core transactional backbone of the retail management system. It is designed to ensure reliable billing, inventory tracking, and payment recording even in environments with unstable internet connectivity.

The system follows a hybrid offline-first model where sales, payments, and stock updates are recorded locally and synchronized with the central server when connectivity is restored. The database schema is structured to maintain financial integrity, stock consistency, and audit transparency across all operations.

The design prioritizes data consistency, normalization, and transactional reliability.

---

### **2. ER Diagram**

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar name
        varchar email UK
        varchar password_hash
        enum role "ADMIN | STAFF"
        boolean is_active
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        varchar name
        timestamp created_at
    }

    PRODUCTS {
        uuid id PK
        varchar name
        decimal price
        integer stock_quantity
        uuid category_id FK
        timestamp updated_at
    }

    SUPPLIERS {
        uuid id PK
        varchar name
        varchar contact_info
        timestamp created_at
    }

    SALES_INVOICES {
        uuid id PK
        uuid user_id FK
        decimal total_amount
        enum sync_status "PENDING | SYNCED"
        timestamp created_at
    }

    INVOICE_ITEMS {
        uuid id PK
        uuid invoice_id FK
        uuid product_id FK
        integer quantity
        decimal unit_price
    }

    PAYMENTS {
        uuid id PK
        uuid invoice_id FK
        decimal amount
        enum method "CASH | UPI | CARD"
        enum sync_status "PENDING | SYNCED"
        timestamp paid_at
    }

    PURCHASE_ORDERS {
        uuid id PK
        uuid supplier_id FK
        decimal total_amount
        enum status "CREATED | RECEIVED"
        timestamp created_at
    }

    STOCK_MOVEMENTS {
        uuid id PK
        uuid product_id FK
        integer quantity
        enum movement_type "IN | OUT"
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        varchar action
        json metadata
        timestamp created_at
    }

    %% ===== RELATIONSHIPS =====
    USERS ||--o{ SALES_INVOICES : creates
    USERS ||--o{ AUDIT_LOGS : generates
    CATEGORIES ||--o{ PRODUCTS : groups
    SALES_INVOICES ||--o{ INVOICE_ITEMS : contains
    PRODUCTS ||--o{ INVOICE_ITEMS : referenced_in
    SALES_INVOICES ||--o{ PAYMENTS : has
    SUPPLIERS ||--o{ PURCHASE_ORDERS : supplies
    PRODUCTS ||--o{ STOCK_MOVEMENTS : tracked_by
```

---

### **3. Table Summary**

| Table | Description |
| --- | --- |
| `USERS` | Internal system users such as Admin and Staff with role-based access control. |
| `CATEGORIES` | Logical grouping of products for better organization and filtering. |
| `PRODUCTS` | Stores product details including price and available stock quantity. |
| `SUPPLIERS` | Stores supplier/vendor information for stock procurement. |
| `SALES_INVOICES` | Represents billing transactions created during product sales. |
| `INVOICE_ITEMS` | Stores individual product entries within each invoice. |
| `PAYMENTS` | Records financial transactions linked to invoices, including offline sync status. |
| `PURCHASE_ORDERS` | Represents stock purchase transactions from suppliers. |
| `STOCK_MOVEMENTS` | Tracks stock increases (purchases) and decreases (sales). |
| `AUDIT_LOGS` | Maintains logs of important system operations for accountability and recovery. |

---

### **4. Key Indexes**

| Table | Index | Purpose |
| --- | --- | --- |
| `USERS` | `(email)` | Enables fast authentication lookup during login. |
| `PRODUCTS` | `(category_id)` | Optimizes filtering products by category. |
| `SALES_INVOICES` | `(user_id)` | Enables invoice retrieval by staff member. |
| `INVOICE_ITEMS` | `(invoice_id)` | Improves performance when fetching invoice details. |
| `PAYMENTS` | `(sync_status)` | Allows background sync engine to identify pending payments. |
| `STOCK_MOVEMENTS` | `(product_id)` | Enables fast stock history retrieval. |
| `PURCHASE_ORDERS` | `(supplier_id)` | Supports supplier-based purchase tracking. |

These indexes ensure high performance during billing, stock tracking, and reconciliation processes.

---

### **5. Relationship Summary**

- **User Operations:** Internal `USERS` create `SALES_INVOICES` and generate `AUDIT_LOGS` for system actions.
- **Billing Structure:** Each `SALES_INVOICE` contains multiple `INVOICE_ITEMS`, and each invoice can have one or more `PAYMENTS`.
- **Product Management:** Each `PRODUCT` belongs to a `CATEGORY` and may appear in multiple invoice records.
- **Inventory Flow:** `STOCK_MOVEMENTS` record stock increases (purchase) and decreases (sale).
- **Supplier Transactions:** `SUPPLIERS` are linked to `PURCHASE_ORDERS` for inventory restocking.
- **Sync Integrity:** Tables containing financial or transactional data include `sync_status` fields to support hybrid offline-first synchronization.

The relational structure ensures data consistency, referential integrity, and reliable transaction handling across billing and inventory workflows.

