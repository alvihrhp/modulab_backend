import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthController {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key";
  private static readonly JWT_EXPIRES_IN = "1h";
  private static readonly SALT_ROUNDS = parseInt(
    process.env.SALT_ROUNDS || "10"
  );

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(AuthController.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password_hash: hashedPassword,
        },
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, AuthController.JWT_SECRET, {
        expiresIn: AuthController.JWT_EXPIRES_IN,
      });

      res.json({
        success: true,
        message: "Registration successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    } catch (error: unknown) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, AuthController.JWT_SECRET, {
        expiresIn: AuthController.JWT_EXPIRES_IN,
      });

      // Return success response
      res.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    } catch (error: unknown) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
