import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAnalyzePlant, useDownloadPDF } from "../hooks/queries";
import {
  UploadCloud, Search, ShieldAlert, Sparkles,
  FileText, Eye, Leaf, Zap, CheckCircle2, ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: <UploadCloud size={22} />,
    num: "01",
    title: "Upload Image",
    desc: "Drop a clear photo of the plant leaves or stems",
  },
  {
    icon: <Zap size={22} />,
    num: "02",
    title: "AI Analysis",
    desc: "Neural networks detect health status & pathogens instantly",
  },
  {
    icon: <FileText size={22} />,
    num: "03",
    title: "Download Report",
    desc: "Get a high-fidelity PDF diagnostic care guide",
  },
];

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeMutation = useAnalyzePlant();
  const downloadMutation = useDownloadPDF();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  const handleFileSelect = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const data = await analyzeMutation.mutateAsync(formData);
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  const handleDownloadReport = async () => {
    if (!analysisResult) return;
    try {
      const blob = await downloadMutation.mutateAsync({
        result: analysisResult.result,
        image: analysisResult.image,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Plant_Analysis_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF report.");
    }
  };

  const formatResultToHtml = (text) => {
    if (!text) return "";
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    let html = "";
    lines.forEach((line) => {
      if (
        line.toLowerCase().includes("care & treatment") ||
        line.toLowerCase().includes("care tips") ||
        line.toLowerCase().includes("recommendations")
      ) {
        html += `<h3 class="result-section-title mt-4">🌿 Care & Treatment Recommendations</h3>`;
        return;
      }
      let clean = line;
      let isBullet = false;
      if (line.startsWith("*") || line.startsWith("-")) {
        isBullet = true;
        clean = line.replace(/^[\*\-\s]+/, "");
      }
      const boldMatch = clean.match(/^\*\*([^*]+):\*\*(.*)$/);
      if (boldMatch) {
        const [, label, desc] = boldMatch;
        html += isBullet
          ? `<div class="result-bullet-item"><span class="bullet-dot">•</span><strong>${label.trim()}:</strong> ${desc.trim()}</div>`
          : `<p class="result-detail-paragraph"><strong>${label.trim()}:</strong> ${desc.trim()}</p>`;
      } else {
        const c = clean.replace(/\*\*/g, "");
        html += isBullet
          ? `<div class="result-bullet-item"><span class="bullet-dot">•</span> ${c}</div>`
          : `<p class="result-detail-paragraph">${c}</p>`;
      }
    });
    return html;
  };

  return (
    <div className="home-page animate-fade-in">


      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="container hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Powered by Google Gemini AI
          </div>
          <h1 className="hero-title">
            Diagnose Your Plant's<br />
            <span className="hero-title-accent">Health Instantly</span>
          </h1>
          <p className="hero-subtitle">
            Upload a photo and get species identification, disease detection, and
            expert care plans in seconds — backed by state-of-the-art AI.
          </p>
          <div className="hero-cta-row">
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary hero-cta-btn">
                Get Started Free <ArrowRight size={18} />
              </Link>
            )}
            <a href="#scan-section" className="btn btn-secondary hero-cta-btn">
              Try Scanner <Search size={16} />
            </a>
          </div>


          <div className="hero-steps-row">
            {STEPS.map((s) => (
              <div className="hero-step-card" key={s.num}>
                <div className="hero-step-icon">{s.icon}</div>
                <div>
                  <div className="hero-step-num">{s.num}</div>
                  <h4 className="hero-step-title">{s.title}</h4>
                  <p className="hero-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="scan-section" className="scanner-section">
        <div className="container">
          <div className="scanner-section-header">
            <Leaf size={18} className="section-leaf-icon" />
            <span>Plant Scanner</span>
          </div>
          <h2 className="section-title">Analyze Your Plant</h2>
          <p className="section-subtitle">
            Drag & drop or browse a photo — our AI generates a complete diagnostic in seconds.
          </p>

          <div className="scan-section-layout">

            <div className="scan-upload-column">
              <form onSubmit={handleSubmit} className="w-full">
                <div
                  className={`drop-area ${dragActive ? "drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    <div className="image-preview-wrapper" onClick={(e) => e.stopPropagation()}>
                      <img src={imagePreview} alt="Uploaded plant preview" />
                      <button
                        type="button"
                        className="btn-change-image"
                        onClick={() => fileInputRef.current.click()}
                      >
                        ✦ Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder flex-center flex-column py-5">
                      <div className="upload-icon-ring">
                        <UploadCloud className="upload-icon-pulse" size={44} />
                      </div>
                      <p className="upload-main-text">Drag & drop your plant image</p>
                      <p className="upload-sub-text">or click anywhere to browse files</p>
                      <div className="upload-limits-badge mt-4">PNG · JPG · WEBP up to 10 MB</div>
                    </div>
                  )}
                </div>

                {imagePreview && !analysisResult && (
                  <button
                    type="submit"
                    id="analyze-btn"
                    className="btn btn-primary btn-block mt-4 btn-analyze"
                    disabled={analyzeMutation.isPending}
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <span className="spinner-small" />
                        Analyzing Specimen...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        {isAuthenticated ? "Analyze Plant Specimen" : "Log In to Analyze"}
                      </>
                    )}
                  </button>
                )}

                {analysisResult && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-block mt-4"
                    onClick={() => {
                      setAnalysisResult(null);
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    Scan Another Plant
                  </button>
                )}
              </form>

              {analyzeMutation.isError && (
                <div className="error-card mt-4 flex items-start gap-2">
                  <ShieldAlert className="flex-shrink-0 text-danger mt-1" size={20} />
                  <div>
                    <h4>Diagnostic Failure</h4>
                    <p className="mt-2">{analyzeMutation.error?.response?.data?.error || analyzeMutation.error?.message}</p>
                  </div>
                </div>
              )}
            </div>


            <div className="scan-results-column">
              {analyzeMutation.isPending && (
                <div className="analyzing-overlay rounded-lg">
                  <div className="scanner-line" />
                  <div className="analyzing-inner">
                    <div className="analyzing-pulse-ring">
                      <Sparkles size={28} className="text-primary" />
                    </div>
                    <h3 className="analyzing-title">Analyzing Foliage Data</h3>
                    <p className="analyzing-desc">
                      Running computer vision and pathology assessments against botanical diagnostic models…
                    </p>
                    <div className="analyzing-progress">
                      <div className="analyzing-progress-bar" />
                    </div>
                  </div>
                </div>
              )}

              {!analyzeMutation.isPending && !analysisResult && (
                <div className="awaiting-card rounded-lg">
                  <div className="awaiting-icon-ring animate-pulse">
                    <Eye size={32} />
                  </div>
                  <h3>Awaiting Specimen</h3>
                  <p>Upload a plant photo and click Analyze to generate a detailed diagnostic report.</p>
                  {!isAuthenticated && (
                    <Link to="/login" className="btn btn-primary mt-4 flex-inline-center gap-2">
                      <ArrowRight size={16} /> Login to Get Started
                    </Link>
                  )}
                </div>
              )}

              {analysisResult && (
                <div className="result-card animate-fade-in">
                  <div className="result-header-bar">
                    <div className="result-header-left">
                      <div className="result-badge">
                        <CheckCircle2 size={14} />
                        Analysis Complete
                      </div>
                      <h3>Diagnostic Assessment</h3>
                    </div>
                    <button
                      className="btn btn-success btn-download-pdf"
                      onClick={handleDownloadReport}
                      disabled={downloadMutation.isPending}
                    >
                      <FileText size={16} />
                      {downloadMutation.isPending ? "Generating…" : "Download PDF"}
                    </button>
                  </div>
                  <div className="result-body">
                    <div
                      className="analysis-formatted-result"
                      dangerouslySetInnerHTML={{ __html: formatResultToHtml(analysisResult.result) }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
