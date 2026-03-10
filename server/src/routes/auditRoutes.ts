import { Router } from "express";
import { AuditController } from "../controllers/AuditController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const auditController = new AuditController();

router.use(authMiddleware);
router.get("/", auditController.getAll);

export default router;
