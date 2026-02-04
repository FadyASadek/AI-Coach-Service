# 🚀 AI Coach Analyst
**نظام تحليل بيانات اللاعبين الذكي باستخدام الذكاء الاصطناعي (Gemini AI)**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-v24-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Flash-orange?style=for-the-badge&logo=google-gemini)

نظام متكامل (Full-Stack) يهدف إلى أتمتة عملية تحليل التقارير الورقية للاعبين. يقوم النظام بتحويل ملفات Word الصعبة إلى تقارير تفاعلية منظمة تحتوي على توصيات غذائية وصحية مدعومة بالذكاء الاصطناعي.



## 🌟 المميزات (Key Features)
- 📄 **Word Parsing:** تحويل ملفات `.docx` إلى نصوص خام باستخدام مكتبة `Mammoth`.
- 🧠 **AI Analysis:** تحليل معمق للنصوص العربية باستخدام **Google Gemini Pro 1.5**.
- 📊 **Smart Dashboard:** واجهة مستخدم مبنية بـ `Next.js` تعرض البيانات في كروت ملونة ومنظمة.
- 📑 **Export to PDF:** إمكانية تصدير التقرير النهائي كملف PDF عالي الجودة يدعم اللغة العربية.
- 🛠️ **Modular Design:** هيكلة كود نظيفة (Clean Code) تفصل بين الخدمات (Services) والمنطق (Logic).

## 🏗️ البناء التقني (Architecture)

### **Frontend**
- **Next.js 15 (App Router)** لتجربة مستخدم سريعة وسلسة.
- **Tailwind CSS / Custom CSS** مع خط **Cairo** للهوية العربية.
- **Lucide Icons & Font Awesome** للأيقونات التوضيحية.

### **Backend**
- **Node.js v24** مع نظام الـ **ES Modules**.
- **Express.js** لإدارة المسارات (Routes).
- **CORS & Middleware** لضمان اتصال آمن مع الواجهة الأمامية.



---

## 🚀 التشغيل السريع (Quick Start)

### 1. إعداد السيرفر (Backend)
```bash
cd backend
npm install
# قم بإضافة GEMINI_API_KEY في ملف .env
node src/app.js


### 2. (FrontEnd)
```bash
cd frontend
npm install
npm run dev
```

🛠️ كيف يعمل النظام؟ (Workflow)
يرفع المستخدم ملف اللاعب بصيغة Word.

يقوم السيرفر بمعالجة الملف واستخراج النص.

يتم إرسال النص إلى Gemini AI مع Prompt هندسي مخصص لإخراج JSON منظم.

يستقبل الـ Frontend الـ JSON ويقوم برسم الكروت التفاعلية.

