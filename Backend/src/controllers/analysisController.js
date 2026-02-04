// 1. تحويل الـ require لـ import
import Analysis from '../models/Analysis.js';
import * as aiService from '../Services/aiService.js'; // تأكد من إضافة .js
import * as fileParser from '../utils/fileParser.js';

// 2. استخدام export const بدلاً من exports
export const analyzeFile = async (req, res) => {
    try {
        // التحقق من وجود الملف
        if (!req.file) {
            return res.status(400).json({ success: false, error: "من فضلك قم برفع ملف." });
        }

        // 1. استخراج النص من ملف الوورد
        const text = await fileParser.extractTextFromWord(req.file.buffer);

        console.log("تم استخراج النص، جاري الإرسال للذكاء الاصطناعي...");

        // 2. تحليل البيانات باستخدام Gemini
        const aiAnalysisResult = await aiService.analyzeStudentData(text);

        // 3. حفظ البيانات (النص الأصلي + التحليل المنظم) في قاعدة البيانات
        const newAnalysis = new Analysis({
            fileName: req.file.originalname,
            rawExtractedText: text,      // النص الخام (للمرجعية)
            aiAnalysis: aiAnalysisResult, // الـ JSON المنظم (للعرض)
            status: 'completed'
        });

        const savedData = await newAnalysis.save();

        // 4. الرد على العميل بالبيانات المحللة
        res.status(200).json({
            success: true,
            message: "تم تحليل الملف بنجاح",
            id: savedData._id,
            data: savedData.aiAnalysis // نرجع الـ JSON ليظهر في الفرونت إند
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};