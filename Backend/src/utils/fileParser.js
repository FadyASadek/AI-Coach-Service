import mammoth from 'mammoth';

/**
 * وظيفة لتحويل ملف Word إلى نص
 */
export const extractTextFromWord = async (buffer) => {
    try {
        // خيارات إضافية لـ mammoth لو حبيت تحافظ على بعض التنسيقات
        const options = {
            preserveEmptyParagraphs: false, // تجاهل الأسطر الفاضية الكتير
        };

        const result = await mammoth.extractRawText({ buffer: buffer }, options);

        // تنظيف النص المستخرج من المسافات الزائدة في البداية والنهاية
        const cleanText = result.value.trim();

        if (!cleanText) {
            throw new Error("لم يتم العثور على نص داخل الملف.");
        }

        return cleanText;
    } catch (error) {
        // في الدوت نت بنعمل Catch لـ Exception، هنا بنعمل Throw لـ Error مفهوم
        throw new Error(`خطأ في معالجة ملف الوورد: ${error.message}`);
    }
};