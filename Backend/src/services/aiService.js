import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// تفعيل dotenv لقراءة الملف من الفولدر الرئيسي
dotenv.config();

// التحقق من وجود مفتاح الـ API
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// تصدير الدالة بنظام ES Modules
export const analyzeStudentData = async (rawText) => {
  try {
    // نستخدم موديل gemini-2.5-flash لسرعة الاستجابة
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // ملاحظة: تأكد من اسم الموديل المتاح حالياً هو 1.5 أو 2.0

    const prompt = `
            You are an expert sports nutritionist and data analyst.
            Analyze the following text extracted from a player's data sheet (in Arabic).
            Extract key information and format it into a STRICT JSON object.

            Text to analyze:
            "${rawText}"

            Output Schema (JSON keys must be exactly as below):
            {
                "personal_summary": "String",
                "medical_history": ["String"],
                "nutritional_habits": ["String"],
                "environmental_factors": ["String"],
                "psychological_plan": ["String"],
                "recommended_activities": ["String"]
            }

            IMPORTANT INSTRUCTIONS:
            1. Return ONLY valid JSON.
            2. Do not include markdown formatting.
            3. Translate the extracted values to Arabic.
            4. If a field is missing, make a reasonable inference or leave it empty.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    // تنظيف الرد من أي Markdown
    textResponse = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // تحويل النص إلى كائن JSON
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("حدث خطأ أثناء تحليل البيانات بواسطة الذكاء الاصطناعي: " + error.message);
  }
};