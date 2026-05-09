import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";

// Initialize Gemini without crashing on startup if key is missing
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse large JSON payloads (for base64 files)
  app.use(express.json({ limit: "50mb" }));

  // --- API Routes ---
  app.post("/api/analyze", async (req, res) => {
    try {
      const { formData, fileContent, fileMimeType } = req.body;
      // Explicit model
      const model = "gemini-2.5-flash"; // A faster, standard model
      const aiClient = getAI();
      
      const prompt = `You are an expert career counselor. Analyze the student's data and recommend the best career path.
        
        Student Form Data:
        - Top 3 highest-scoring subjects: ${formData?.topSubjects}
        - Subject enjoyed so much they'd study it for free: ${formData?.passionSubject}
        - Prefers working with: ${formData?.workPreference}
        - Location: ${formData?.location}
        - Willing to relocate: ${formData?.relocate ? 'Yes' : 'No'}
        
        ${fileContent ? "Also consider the attached marksheet data." : "No marksheet was provided, so provide a generalized recommendation based on their explicit answers."}

        CRITICAL SAFETY DIRECTIVE: Check the form data for inappropriate, offensive, or troll input.
        If it is inappropriate/offensive, you must return "Inappropriate Input" for the targetCareer.title, and fill the rest with generic empty strings or defaults.
      `;

      const parts: any[] = [{ text: prompt }];

      if (fileContent && fileMimeType) {
        parts.push({
          inlineData: {
            data: fileContent,
            mimeType: fileMimeType,
          },
        });
      }

      const response = await aiClient.models.generateContent({
        model: model,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            description: "Career recommendation data",
            properties: {
              targetCareer: {
                type: Type.OBJECT,
                description: "The targeted best fit career persona",
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reasoning: { type: Type.STRING, description: "Why this matches them" }
                },
                required: ["title", "description", "reasoning"]
              },
              programs: {
                type: Type.ARRAY,
                description: "3 specific UG degrees/diplomas",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                  },
                  required: ["name", "reasoning"]
                }
              },
              institutes: {
                type: Type.ARRAY,
                description: "3-5 top colleges for these programs",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    bio: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["name", "bio", "url"]
                }
              },
              marketInsights: {
                type: Type.OBJECT,
                description: "Current salary trends and job demand for 2026-2030",
                properties: {
                  salaryTrend: { type: Type.STRING },
                  jobDemand: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["salaryTrend", "jobDemand", "summary"]
              },
              roadmap: {
                type: Type.ARRAY,
                description: "Timeline steps from Now to First Job Role",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phase: { type: Type.STRING, description: "e.g., Now, Entrance Exams, Degree, First Job" },
                    description: { type: Type.STRING }
                  },
                  required: ["phase", "description"]
                }
              }
            },
            required: ["targetCareer", "programs", "institutes", "marketInsights", "roadmap"]
          }
        }
      });

      if (!response.text) {
        throw new Error("No response text from Gemini");
      }

      const parsed = JSON.parse(response.text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/analyze:", err);
      res.status(500).json({ error: err.message || "Failed to analyze student data" });
    }
  });

  // --- Vite Middleware (Development) / Static Files (Production) ---
  if (process.env.NODE_ENV !== "production") {
    // For local development, use Vite's development server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the dist directory
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
