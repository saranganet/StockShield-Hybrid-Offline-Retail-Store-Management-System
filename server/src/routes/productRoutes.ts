import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);
const productController = new ProductController();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);

export default router;
