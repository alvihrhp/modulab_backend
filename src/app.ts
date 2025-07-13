import express, { Application, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from './generated/prisma';
import routes from './routes';

const app: Application = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
