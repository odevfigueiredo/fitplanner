import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "@fitplanner/shared";
import { env } from "../config/env.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/app-error.js";

export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  async register(input: RegisterInput) {
    const existingUser = await this.users.findByEmail(input.email);
    if (existingUser) {
      throw new AppError("Email is already registered.", 409, "EMAIL_ALREADY_REGISTERED");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return {
      user: this.serializeUser(user),
      token: this.signToken(user.id, user.email),
    };
  }

  async login(input: LoginInput) {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    return {
      user: this.serializeUser(user),
      token: this.signToken(user.id, user.email),
    };
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    return this.serializeUser(user);
  }

  private signToken(userId: string, email: string) {
    const options: jwt.SignOptions = {
      subject: userId,
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };

    return jwt.sign({ email }, env.JWT_SECRET, options);
  }

  private serializeUser(user: { id: string; name: string; email: string; createdAt: Date }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
