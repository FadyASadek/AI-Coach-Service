import { GoogleGenerativeAI } from "@google/generative-ai";

// ضع المفتاح الجديد هنا بين علامتي التنصيص
const apiKey = "AIzaSyB_ZLFYvGBbkwqb-dZCscalydI8pmuHTa8"; 

async function testDirect() {
  console.log("... تجربة المفتاح الجديد ...");
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ملاحظة: تأكد من استخدام اسم موديل متاح مثل gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Test connection");
    console.log("✅ نجاح! المفتاح يعمل.");
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ الخطأ:", error.message);
    if (error.message.includes("403")) {
        console.log("💡 نصيحة: تأكد من تفعيل الـ API في منطقتك أو صحة المفتاح.");
    }
  }
}

testDirect();