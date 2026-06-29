import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK with User-Agent for AI Studio telemetry
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// Enable CORS for WordPress embed script integration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const NIYA_SYSTEM_INSTRUCTION = `You are Niya, a friendly and knowledgeable AI business assistant for NIHT Digital Marketing Institute — a leading digital marketing training institute based in Kolkata, India, founded in 2005. You help website visitors learn about courses, get career guidance, and take the next step toward enrolling.

---

🏫 ABOUT NIHT:
- Full name: NIHT Infosolution Pvt. Ltd.
- Website: nihtdigitalmarketing.com
- Location: Kolkata, India (with online courses available nationwide)
- Founded: 2005 | Trained 20,000+ students across West Bengal, Odisha, Jharkhand, and Karnataka
- Led by founder and lead trainer Angshuman Sett — a certified Google AdWords professional with 15+ years of experience
- Agency-backed institute — students learn from mentors who run real brand campaigns

---

📚 COURSES OFFERED:

1. Master Program in Digital Marketing + Gen AI + Agentic AI
   - The flagship course covering SEO, PPC/Google Ads, Social Media Marketing, Content Marketing, Email Marketing, Analytics, AI tools, AI Agents, and Chatbots
   - Includes copywriting, landing pages, CTAs, and sales psychology
   - Hands-on live campaigns and real projects

2. Certificate Program in Digital Marketing
   - Ideal for beginners, students after 12th, and career switchers
   - Covers SEO, social media, content creation, ad campaigns
   - No prior experience or technical background needed

3. E-commerce & Dropshipping Training
   - Learn to sell online, manage marketplaces (including Amazon), and run e-commerce businesses

4. Web Development Course
   - Practical website building skills

5. Creative Designing Classes
   - Tools like Canva, Photoshop, video editing, and more

6. Individual Module Courses (choose one or all):
   - SEO | Social Media Marketing | Google Ads | Meta Ads | Email Marketing | Affiliate Marketing | Mobile Marketing | YouTube & AdSense | Content Marketing

---

🏆 KEY BENEFITS NIHT OFFERS:
- 100% Placement Support with industry tie-ups
- Paid internship opportunities
- Global Certifications: Google Ads, Google Analytics, Facebook/Meta, Semrush, HubSpot, Twitter
- Access to a fully equipped in-house studio for content creation, reels, podcasts, and product demos
- Real live campaign panels, not just slides or theory
- Personal career coach and resume support
- Competitive course fees with easy installment options (GST @18% extra)
- Online and offline classes available
- Suitable for students, working professionals, business owners, and entrepreneurs

---

🎯 YOUR ROLE AS NIYA:
- Welcome visitors warmly and help them identify which course suits their goal
- Ask about their background (student, professional, business owner) and career goal to recommend the right course
- Explain course highlights, certifications, and career outcomes clearly
- Encourage visitors to enroll or book a free counselling session
- Answer FAQs about eligibility, fees, schedule, and placement
- Always be positive, motivating, and supportive
- Keep responses concise — under 150 words unless a detailed comparison is needed

---

❓ COMMON QUESTIONS YOU SHOULD HANDLE:
- "Which course is best for me?" → Ask their background and goal, then suggest
- "Do I need a degree or coding skills?" → No, courses are beginner-friendly
- "Is the course available online?" → Yes, available online across India
- "What certifications will I get?" → Google, Meta, Semrush, HubSpot and more
- "Is there placement support?" → Yes, 100% placement assistance
- "What is the course fee?" → Competitive fees with easy installments; recommend they contact NIHT for current pricing
- "Can I join after 12th?" → Absolutely, the Certificate Program is designed for this

---

🚫 BOUNDARIES:
- Only answer questions related to NIHT courses, digital marketing as a career, and enrollment guidance
- Do not discuss competitors or make negative comparisons
- Do not invent specific fee amounts — direct users to contact NIHT for exact pricing
- If unsure about something, say: "Great question! I'd recommend speaking directly with our counselling team for the most accurate answer."

---

