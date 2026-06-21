import React, { useState } from "react";
import { useScanHistory, useDeleteScan, useDownloadPDF } from "../hooks/queries";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Eye, FileText, Trash2, Calendar, Search,
  X, Download, Leaf, Clock, Filter,
} from "lucide-react";

const History = () => {
  const { data: scans, isLoading, error } = useScanHistory();
  const deleteMutation  = useDeleteScan();
  const downloadMutation = useDownloadPDF();

  const [selectedScan, setSelectedScan] = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");

  const handleDownload = async (scan) => {
    try {
      const blob = await downloadMutation.mutateAsync({ result: scan.result, image: scan.image });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${scan.plantName.replace(/\s+/g, "_")}_Analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF report.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scan from history?")) return;
    setDeletingId(id);
    setTimeout(async () => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch {
        alert("Failed to delete record.");
        setDeletingId(null);
      }
    }, 300);
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
        html += `<h4 class="modal-section-title mt-4">🌿 Care & Treatment</h4>`;
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
          ? `<div class="modal-bullet-item"><span class="bullet-dot">•</span><strong>${label.trim()}:</strong> ${desc.trim()}</div>`
          : `<p class="modal-detail-paragraph"><strong>${label.trim()}:</strong> ${desc.trim()}</p>`;
      } else {
        const c = clean.replace(/\*\*/g, "");
        html += isBullet
          ? `<div class="modal-bullet-item"><span class="bullet-dot">•</span> ${c}</div>`
          : `<p class="modal-detail-paragraph">${c}</p>`;
      }
    });
    return html;
  };

  const filteredScans = scans?.filter((s) =>
    s.plantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return (
    <div className="container py-5">
      <LoadingSpinner message="Loading your scan history..." />
    </div>
  );

  if (error) return (
    <div className="container py-5">
      <div className="error-card animate-shake">
        <h3>Failed to load history</h3>
        <p className="mt-2">{error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">

      <div className="history-page-header">
        <div className="container">
          <div className="history-header-inner">
            <div>
              <div className="page-badge">
                <Leaf size={13} />
                <span>Scan Records</span>
              </div>
              <h1 className="page-title">Scan History</h1>
              <p className="page-subtitle">
                {scans?.length ? `${scans.length} diagnostic record${scans.length !== 1 ? "s" : ""}` : "No scans yet"}
              </p>
            </div>

            {scans && scans.length > 0 && (
              <div className="history-header-controls">
                <div className="search-bar">
                  <Search className="search-icon" size={16} />
                  <input
                    id="history-search"
                    type="text"
                    placeholder="Search by plant name…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button className="search-clear" onClick={() => setSearchTerm("")}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-5">
        {!scans || scans.length === 0 ? (
          <div className="empty-history-card">
            <div className="empty-icon-wrapper animate-bounce-slow">
              <Leaf size={38} />
            </div>
            <h3>No Scans Yet</h3>
            <p>You haven't analyzed any plants yet. Try your first scan!</p>
            <a href="/" className="btn btn-primary mt-4 flex-inline-center gap-2">
              Start Scanning <Leaf size={16} />
            </a>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="empty-history-card">
            <div className="empty-icon-wrapper">
              <Search size={34} />
            </div>
            <h3>No Matches Found</h3>
            <p>No scans matching <strong>"{searchTerm}"</strong></p>
            <button className="btn btn-secondary mt-4" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {filteredScans.map((scan) => {
              const isDeleting = deletingId === scan._id;
              const date = new Date(scan.createdAt).toLocaleDateString(undefined, {
                year: "numeric", month: "short", day: "numeric",
              });
              const time = new Date(scan.createdAt).toLocaleTimeString(undefined, {
                hour: "2-digit", minute: "2-digit",
              });

              return (
                <div
                  key={scan._id}
                  className={`history-card-item ${isDeleting ? "fade-out" : ""}`}
                >
                  <div className="history-card-image-wrapper">
                    <img src={scan.image} alt={scan.plantName} loading="lazy" />
                    <div className="history-card-image-overlay">
                      <button
                        className="history-overlay-btn"
                        onClick={() => setSelectedScan(scan)}
                        title="Quick view"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="history-card-body">
                    <h3 className="history-card-title">{scan.plantName}</h3>
                    <div className="history-card-meta">
                      <Calendar size={13} />
                      <span>{date}</span>
                      <span className="meta-sep">·</span>
                      <Clock size={13} />
                      <span>{time}</span>
                    </div>

                    <div className="history-card-actions">
                      <button
                        id={`view-btn-${scan._id}`}
                        className="btn btn-card btn-view"
                        onClick={() => setSelectedScan(scan)}
                      >
                        <Eye size={15} /> Details
                      </button>
                      <button
                        id={`pdf-btn-${scan._id}`}
                        className="btn btn-card btn-pdf"
                        onClick={() => handleDownload(scan)}
                        disabled={downloadMutation.isPending}
                      >
                        <FileText size={15} /> PDF
                      </button>
                      <button
                        id={`del-btn-${scan._id}`}
                        className="btn btn-card btn-delete"
                        onClick={() => handleDelete(scan._id)}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {selectedScan && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSelectedScan(null)}>
          <div className="modal-content animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="modal-header-sub">Scan Details</p>
                <h3>{selectedScan.plantName}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedScan(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body-scrollable">
              <div className="modal-image-preview mb-4">
                <img src={selectedScan.image} alt={selectedScan.plantName} />
              </div>
              <div
                className="analysis-formatted-result"
                dangerouslySetInnerHTML={{ __html: formatResultToHtml(selectedScan.result) }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedScan(null)}>
                Close
              </button>
              <button
                className="btn btn-primary flex-inline-center gap-2"
                onClick={() => handleDownload(selectedScan)}
                disabled={downloadMutation.isPending}
              >
                <Download size={16} />
                {downloadMutation.isPending ? "Generating…" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
