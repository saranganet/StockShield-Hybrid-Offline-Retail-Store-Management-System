# Sequence Diagram — StockShield

## **Overview**

This diagram illustrates what happens inside StockShield when a retail store generates a bill during an internet outage and later synchronizes all financial and inventory data once connectivity is restored.

It demonstrates how billing continues without interruption using local storage, how transactional integrity is preserved during background synchronization, and how the store owner receives real-time updates once the cloud database is reconciled.

The system follows an offline-first architecture built with React + IndexedDB on the frontend and Node.js + Express + MySQL (via Prisma ORM) on the backend.

---

```mermaid
sequenceDiagram
    actor C as Customer
    actor S as Staff
    actor O as Owner
    participant FE as Frontend (React + IndexedDB)
    participant SW as Service Worker (Sync Engine)
    participant API as Backend API (Express)
    participant DB as Cloud Database (MySQL + Prisma)
    participant WSocket as WebSocket Server

    Note over C, FE: Phase 1 — Offline Billing (Zero Downtime Checkout)

    C ->> S: Brings products to counter
    S ->> FE: Create New Invoice
    FE ->> FE: Fetch products from Local IndexedDB
    S ->> FE: Add items (quantity)
    FE ->> FE: Calculate total (generateTotal())
    FE ->> FE: Deduct stock locally
    FE ->> FE: Create invoice (sync_status=PENDING)
    FE ->> FE: Create payment record (sync_status=PENDING)
    FE -->> S: "Invoice Generated (Offline Mode)"
    FE -->> C: Print / Show Bill

    Note over FE, DB: Phase 2 — Connection Restored & Background Sync

    SW ->> SW: Detect Internet Reconnection
    SW ->> FE: Fetch all PENDING invoices & payments
    FE -->> SW: Return pending records
    SW ->> API: POST /api/sync/bulk (Invoices + Payments + StockMovements)

    API ->> API: Begin DB Transaction
    API ->> DB: Insert SALES_INVOICES
    API ->> DB: Insert INVOICE_ITEMS
    API ->> DB: Insert PAYMENTS
    API ->> DB: Insert STOCK_MOVEMENTS (OUT)
    API ->> DB: Insert AUDIT_LOGS
    API ->> API: Commit Transaction

    DB -->> API: Success
    API -->> SW: 201 Created (Synced Successfully)

    SW ->> FE: Update local sync_status=SYNCED
    FE -->> S: "All offline data synced"

    Note over API, O: Phase 3 — Real-Time Owner Visibility

    API ->> WSocket: Emit "sales_update" (invoice_id, total_amount)
    WSocket -->> FE: Broadcast sales & inventory update
    FE -->> O: Dashboard updates:
    FE -->> O: • Total Sales Updated
    FE -->> O: • Stock Levels Adjusted
    FE -->> O: • Payment Recorded

```

---

## **Flow Summary**

| Phase | Description | Key Patterns Used |
|-------|------------|------------------|
| **1. Offline Billing** | During internet failure, billing continues using locally cached products and stock data stored in IndexedDB. Invoice, payment, and stock deduction are marked as `PENDING` for later synchronization. | **Offline-First**, Optimistic UI, Local Transactions |
| **2. Background Reconciliation** | When connectivity returns, the Service Worker automatically gathers all pending financial and stock records and sends them in a single bulk API request. | **Background Sync**, Bulk Processing |
| **3. Transactional Cloud Commit** | The backend wraps invoice creation, payment recording, stock deduction, and audit logging inside a single database transaction to guarantee atomic consistency. | **ACID Transaction**, Unit of Work Pattern |
| **4. Real-Time Business Awareness** | After successful commit, the backend emits a WebSocket event so the owner dashboard instantly reflects updated revenue and stock metrics. | **WebSocket**, Pub-Sub |
| **5. Data Integrity & Auditability** | Every sale generates stock movement records and audit logs to ensure financial transparency and recovery capability. | **Audit Trail**, Event Logging |

---

## **System Guarantees**

- Billing never stops during internet outages.
- No invoice is partially saved — all cloud writes are atomic.
- Stock levels remain consistent through tracked stock movements.
- Every payment is recorded with proper audit logging.
- The owner always sees real-time revenue once synchronization completes.
- Sync failures can be retried safely without duplication.

---

## **Architectural Alignment**

This sequence flow aligns directly with:

- Layered backend architecture (Controller → Service → Repository)
- MySQL transactional guarantees
- Prisma ORM transaction handling
- IndexedDB offline persistence
- WebSocket-based live dashboard updates

StockShield ensures operational continuity at the counter and financial correctness in the cloud.
