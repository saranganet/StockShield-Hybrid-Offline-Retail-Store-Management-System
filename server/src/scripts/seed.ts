import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('Clearing old mock data...');
  await prisma.auditLog.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.salesInvoice.deleteMany({});
  await (prisma as any).purchaseOrderItem.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({
    where: { NOT: { email: 'admin@admin.com' } } // keep current admin
  });

  console.log('Creating demo Categories...');
  const catElectronics = await prisma.category.create({ data: { name: 'Electronics & Mobiles' } });
  const catGroceries = await prisma.category.create({ data: { name: 'Daily Groceries' } });
  const catApparel = await prisma.category.create({ data: { name: 'Men\'s Apparel' } });
  
  // Extra categories for professor to delete
  const catDelete1 = await prisma.category.create({ data: { name: 'Expired Items (Safe to Delete)' } });
  const catDelete2 = await prisma.category.create({ data: { name: 'Old Promotions (Safe to Delete)' } });

  console.log('Creating internal demo Users...');
  const hashedPw = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: { name: 'Rahul Sharma', email: 'rahul@stockshield.in', passwordHash: hashedPw, role: 'STAFF' }
  });
  const user2 = await prisma.user.create({
    data: { name: 'Priya Patel', email: 'priya@stockshield.in', passwordHash: hashedPw, role: 'STAFF' }
  });

  console.log('Creating demo Indian Suppliers...');
  const supTata = await prisma.supplier.create({
    data: { name: 'Tata Distributors', contactInfo: '+91 9876543210 - orders@tata.co.in' }
  });
  const supReliance = await prisma.supplier.create({
    data: { name: 'Reliance Retail Wholesale', contactInfo: '+91 9876543211 - b2b@reliance.in' }
  });
  const supDelete = await prisma.supplier.create({
    data: { name: 'Test Vendor Ltd (Safe to Delete)', contactInfo: '+91 9999999999 - delete_me@vendor.in' }
  });

  console.log('Creating demo Products (INR Pricing)...');
  const prod1 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy M53',
      price: 24500.00,
      stockQuantity: 45,
      categoryId: catElectronics.id,
    }
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Aashirvaad Shudh Chakki Atta (5kg)',
      price: 260.00,
      stockQuantity: 120,
      categoryId: catGroceries.id,
    }
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Peter England Blue Formal Shirt',
      price: 1249.00,
      stockQuantity: 8,
      categoryId: catApparel.id,
    }
  });

  const prod4 = await prisma.product.create({
    data: {
      name: 'Tata Tea Premium (1kg)',
      price: 490.00,
      stockQuantity: 65,
      categoryId: catGroceries.id,
    }
  });

  // Extra products for deleting
  const prodDelete1 = await prisma.product.create({
    data: {
      name: 'Broken LED Bulbs (Delete Me)',
      price: 15.00,
      stockQuantity: 0,
      categoryId: catDelete1.id,
    }
  });

  const prodDelete2 = await prisma.product.create({
    data: {
      name: 'Old Stock T-Shirts (Delete Me)',
      price: 150.00,
      stockQuantity: 2,
      categoryId: catDelete2.id,
    }
  });

  console.log('Generating dummy Sales History...');
  // Create a sale by Rahul
  const sale1 = await prisma.salesInvoice.create({
    data: {
      userId: user1.id,
      totalAmount: 25749.00,
      invoiceItems: {
        create: [
          { productId: prod1.id, quantity: 1, unitPrice: 24500.00 },
          { productId: prod3.id, quantity: 1, unitPrice: 1249.00 },
        ]
      },
      payments: {
        create: [
          { amount: 25749.00, method: 'UPI' }
        ]
      }
    }
  });
  
  await prisma.auditLog.create({
    data: { userId: user1.id, action: 'SALE_CREATED', metadata: { entityType: 'INVOICE', entityId: sale1.id, details: 'Demo historical sale via UPI' } }
  });

  console.log('Generating demo Purchase Orders...');
  const po1 = await prisma.purchaseOrder.create({
    data: {
      supplierId: supTata.id,
      status: 'CREATED',
      totalAmount: 6500.00,
      purchaseOrderItems: {
        create: [
           { product: { connect: { id: prod3.id } }, quantity: 10, unitCost: 650.00 }
        ]
      }
    }
  });

  console.log('Database Seeding Completed Successfully! 🚀');
}
