import { Router } from "express";
import { PurchaseOrderController } from "../controllers/PurchaseOrderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const poController = new PurchaseOrderController();

router.use(authMiddleware);

router.get("/", poController.getAll);
router.get("/:id", poController.getById);
router.post("/", poController.create);
router.post("/:id/receive", poController.receive);

export default router;