📞 CONTACT & NEXT STEP:
Always end conversations by encouraging the user to:
- Visit: nihtdigitalmarketing.com
- Or say: "Would you like me to help you choose the right course? Just tell me a little about yourself!"`;

// API route for chat assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in server environment.",
        reply: "Hello! I am Niya. I am currently offline because the website administrator hasn't configured my API key in the settings panel yet. Please check back shortly!",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages parameter." });
    }

    // Format chat history for the modern @google/genai SDK
    const contents = messages.map((msg: any) => ({
      role: msg.role === "model" || msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // Call Gemini with Structured JSON to extract potential leads alongside generating conversational reply!
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: NIYA_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "Niya's conversational reply to the user. Adheres strictly to the guidelines (warm, professional, concise, direct links to nihtdigitalmarketing.com, under 150 words).",
            },
            extractedLead: {
              type: Type.OBJECT,
              description: "Extracted user info if the visitor shared their name, email, phone, background (student, professional, business owner, etc.), or specific course interests. Keep fields null if not yet shared.",
              properties: {
                name: { type: Type.STRING, description: "Full name if shared" },
                email: { type: Type.STRING, description: "Email address if shared" },
                phone: { type: Type.STRING, description: "Phone/WhatsApp number if shared" },
                background: { 
                  type: Type.STRING, 
                  description: "Background type. Must be exactly 'student', 'professional', 'business_owner', 'other', or null." 
                },
                interestedCourse: { type: Type.STRING, description: "Course name or key marketing domain they want to learn" },
                notes: { type: Type.STRING, description: "Short summary of user's context or goals discussed so far" },
              },
            },
          },
          required: ["reply"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response content from model");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({
      error: error.message || "An error occurred while calling the Gemini API.",
      reply: "Great question! I'd recommend speaking directly with our counselling team at nihtdigitalmarketing.com for the most accurate answer.",
    });
  }
});

// Dynamic JavaScript file to embed Niya on WordPress or other external websites!
app.get("/api/widget.js", (req, res) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const apiEndpoint = `${protocol}://${host}/api/chat`;

  // Customization via query params
  const primaryColor = req.query.primaryColor || "0F172A"; // Slate-900 default
  const title = req.query.title || "Chat with Niya";
  const welcomeMessage = req.query.welcome || "Hi! I'm Niya, your AI business assistant for NIHT Digital Marketing Institute. How can I help you today?";
  const position = req.query.position || "right"; // left or right

  const jsWidget = `
(function() {
  // Prevent duplicate loading
  if (window.__NiyaWidgetLoaded) return;
  window.__NiyaWidgetLoaded = true;

  // Insert styles
  const style = document.createElement('style');
  style.innerHTML = \`
    .niya-launcher {
      position: fixed;
      bottom: 20px;
      \${position === 'left' ? 'left: 20px;' : 'right: 20px;'}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #\${primaryColor};
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 999999;
    }
    .niya-launcher:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    .niya-launcher svg {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .niya-container {
      position: fixed;
      bottom: 95px;
      \${position === 'left' ? 'left: 20px;' : 'right: 20px;'}
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 550px;
      max-height: calc(100vh - 120px);
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      z-index: 999999;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }
    .niya-header {
      background-color: #\${primaryColor};
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .niya-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .niya-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border: 2px solid white;
    }
    .niya-title-text {
      font-weight: 600;
      font-size: 15px;
    }
    .niya-subtitle-text {
      font-size: 11px;
      opacity: 0.8;
    }
    .niya-close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      opacity: 0.8;
    }
    .niya-close-btn:hover {
      opacity: 1;
    }
    .niya-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background-color: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .niya-message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.45;
      word-wrap: break-word;
    }
    .niya-message-assistant {
      background-color: white;
      color: #1e293b;
      align-self: flex-start;
      border-bottom-left-radius: 2px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid #f1f5f9;
    }
    .niya-message-user {
      background-color: #\${primaryColor};
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 2px;
    }
    .niya-message a {
      color: #2563eb;
      text-decoration: underline;
    }
    .niya-message-user a {
      color: white;
    }
    .niya-input-area {
      padding: 12px;
      background-color: white;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 8px;
    }
    .niya-input {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 24px;
      padding: 8px 16px;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s;
    }
    .niya-input:focus {
      border-color: #\${primaryColor};
    }
    .niya-send-btn {
      background-color: #\${primaryColor};
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .niya-send-btn:hover {
      opacity: 0.9;
    }
    .niya-send-btn svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }
    .niya-typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: white;
      border-radius: 12px;
      align-self: flex-start;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid #f1f5f9;
    }
    .niya-dot {
      width: 6px;
      height: 6px;
      background: #94a3b8;
      border-radius: 50%;
      animation: niya-bounce 1.4s infinite ease-in-out both;
    }
    .niya-dot:nth-child(1) { animation-delay: -0.32s; }
    .niya-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes niya-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    .niya-badge {
      font-size: 9px;
      text-align: center;
      padding: 4px;
      color: #94a3b8;
      background-color: #f8fafc;
      border-top: 1px solid #f1f5f9;
    }
    .niya-badge a {
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
    }
  \`;
  document.head.appendChild(style);

  // Create Launcher
  const launcher = document.createElement('div');
  launcher.className = 'niya-launcher';
  launcher.id = 'niya-launcher';
  launcher.innerHTML = \`<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>\`;
  document.body.appendChild(launcher);

  // Create Container
  const container = document.createElement('div');
  container.className = 'niya-container';
  container.id = 'niya-container';
  container.innerHTML = \`
    <div class="niya-header">
      <div class="niya-header-info">
        <div class="niya-avatar">N</div>
        <div>
          <div class="niya-title-text">\${title}</div>
          <div class="niya-subtitle-text">Niya AI Business Assistant</div>
        </div>
      </div>
      <button class="niya-close-btn" id="niya-close-btn">&times;</button>
    </div>
    <div class="niya-messages" id="niya-messages">
      <div class="niya-message niya-message-assistant">\${welcomeMessage}</div>
    </div>
    <div class="niya-input-area">
      <input type="text" class="niya-input" id="niya-input" placeholder="Type a message..." autocomplete="off">
      <button class="niya-send-btn" id="niya-send-btn">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
    <div class="niya-badge">Powered by <a href="https://nihtdigitalmarketing.com" target="_blank">NIHT Digital Marketing</a></div>
  \`;
  document.body.appendChild(container);

  const msgHistory = [{ role: 'model', text: \`\${welcomeMessage}\` }];

  // Toggle widget
  launcher.addEventListener('click', () => {
    container.style.display = 'flex';
    launcher.style.display = 'none';
    const input = document.getElementById('niya-input');
    if (input) input.focus();
  });

  const closeBtn = document.getElementById('niya-close-btn');
  closeBtn.addEventListener('click', () => {
    container.style.display = 'none';
    launcher.style.display = 'flex';
  });

  // Append a message to the UI
  const messageArea = document.getElementById('niya-messages');
  function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'niya-message niya-message-' + role;
    
    // Simple URL linking helper
    let formattedText = text.replace(/(https?:\\/\\/[^\\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    formattedText = formattedText.replace(/\\n/g, '<br>');
    msgDiv.innerHTML = formattedText;
    
    messageArea.appendChild(msgDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  // Handle send message
  const inputEl = document.getElementById('niya-input');
  const sendBtn = document.getElementById('niya-send-btn');

  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    appendMessage('user', text);
    msgHistory.push({ role: 'user', text: text });

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'niya-typing-indicator';
    typing.id = 'niya-typing';
    typing.innerHTML = '<div class="niya-dot"></div><div class="niya-dot"></div><div class="niya-dot"></div>';
    messageArea.appendChild(typing);
    messageArea.scrollTop = messageArea.scrollHeight;

    try {
      const response = await fetch('\${apiEndpoint}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: msgHistory })
      });
      const data = await response.json();
      
      const typingIndicator = document.getElementById('niya-typing');
      if (typingIndicator) typingIndicator.remove();

      if (data.reply) {
        appendMessage('assistant', data.reply);
        msgHistory.push({ role: 'model', text: data.reply });
      } else {
        appendMessage('assistant', "I'm sorry, I encountered an issue. Please try again or visit nihtdigitalmarketing.com!");
      }
    } catch (e) {
      const typingIndicator = document.getElementById('niya-typing');
      if (typingIndicator) typingIndicator.remove();
      appendMessage('assistant', "I'm having trouble connecting to the server. Please visit our website directly at nihtdigitalmarketing.com.");
      console.error(e);
    }
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();
  `;

  res.setHeader("Content-Type", "application/javascript");
  res.send(jsWidget);
});

// Configure Vite middleware for development or serve production builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
