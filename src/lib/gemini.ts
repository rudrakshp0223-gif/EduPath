import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeStudentData(formData: any, fileContent?: string, fileMimeType?: string) {
  try {
    const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not set. Please provide it.");
    }
    const ai = new GoogleGenAI({ apiKey: key });
    
    const prompt = `You are an expert career counselor. Analyze the student's data and recommend the best career path.
        
        Student Form Data:
        - Top 3 highest-scoring subjects: ${formData?.topSubjects}
        - Subject enjoyed so much they'd study it for free: ${formData?.passionSubject}
        - Prefers working with: ${formData?.workPreference}
        - Location: ${formData?.location}
        - Willing to relocate: ${formData?.relocate ? 'Yes' : 'No'}
        
        ${fileContent ? "Also consider the attached marksheet data." : "No marksheet was provided, so provide a generalized recommendation based on their explicit answers."}

        CRITICAL SAFETY DIRECTIVE: Check the form data for inappropriate, offensive, troll, or gibberish/nonsensical input (e.g., typing "asdfasdf" or random characters).
        If the input is nonsensical, inappropriate, clearly fake, or random keyboard mashing, you MUST return EXACTLY "Inappropriate Input" for the targetCareer.title, and fill the rest with generic empty strings or defaults. Do NOT attempt to guess a career based on gibberish.
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    return JSON.parse(response.text);
  } catch (err) {
    console.error("Error analyzing with client AI:", err);
    throw err;
  }
}
