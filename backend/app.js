import express from "express";
import path from "path";
import "dotenv/config";
import cors from "cors";
import { conn } from "./config/conn.js";
import plantRoutes from "./routes/plantRoutes.js";

// Initialize database connection
conn();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://plantiq-xi.vercel.app"],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

// API Routes
app.use("/api", plantRoutes);

app.get("/", (req, res) => {
  res.send("PlantIQ project running Successfully!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
