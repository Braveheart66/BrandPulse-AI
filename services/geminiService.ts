import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, FeedbackItem, Sentiment, ExecutiveSummary, CompanyProfile } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      enum: ["Positive", "Negative", "Neutral"],
      description: "The overall sentiment of the text."
    },
    emotion: {
      type: Type.STRING,
      description: "The primary emotion detected (e.g., Anger, Joy, Frustration)."
    },
    intensity: {
      type: Type.INTEGER,
      description: "Intensity of the emotion on a scale of 1 to 10."
    },
    topics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 1-3 key topics discussed."
    },
    actionableInsight: {
      type: Type.STRING,
      description: "A short, strategic recommendation for the brand based on this feedback."
    }
  },
  required: ["sentiment", "emotion", "intensity", "topics", "actionableInsight"]
};

const summarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.STRING,
      description: "A 2-sentence executive summary of the overall brand sentiment."
    },
    topIssues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of the top 3 most critical negative issues identified."
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 strategic actions the company should take immediately."
    }
  },
  required: ["overview", "topIssues", "recommendations"]
};

const getContextPrompt = (profile?: CompanyProfile) => {
  if (!profile || !profile.name) return "";
  return `\nContext: You are analyzing feedback for "${profile.name}"${profile.industry ? `, a company in the ${profile.industry} industry` : ""}.${profile.description ? `\nCompany Description: ${profile.description}` : ""}`;
};

export const analyzeFeedbackText = async (text: string, profile?: CompanyProfile): Promise<AnalysisResponse> => {
  try {
    const context = getContextPrompt(profile);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following customer feedback for a brand. Be objective and precise.${context}\n\nFeedback: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for consistent classification
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");
    
    // Parse the JSON directly as the SDK handles the stripping if configured correctly, 
    // but sometimes it's good to be safe.
    const result = JSON.parse(jsonText) as AnalysisResponse;
    
    // Ensure the enum matches our TS Enum exactly
    let mappedSentiment = Sentiment.Neutral;
    if (result.sentiment === "Positive") mappedSentiment = Sentiment.Positive;
    if (result.sentiment === "Negative") mappedSentiment = Sentiment.Negative;

    return {
      ...result,
      sentiment: mappedSentiment
    };

  } catch (error) {
    console.error("Error analyzing feedback:", error);
    // Fallback if API fails
    return {
      sentiment: Sentiment.Neutral,
      emotion: "Unknown",
      intensity: 0,
      topics: ["Error"],
      actionableInsight: "Analysis failed. Please try again."
    };
  }
};

export const generateExecutiveSummary = async (items: FeedbackItem[], profile?: CompanyProfile): Promise<ExecutiveSummary> => {
  try {
    const context = getContextPrompt(profile);
    // Summarize the input data to avoid token limits if the list is huge, 
    // but for this demo, we pass the raw text of the items.
    const feedbackList = items.map(i => `- [${i.sentiment}] (${i.topics.join(', ')}): ${i.text}`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Flash is good for summarization of large context
      contents: `You are a Chief Customer Officer. Provide a specific executive summary based on the following feedback logs. Focus on patterns, root causes, and business impact.${context}\n\nFeedback Logs:\n${feedbackList}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No summary generated");

    return JSON.parse(jsonText) as ExecutiveSummary;

  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      overview: "Could not generate summary at this time.",
      topIssues: [],
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }
};
