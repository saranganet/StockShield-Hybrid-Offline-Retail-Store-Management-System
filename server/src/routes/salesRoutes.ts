import { Router } from "express";
import { SalesController } from "../controllers/SalesController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);
const salesController = new SalesController();

router.get("/stats", salesController.getStats);
router.get("/", salesController.getAll);
router.get("/:id", salesController.getById);
router.post("/", salesController.create);

export default router;
