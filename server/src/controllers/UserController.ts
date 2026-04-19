import { Request, Response } from "express";
import { prisma } from "../config/db";

export class UserController {
  getAll = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateRole = async (req: Request, res: Response) => {
    try {
      const { role } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id as string },
        data: { role },
        select: { id: true, name: true, email: true, role: true }
      });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
