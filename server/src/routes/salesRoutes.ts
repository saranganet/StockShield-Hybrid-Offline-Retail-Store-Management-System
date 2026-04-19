import { Router } from "express";
import { SalesController } from "../controllers/SalesController";

const router = Router();
const salesController = new SalesController();

router.get("/", salesController.getAll);
router.get("/:id", salesController.getById);
router.post("/", salesController.create);

export default router;
