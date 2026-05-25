import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini SDK setup
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI Chatbot will run in fallback simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Strategy Consultant API Endpoint
app.post("/api/ai-consultant", async (req, res) => {
  try {
    const { businessName, industry, painPoint, contactEmail, contactPhone } = req.body;

    if (!industry || !painPoint) {
      return res.status(400).json({ error: "Industry and pain points are required." });
    }

    const ai = getAI();
    let proposalText = "";

    const promptMessage = `
You are the Executive Lead AI Automation Architect & Conversion Strategist at "3Cords System Global Resources", Nigeria's premier elite digital agency.
Formulate a highly professional, brutally honest, but deeply inspiring and tailored "Digital Growth & AI Automation Strategic Proposal" for a business in Nigeria.

--- CLIENT CONTEXT & PROFILE ---
Business Name/Owner: ${businessName || "Valued Nigerian Business Owner"}
Industry/Type: ${industry} (e.g., School, Church, Real Estate, SME Retailer, Startup, Entrepreneur)
Primary Pain Point / Goal: ${painPoint}
Contact Info: Phone: ${contactPhone || "Not provided"}, Email: ${contactEmail || "Not provided"}

--- PROPOSAL DIRECTIVE ---
Make the response professional, converting, and written in clear, elite agency style with realistic Nigerian context (costing, infrastructure challenges like power/internet, customer habits, WhatsApp preference).
structure the response in Markdown with these key headers:
1. 💡 THE CORE DIAGNOSIS & OPPORTUNITY
   - Identify why their current operations/tech (or lack thereof) are holding them back from scale.
   - Address the specific pain point: ${painPoint}.
2. ⚡ THE PROPOSED 3CORDS SOLUTION (Web + AI Automation)
   - Outline a 2-stage solution:
     - Stage 1: Modern Premium Core Web Presence (Responsive, high-converting).
     - Stage 2: Tailored AI automation (e.g., custom WhatsApp Lead bots, automated billing, educational portals, customer-care automations).
3. 💰 ROI & COST-BENEFIT ESTIMATION (in Nigerian Naira / USD equivalents)
   - Estimated timeline (e.g., 2–4 weeks)
   - Estimated setup fee & ROI analysis (showing hours saved, customer retention improvements).
4. 🚀 ACTIONABLE NEXT STEPS
   - Call to action (encourage them to click the "Connect with WhatsApp Consultant" button to lock in a free system architecture audit).

Be realistic, professional, and omit internal metadata or technical boilerplate. Keep it very punchy and high-converting.
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMessage,
        config: {
          systemInstruction: "You are an elite enterprise consultant at 3Cords System. You speak with deep Nigerian business context, absolute clarity, and a focus on high value, saving time, and generating money for local businesses through modern websites and AI chatbots.",
          temperature: 0.7,
        }
      });
      proposalText = response.text || "Failed to generate proposal contents.";
    } else {
      // Rule-based high-quality simulator as a fallback in case key is missing
      proposalText = `### 💡 THE CORE DIAGNOSIS & OPPORTUNITY
For your **${industry}** business (${businessName || "Valued SME"}), the primary bottleneck is **"${painPoint}"**. 
In the Nigerian digital landscape, over 85% of customer interactions happen on mobile phones, with a fierce reliance on WhatsApp for prompt responses. Traditional manual processes or non-responsive websites result in a **leakage of over 40% of standard incoming leads** due to delayed or missing feedback.

---

### ⚡ THE PROPOSED 3CORDS SOLUTION (Web + AI Automation)
We recommend a dual-stack setup tailored perfectly for Nigerian businesses:
*   **Phase 1 — Elite Web Engine**: A lightning-fast, highly optimized web portal utilizing lightweight, responsive components to ensure instant load times even on slow 3G/4G networks in Lagos, Abuja, and other states. Includes built-in WhatsApp instant routers.
*   **Phase 2 — AI Auto-Pilot Bot**: A custom-tailored automated WhatsApp CRM assistant connected to a lightweight backend. It instantly responds to inquiries about pricing, services, registration, or appointment bookings, operating 24/7/365 without rest.

---

### 💰 ROI & COST-BENEFIT ESTIMATION
*   **Timeline**: 14 to 21 Working Days.
*   **Financial Impact**: By automating user onboarding, admissions, or lead capture, we estimate a **70% reduction in customer-care overhead** and a **15% to 30% increase in lead-to-conversion rate**.
*   **Investment Margin**: Starting at ₦250,000 for core premium platforms, giving an immediate payback trajectory within 45 days.

---

### 🚀 ACTIONABLE NEXT STEPS
Unlock maximum scale. Your personalized AI diagnostic code has been generated. Tap the **"Book Free Strategy Call"** or **"Launch WhatsApp Consultation"** floating button right now to schedule a live demo of your agent in action!`;
    }

    return res.json({ success: true, proposal: proposalText });
  } catch (error: any) {
    console.error("Error in AI Consultant Endpoint:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
});

// Serve static assets in production; run Vite in dev mode
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`3Cords System server is running on port ${PORT}`);
  });
}

bootstrap();
