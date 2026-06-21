import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { GoogleGenerativeAI } from '@google/generative-ai';
import "dotenv/config";
import HistoryModel from '../models/History.js';

const fsPromises = fs.promises;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const analyzePlant = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }
        const imagePath = req.file.path;
        const imageData = await fsPromises.readFile(imagePath, {
            encoding: "base64"
        });

        // Call Gemini to analyze the image
        const prompt = `You are an expert botanical diagnostic assistant and plant pathologist.
Analyze the provided plant image with high scientific accuracy.
Return a structured JSON object containing the plant analysis details.

Your analysis must follow this exact JSON structure:
{
  "commonName": "The most common vernacular name of the plant (e.g. Fiddle Leaf Fig, Tomato)",
  "scientificName": "The formal Latin taxonomic name, including genus and species (e.g. Ficus lyrata, Solanum lycopersicum)",
  "healthStatus": "A clear overall health rating. Choose exactly one from: Healthy, Mild Issues, Diseased, Dying, or Unknown Specimen",
  "conditionDescription": "Provide a highly detailed, thorough, and professional diagnostic description of the foliage, stem structure, leaf venation, color variations, spots, turgor pressure, and texture observed in the image (3-5 comprehensive sentences).",
  "detectedDiseases": "Provide a detailed clinical description of any detected pathogens, insect pest infestations, nutrient deficiencies, or physiological disorders. If none are detected, detail why the foliage appears to be pathologically clean and structurally sound (2-3 detailed sentences).",
  "careTips": {
    "watering": "Provide highly detailed, specific watering advice, detailing target frequency, soil moisture checkpoints (such as top inch dryness), seasonal adaptations, and watering methods (2-3 detailed sentences).",
    "sunlight": "Detail precise light exposure requirements, including hours of direct/indirect sunlight, filtration suggestions, and positioning adaptations for indoor vs outdoor settings (2-3 detailed sentences).",
    "fertilizer": "Soil type recommendations, macro/micronutrient needs, soil pH preferences, and specific fertilizing schedules based on active growth seasons (2-3 detailed sentences).",
    "maintenance": "Detailed grooming, pruning, pot scaling/repotting suggestions, leaf dusting, or immediate recovery actions to restore/promote plant health (2-3 detailed sentences)."
  }
}

Do not include any Markdown wrap tags like \`\`\`json. Return only the raw JSON text.`;

        const candidateModels = ["gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
        let result = null;
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                console.log(`Attempting plant analysis with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                });

                result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            mimeType: req.file.mimetype,
                            data: imageData
                        },
                    },
                ]);
                
                if (result && result.response) {
                    console.log(`Successfully generated plant analysis using model: ${modelName}`);
                    break;
                }
            } catch (err) {
                console.error(`Model ${modelName} analysis attempt failed:`, err.message || err);
                lastError = err;
            }
        }

        if (!result) {
            throw new Error(`All candidate AI models failed to respond. Last error: ${lastError?.message || lastError}`);
        }

        let plantInfo = "";
        let plantName = "Unknown Plant";

        try {
            const responseText = result.response.text();
            const plantData = JSON.parse(responseText);
            
            plantName = plantData.commonName || "Unknown Plant";
            plantInfo = `**Plant Name:** ${plantData.commonName || "Unknown"} (${plantData.scientificName || "N/A"})
**Health Status:** ${plantData.healthStatus || "Unknown"}
**Condition Description:** ${plantData.conditionDescription || "N/A"}
**Detected Diseases:** ${plantData.detectedDiseases || "None detected"}

**Care & Treatment Recommendations:**
* **Watering:** ${plantData.careTips?.watering || "N/A"}
* **Sunlight:** ${plantData.careTips?.sunlight || "N/A"}
* **Fertilizer:** ${plantData.careTips?.fertilizer || "N/A"}
* **Maintenance & Actions:** ${plantData.careTips?.maintenance || "N/A"}`;
        } catch (jsonErr) {
            console.error("JSON parsing fallback:", jsonErr);
            plantInfo = result.response.text();
            
            const nameMatch = plantInfo.match(/(?:Plant Name|Name|Species):\s*([^\n\*#]+)/i);
            if (nameMatch && nameMatch[1]) {
                plantName = nameMatch[1].trim();
            } else {
                const firstLine = plantInfo.split('\n')[0].replace(/[\*#_]/g, '').trim();
                if (firstLine) {
                    plantName = firstLine.substring(0, 50);
                }
            }
        }

        // Clean up uploaded file
        await fsPromises.unlink(imagePath);

        // Save to database history
        const historyRecord = new HistoryModel({
            userId: req.user.id,
            plantName,
            result: plantInfo,
            image: `data:${req.file.mimetype};base64,${imageData}`,
        });
        await historyRecord.save();

        return res.json({
            result: plantInfo,
            image: `data:${req.file.mimetype};base64,${imageData}`,
        });

    } catch (error) {
        console.error("Analyze Error:", error);
        return res.status(500).json({ error: "Error analyzing image" });
    }
};

export const downloadPDF = async (req, res) => {
    try {
        const { image, result } = req.body;

        const reportsDir = path.join(process.cwd(), "reports");
        await fsPromises.mkdir(reportsDir, { recursive: true });

        // Generate analysis PDF report
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const filename = `Plant_IQ_Analysis_Report_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.pdf`;
        const filePath = path.join(reportsDir, filename);

        const writeStream = fs.createWriteStream(filePath);
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(writeStream);

        // Page 1: Header
        doc.rect(0, 0, doc.page.width, 90).fill("#1b5e20");
        doc.rect(0, 87, doc.page.width, 3).fill("#2e7d32");

        doc.fillColor("white")
            .font("Helvetica-Bold")
            .fontSize(22)
            .text("PLANT IQ ANALYSIS REPORT", 0, 34, { align: "center", characterSpacing: 1 });

        doc.fillColor("#7f8c8d")
            .font("Helvetica")
            .fontSize(9)
            .text(`GENERATED ON: ${new Date().toLocaleDateString().toUpperCase()}`, 50, 105);

        // Parse result lines
        const lines = result.split('\n');
        let summaryLines = [];
        let careLines = [];
        let isCareSection = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            if (trimmed.toLowerCase().includes("care & treatment") || trimmed.toLowerCase().includes("care tips") || trimmed.toLowerCase().includes("recommendations")) {
                isCareSection = true;
                return;
            }

            if (isCareSection) {
                careLines.push(trimmed);
            } else {
                summaryLines.push(trimmed);
            }
        });

        // Add plant image if available
        let currentY = 125;
        if (image) {
            try {
                let buffer = Buffer.from(image.split(",")[1], "base64");
                // Convert to PNG for PDFKit
                buffer = await sharp(buffer).png().toBuffer();

                const imgWidth = 412;
                const imgHeight = 230;
                const imgX = (doc.page.width - imgWidth) / 2;
                const imgY = 125;

                doc.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4)
                   .lineWidth(1)
                   .stroke("#c8e6c9");

                doc.image(buffer, imgX, imgY, {
                    fit: [imgWidth, imgHeight],
                    align: "center",
                    valign: "center"
                });
                doc.fillColor("#7f8c8d")
                   .font("Helvetica-Oblique")
                   .fontSize(8)
                   .text("Figure 1: Analyzed Plant Specimen", 0, imgY + imgHeight + 6, { align: "center" });

                currentY = imgY + imgHeight + 25;
            } catch (err) {
                console.error("PDF Image rendering error:", err);
                currentY = 125;
            }
        }

        // Summary Details Section
        doc.y = currentY;
        const summaryStartY = doc.y;

        doc.font("Helvetica-Bold")
            .fontSize(16)
            .fillColor("#1b5e20")
            .text("Analysis Details", 70, doc.y);
        doc.moveDown(0.6);

        summaryLines.forEach(line => {
            const match = line.match(/^\*\*([^*]+):\*\*(.*)$/);
            doc.x = 70;
            if (match) {
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#1b5e20');
                doc.text(match[1].trim() + ': ', { continued: true, lineGap: 4.5 })
                   .font('Helvetica').fillColor('#2c3e50').text(match[2].trim(), { lineGap: 4.5 });
            } else {
                doc.font('Helvetica').fontSize(12).fillColor('#2c3e50').text(line, { lineGap: 4.5 });
            }
            doc.moveDown(0.5);
        });

        const summaryEndY = doc.y;
        doc.rect(50, summaryStartY, 4, summaryEndY - summaryStartY).fill("#2e7d32");

        // Page 1 footer
        doc.page.margins.bottom = 0;
        doc.fontSize(8)
           .fillColor("#95a5a6")
           .text("Page 1 of 2  |  Generated by Plant IQ", 0, 745, { align: "center" });
        doc.page.margins.bottom = 50;


        // Page 2: Care recommendations
        doc.addPage();
        doc.rect(0, 0, doc.page.width, 50).fill("#1b5e20");
        doc.rect(0, 47, doc.page.width, 3).fill("#2e7d32");
        doc.fillColor("white")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text("CARE & TREATMENT RECOMMENDATIONS", 0, 18, { align: "center", characterSpacing: 1 });

        let careY = 80;
        doc.y = careY;
        const careStartY = doc.y;

        careLines.forEach(line => {
            let isBullet = false;
            let cleanLine = line.trim();
            if (cleanLine.startsWith('*') || cleanLine.startsWith('-')) {
                isBullet = true;
                cleanLine = cleanLine.replace(/^[\*\-\s]+/, '');
            }

            const match = cleanLine.match(/^\*\*([^*]+):\*\*(.*)$/);
            doc.x = 70;
            if (match) {
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#1b5e20');
                if (isBullet) doc.text('• ', { continued: true, lineGap: 4.5 });
                doc.text(match[1].trim() + ': ', { continued: true, lineGap: 4.5 })
                   .font('Helvetica').fillColor('#2c3e50').text(match[2].trim(), { lineGap: 4.5 });
            } else {
                doc.font('Helvetica').fontSize(12).fillColor('#2c3e50');
                if (isBullet) doc.text('• ', { continued: true, lineGap: 4.5 });
                doc.text(cleanLine.replace(/\*\*/g, ''), { lineGap: 4.5 });
            }
            doc.moveDown(0.6);
        });

        const careEndY = doc.y;
        doc.rect(50, careStartY, 4, careEndY - careStartY).fill("#2e7d32");

        // Disclaimer box
        doc.rect(50, 640, 512, 60).fillAndStroke("#f9f9f9", "#e5e8e8");
        doc.fillColor("#7f8c8d")
           .font("Helvetica-Oblique")
           .fontSize(8.5)
           .text("Disclaimer: This report is generated automatically by Plant IQ for informational purposes. It does not replace professional horticultural or agricultural diagnostic advice. For critical plant care, consult a certified expert.", 70, 650, { width: 472, align: "center" });

        // Page 2 footer
        doc.page.margins.bottom = 0;
        doc.fontSize(8)
           .fillColor("#95a5a6")
           .text("Page 2 of 2  |  Generated by Plant IQ", 0, 745, { align: "center" });
        doc.page.margins.bottom = 50;

        doc.end();

        await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject)
        });

        res.download(filePath, async () => {
            await fsPromises.unlink(filePath);
        });

    } catch (error) {
        console.error("PDF Error:", error);
        res.status(500).json({ error: "Error generating PDF" });
    }
};

export const getHistory = async (req, res) => {
    try {
        const history = await HistoryModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.json(history);
    } catch (error) {
        console.error("Get History Error:", error);
        return res.status(500).json({ error: "Error fetching history" });
    }
};

export const deleteHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await HistoryModel.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!result) {
            return res.status(404).json({ error: "History record not found" });
        }
        return res.json({ message: "History record deleted successfully" });
    } catch (error) {
        console.error("Delete History Error:", error);
        return res.status(500).json({ error: "Error deleting history record" });
    }
};
