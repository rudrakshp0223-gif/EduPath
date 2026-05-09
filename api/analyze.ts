import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it to your environment variables.");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

// Vercel serverless function configuration for larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  // Add CORS headers just in case
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
              properties: {
                salaryTrend: { type: Type.STRING },
                jobDemand: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ["salaryTrend", "jobDemand", "summary"]
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
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

    res.status(200).json(JSON.parse(response.text));
  } catch (err: any) {
    console.error("Vercel API error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze data" });
  }
}
