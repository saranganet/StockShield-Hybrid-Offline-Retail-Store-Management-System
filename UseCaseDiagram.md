# Use Case Diagram — StockShield

## Overview

This diagram represents the major functional interactions within the **StockShield** retail management system.

StockShield is designed for small and medium retail shops that require:

- Continuous billing even during internet outages  
- Accurate inventory tracking  
- Reliable financial record keeping  
- Proper audit logging and accountability  
- Role-based access control  

The system follows an **offline-first architecture**, ensuring that sales, payments, and stock updates continue locally and synchronize automatically when connectivity is restored.

The primary actors are:

- **Store Owner**
- **Staff (Cashier)**
- **Supplier**

---

## Use Case Diagram

```mermaid
graph TB
    subgraph StockShield System
        UC1["Login / Authenticate"]
        UC2["Manage Products"]
        UC3["Manage Categories"]
        UC4["Create Sales Invoice"]
        UC5["Process Payment (Cash/UPI/Card)"]
        UC6["Auto Deduct Stock"]
        UC7["Manage Suppliers"]
        UC8["Create Purchase Order"]
        UC9["Receive Stock"]
        UC10["View Sales Reports"]
        UC11["View Inventory Reports"]
        UC12["Generate Audit Logs"]
        UC13["Sync Offline Transactions"]
        UC14["Manage Staff Roles"]
    end

    Owner((Store Owner))
    Staff((Staff / Cashier))
    Supplier((Supplier))

    %% Staff Actions
    Staff --> UC1
    Staff --> UC4
    Staff --> UC5
    Staff --> UC6

    %% Owner Actions
    Owner --> UC1
    Owner --> UC2
    Owner --> UC3
    Owner --> UC7
    Owner --> UC8
    Owner --> UC10
    Owner --> UC11
    Owner --> UC14

    %% Supplier Interaction
    Supplier --> UC9

    %% System-driven logic
    UC4 --> UC6
    UC4 --> UC12
    UC8 --> UC9
    UC9 --> UC12

    %% Offline behavior
    UC4 -.->|if offline| UC13
    UC5 -.->|if offline| UC13
