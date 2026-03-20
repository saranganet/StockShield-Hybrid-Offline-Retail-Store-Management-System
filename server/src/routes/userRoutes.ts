import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();
const userController = new UserController();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", userController.getAll);
router.put("/:id/role", userController.updateRole);

export default router;
