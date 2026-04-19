import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { RegisterDTO, LoginDTO } from "../dtos/AuthDTO";

export class AuthService {
  private userRepository: UserRepository;
  private readonly JWT_SECRET = process.env["JWT_SECRET"] || "supersecret";

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    
    return await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || "STAFF",
    });
  }

  async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      this.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { user, token };
  }
}
