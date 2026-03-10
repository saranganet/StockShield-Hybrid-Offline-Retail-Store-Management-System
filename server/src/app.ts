import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import salesRoutes from "./routes/salesRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes";
import auditRoutes from "./routes/auditRoutes";
import userRoutes from "./routes/userRoutes";
import { seedDatabase } from "./scripts/seed";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/users", userRoutes);

// Dev utilities
app.post('/api/dev/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Mock Indian Database Seeded!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Seed failed' });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("StockShield API is running");
});

export default app;
