'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState, ChangeEvent } from 'react';
import Swal from 'sweetalert2';

// Types Definitions
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
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // 1. دالة تحميل التقرير (يجب أن تكون داخل الـ Component)
  const downloadPDF = async () => {
    const element = document.getElementById('results-to-print');
    if (!element || !analysisData) return;

    setLoading(true);

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

      // أول صفحة
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

  const handleFileChange = (file: File | undefined) => {
    if (file && file.name.endsWith(".docx")) {
      setSelectedFile(file);
    } else if (file) {
      Swal.fire({ icon: "error", title: "ملف غير مدعوم", text: "يرجى رفع ملف بصيغة Word (.docx) فقط" });
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setAnalysisData(null);
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
      Swal.fire({ icon: "success", title: "تم التحليل بنجاح!", timer: 2000 });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      Swal.fire({ icon: "error", title: "فشل التحليل", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" dir="rtl">
      <header className="header">
        <div className="logo"><i className="fas fa-brain"></i> AI Coach Analyst</div>
        <p>ارفع ملف بيانات اللاعب ودع الذكاء الاصطناعي يحلله لك</p>
      </header>

      <div className="upload-card">
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
              <i className="fas fa-times remove-file" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}></i>
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

        <button className="btn-primary" disabled={!selectedFile || loading} onClick={startAnalysis}>
          <i className="fas fa-microchip"></i> {loading ? 'جاري التحليل...' : 'بدء التحليل الذكي'}
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري قراءة الملف وتحليله بواسطة Coach AI...</p>
          <small>قد يستغرق الأمر بضع ثوانٍ</small>
        </div>
      )}

      {analysisData && (
        <div className="results-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2><i className="fas fa-clipboard-check"></i> تقرير التحليل</h2>
            <button onClick={downloadPDF} className="btn-secondary" style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}>
              <i className="fas fa-file-pdf"></i> تحميل التقرير PDF
            </button>
          </div>

          <div id="results-to-print" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
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

// Sub-component (يُفضل تعريفه خارج الـ Main Component)
function ResultCard({ title, icon, color, data, isList = true, fullWidth = false }: ResultCardProps) {
  return (
    <div className={`card result-card ${fullWidth ? 'full-width' : ''}`}>
      <div className={`card-header ${color}`}>
        <i className={`fas fa-${icon}`}></i> {title}
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