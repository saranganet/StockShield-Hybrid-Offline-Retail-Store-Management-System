import { Router } from "express";
import { SupplierController } from "../controllers/SupplierController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const supplierController = new SupplierController();

router.use(authMiddleware);

router.get("/", supplierController.getAll);
router.get("/:id", supplierController.getById);
router.post("/", supplierController.create);
router.put("/:id", supplierController.update);
router.delete("/:id", supplierController.delete);

export default router;
