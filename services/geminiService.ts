import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FileData, Language } from "../types";

// --- DİKKAT ---
// Vite projelerinde 'process.env' kullanmak siteyi çökertir (Blue Screen hatası).
// Anahtarınızı güvenli bir şekilde aşağıya yapıştırın.

const HARDCODED_KEY = "AIzaSyDiPo9WUtYliKwFbIKDM9Lomzt3-_ndiww"; 

const MODEL_NAME = 'gemini-2.5-flash';

// API Anahtarını güvenli şekilde alma fonksiyonu
const getApiKey = () => {
  // 1. Önce elle girilen anahtara bak
  if (HARDCODED_KEY && !HARDCODED_KEY.includes("AIzaSyDiPo9WUtYliKwFbIKDM9Lomzt3-_ndiww")) {
    return HARDCODED_KEY;
  }
  
  // 2. Vite environment değişkenine bak (import.meta.env)
  try {
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore error
  }

  // 3. Hiçbiri yoksa hata ver
  throw new Error("API Anahtarı bulunamadı! Lütfen services/geminiService.ts dosyasına anahtarınızı yapıştırın.");
};

// Client'ı sadece fonksiyon çağrıldığında oluştur (Lazy Load)
// Bu sayede site açılırken çökmez.
const getAIClient = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({ apiKey });
};

export const analyzeResume = async (file: FileData, language: Language): Promise<AnalysisResult> => {
  const langInstruction = language === 'tr' 
    ? "Respond strictly in Turkish language." 
    : "Respond strictly in English language.";

  const prompt = `
    You are an expert Executive Recruiter and Career Coach with experience in ALL industries.
    
    TASK:
    1. Read the provided resume/document.
    2. DETECT the candidate's target profession/role.
    3. Analyze strictly according to industry standards.
    4. Create a 4-STEP ROADMAP to take them from their current level to a Senior/Lead level.
    
    ANALYSIS CRITERIA:
    1. **Overall Score:** Strict evaluation (Average CV gets 40/100).
    2. **Category Breakdown:** Formatting, Expertise, Impact.
    3. **Roadmap:**
       - Step 1: Immediate Gaps (Week 1-4)
       - Step 2: Advanced Skills (Month 2-3)
       - Step 3: Professional Portfolio (Month 4-5)
       - Step 4: Mastery & Leadership (Month 6+)
    
    ${langInstruction}
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: file.mimeType, data: file.data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Overall score out of 100." },
            summary: { type: Type.STRING, description: "Brutal summary of the resume." },
            detectedRole: { type: Type.STRING, description: "The profession detected." },
            skillsDetected: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key skills found." },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 critical fixes." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 good points." },
            categoryScores: {
              type: Type.OBJECT,
              properties: {
                formatting: { type: Type.INTEGER },
                expertise: { type: Type.INTEGER },
                impact: { type: Type.INTEGER }
              },
              required: ["formatting", "expertise", "impact"]
            },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Missing keywords." },
            projectSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 project ideas." },
            careerAdvice: { type: Type.STRING, description: "Strategic advice." },
            roadmap: {
              type: Type.ARRAY,
              description: "A 4-step path to success.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Phase title (e.g. Foundation)" },
                  duration: { type: Type.STRING, description: "Timeframe (e.g. 1 Month)" },
                  description: { type: Type.STRING, description: "Goal of this phase" },
                  actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 specific things to learn/do" }
                },
                required: ["title", "duration", "description", "actionItems"]
              }
            }
          },
          required: ["score", "summary", "detectedRole", "skillsDetected", "improvements", "strengths", "categoryScores", "missingKeywords", "projectSuggestions", "careerAdvice", "roadmap"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text");
  } catch (error: any) {
    console.error("Analysis failed:", error);
    throw new Error(error.message || "Unknown API Error");
  }
};

export const generateInterviewQuestion = async (
  skills: string[],
  previousQuestions: string[],
  language: Language
): Promise<string> => {
  try {
    const ai = getAIClient();
    const langInstruction = language === 'tr' 
      ? "Ask the question in Turkish." 
      : "Ask the question in English.";

    const prompt = `
      You are an interviewer for a professional job opening.
      Candidate Competencies: ${skills.join(', ')}.
      Previous Questions: ${previousQuestions.join(' | ')}.

      Generate ONE basic, fundamental interview question relevant to the skills/profession provided.
      Target level: Junior/Entry Level.
      ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || (language === 'tr' ? "Bana en başarılı projenden bahset." : "Tell me about your most successful project.");
  } catch (error) {
    return language === 'tr' ? "Güçlü ve zayıf yönlerin nelerdir?" : "What are your strengths and weaknesses?";
  }
};

export const evaluateAnswer = async (
  question: string,
  answer: string,
  language: Language
): Promise<{ score: number; critique: string }> => {
  try {
    const ai = getAIClient();
    const langInstruction = language === 'tr' 
      ? "Provide the critique in Turkish." 
      : "Provide the critique in English.";

    const prompt = `
      Question: "${question}"
      Candidate Answer: "${answer}"

      Evaluate this answer for a Junior/Intern level position.
      1. Give a score from 1-10.
      2. Provide a short, 1-sentence helpful tip.
      ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            critique: { type: Type.STRING }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Failed to parse");
  } catch (error) {
    return { score: 5, critique: language === 'tr' ? "Cevap değerlendirilemedi." : "Could not evaluate answer." };
  }
};