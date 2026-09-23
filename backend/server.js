// server.js — minimal standalone entrypoint, CRM only.
// No Mongo, no site auth, no site secrets needed here.
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import crmRoutes from "./routes/crmRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/crm", crmRoutes);

// Catch-all error handler — never leak stack traces/internals to the client.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log("Postgres (Prisma) connected ✅");
  } catch (error) {
    console.error("Postgres (Prisma) error ❌", error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectPrisma();
  app.listen(process.env.PORT, () => {
    console.log(`CRM server running on port ${process.env.PORT}`);
  });
};

startServer();

process.on("SIGTERM", async () => { await prisma.$disconnect(); process.exit(0); });
process.on("SIGINT", async () => { await prisma.$disconnect(); process.exit(0); });
