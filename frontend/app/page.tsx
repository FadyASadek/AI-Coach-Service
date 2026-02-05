'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState, ChangeEvent } from 'react';
import Swal from 'sweetalert2';

// --- Types Definitions ---
interface AnalysisData {
  personal_summary: string;
  medical_history: string[];
  nutritional_habits: string[];
  psychological_plan: string[];
  environmental_factors: string[];
  recommended_activities: string[];
}

interface ResultCardProps {
  title: string;
  icon: string;
  color: string;
  data: string | string[];
  isList?: boolean;
  fullWidth?: boolean;
}

export default function AIAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('جاري التحليل...'); // نص التحميل المتغير
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // --- دالة تحميل التقرير PDF ---
  const downloadPDF = async () => {
    const element = document.getElementById('results-to-print');
    if (!element || !analysisData) return;

    // نستخدم نص تحميل خاص للتصدير
    setLoading(true);
    setLoadingText('جاري إنشاء ملف PDF...');

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // الصفحة الأولى
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // باقي الصفحات
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const playerName =
        analysisData.personal_summary
          ?.split(' ')
          .slice(0, 2)
          .join('_') || 'Player';

      pdf.save(`تقرير_تحليل_${playerName}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'تم تحميل التقرير كاملًا',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'فشل تصدير PDF',
      });
    } finally {
      setLoading(false);
    }
  };

  // --- معالجة اختيار الملف ---
  const handleFileChange = (file: File | undefined) => {
    if (file && file.name.endsWith(".docx")) {
      setSelectedFile(file);
    } else if (file) {
      Swal.fire({ icon: "error", title: "ملف غير مدعوم", text: "يرجى رفع ملف بصيغة Word (.docx) فقط" });
    }
  };

  // --- بدء التحليل ---
  const startAnalysis = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setAnalysisData(null);
    
    // سيناريو وهمي لرسائل التحميل (لتحسين تجربة المستخدم)
    setLoadingText('جاري قراءة الملف واستخراج النصوص...');
    setTimeout(() => setLoadingText('الذكاء الاصطناعي يقوم بتحليل البيانات الطبية...'), 2500);
    setTimeout(() => setLoadingText('جاري كتابة التوصيات الغذائية والرياضية...'), 5000);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "حدث خطأ في الخادم");
      
      setAnalysisData(result.data);
      Swal.fire({ icon: "success", title: "تم التحليل بنجاح!", timer: 1500, showConfirmButton: false });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      Swal.fire({ icon: "error", title: "فشل التحليل", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" dir="rtl">
      {/* Header */}
      <header className="header">
        <div className="logo"><i className="fas fa-brain"></i> AI Coach Analyst</div>
        <p>منصة ذكية لتحليل بيانات اللاعبين وبناء خطط تطوير شاملة</p>
      </header>

      {/* --- UX: Steps Indicator (شريط الخطوات) --- */}
      <div className="steps-container">
        <div className="step-item">
          <div className="step-number">1</div>
          <div className="step-text">
            <strong>حمل النموذج</strong>
            <p>حمل ملف Word الفارغ</p>
          </div>
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <div className="step-number">2</div>
          <div className="step-text">
            <strong>املأ البيانات</strong>
            <p>أدخل بيانات اللاعب</p>
          </div>
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <div className="step-number">3</div>
          <div className="step-text">
            <strong>ارفع وحلل</strong>
            <p>ارفع الملف للتحليل</p>
          </div>
        </div>
      </div>

      {/* Upload Card */}
      <div className="upload-card">
        {/* زر تحميل النموذج */}
        <div className="template-action">
           <div className="hint-box">
             <i className="fas fa-info-circle"></i>
             <p className="hint-text">ابدأ بتحميل النموذج المعتمد من هنا</p>
           </div>
           <a 
             href="/template.docx" 
             download="نموذج_بيانات_اللاعب.docx" 
             className="btn-template"
           >
             <i className="fas fa-file-download"></i> تحميل نموذج فارغ
           </a>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${selectedFile ? 'has-file' : ''}`}
          onClick={() => document.getElementById('fileInput')?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
          onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0]); }}
        >
          {!selectedFile ? (
            <>
              <i className="fas fa-cloud-upload-alt upload-icon"></i>
              <h3>اسحب الملف هنا أو اضغط للرفع</h3>
              <p>صيغ الملفات المدعومة: .docx (Word)</p>
            </>
          ) : (
            <div className="file-info">
              <i className="fas fa-file-word"></i>
              <span>{selectedFile.name}</span>
              <i 
                className="fas fa-times remove-file" 
                title="إلغاء الملف"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
              ></i>
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            hidden
            accept=".docx"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files?.[0])}
          />
        </div>

        {/* Action Button */}
        <button className="btn-primary" disabled={!selectedFile || loading} onClick={startAnalysis}>
          <i className="fas fa-microchip"></i> {loading ? 'جاري المعالجة...' : 'بدء التحليل الذكي'}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">{loadingText}</p>
        </div>
      )}

      {/* Results Section */}
      {analysisData && (
        <div className="results-container">
          <div className="results-header">
            <h2><i className="fas fa-clipboard-check"></i> تقرير التحليل</h2>
            <button onClick={downloadPDF} className="btn-pdf">
              <i className="fas fa-file-pdf"></i> تحميل PDF
            </button>
          </div>

          <div id="results-to-print" className="print-area">
            <div className="grid-container">
              <ResultCard title="ملخص الحالة" icon="user" color="blue" data={analysisData.personal_summary} isList={false} />
              <ResultCard title="التاريخ المرضي" icon="heartbeat" color="red" data={analysisData.medical_history} />
              <ResultCard title="العادات الغذائية" icon="utensils" color="green" data={analysisData.nutritional_habits} />
              <ResultCard title="الجانب النفسي" icon="brain" color="purple" data={analysisData.psychological_plan} />
              <ResultCard title="البيئة المحيطة" icon="home" color="orange" data={analysisData.environmental_factors} />
              <ResultCard title="توصيات المدرب" icon="star" color="gold" data={analysisData.recommended_activities} fullWidth />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-component: Result Card ---
function ResultCard({ title, icon, color, data, isList = true, fullWidth = false }: ResultCardProps) {
  return (
    <div className={`card result-card ${fullWidth ? 'full-width' : ''}`}>
      <div className={`card-header ${color}`}>
        <div className="header-content">
           <i className={`fas fa-${icon}`}></i> 
           <span>{title}</span>
        </div>
      </div>
      <div className="card-body">
        {isList && Array.isArray(data) ? (
          <ul>
            {data.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : (
          <p>{data}</p>
        )}
      </div>
    </div>
  );
}