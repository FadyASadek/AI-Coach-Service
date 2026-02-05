// 1. Imports (موحدة كلها بنظام ES Modules)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

// 2. Load Environment Variables (لازم تكون في البداية)
dotenv.config();

// 3. Import Controllers & Models (تأكد من إضافة .js في الآخر)
import * as analysisController from "./controllers/analysisController.js";
import Analysis from "./models/Analysis.js";

const app = express();

// 4. Middlewares
app.use(cors());
app.use(express.json());

// 5. Database Connection (استخدام متغير واحد واضح)
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coaching_db";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log(
      "💡 Hint: Make sure MongoDB is installed and running on your machine!",
    );
  });

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => res.send("AI Coaching API is running... 🚀"));

// مسار التحليل الرئيسي
app.post("/api/analyze", upload.single("file"), analysisController.analyzeFile);

// مسار السجل
app.get("/api/history", async (req, res) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
