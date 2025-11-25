import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index";
import errorHandler from "./src/middleware/errorHandler";
import prisma from "./src/models/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// app.use(cors());

//for local testing
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(3000, "0.0.0.0", () => console.log("API on :3000"));

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
