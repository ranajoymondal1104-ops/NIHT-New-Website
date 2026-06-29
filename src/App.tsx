import { useState } from "react";
import { 
  Laptop, Users, Code, Award, CheckCircle2, ChevronRight, Sparkles, 
  Database, RefreshCw, X, MessageSquare, AlertCircle, PlayCircle 
} from "lucide-react";
import { LeadRecord, Message, WidgetConfig, ExtractedLead } from "./types";
import WebsiteMockup from "./components/WebsiteMockup";
import DashboardStats from "./components/DashboardStats";
import IntegrationPanel from "./components/IntegrationPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<"preview" | "leads" | "integration">("preview");
  
  // Customization state for Niya floating widget
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    primaryColor: "0F172A",
    title: "Chat with Niya",
    welcomeMessage: "Hi! I'm Niya, your friendly AI career coach for NIHT Digital Marketing Institute. How can I help you choose the right course today?",
    position: "right"
  });

  // Track active session ID for the live simulator chat so we can update it incrementally
  const [currentSessionLeadId] = useState<string>(() => "live_session_" + Date.now());

  // Seed initial high-quality realistic leads so the board looks populated and professional instantly!
  const [leads, setLeads] = useState<LeadRecord[]>([
    {
      id: "seed_1",
      extracted: {
        name: "Subham Sen",
        email: "subham.sen@gmail.com",
        phone: "+91-98402-12345",
        background: "student",
        interestedCourse: "Master Program in Digital Marketing + Gen AI + Agentic AI",
        notes: "Recently finished 12th board exams and looking to build a high-income career. He wants to know if coding is required."
      },
      createdAt: "Today, 10:15 AM",
      lastMessage: "Do I need a computer science degree to learn AI agents?",
      status: "new",
      conversation: [
        { id: "1", role: "model", text: "Hi! I'm Niya, your AI business assistant for NIHT. How can I help you today?", timestamp: "10:10 AM" },
        { id: "2", role: "user", text: "Hey! I just finished my 12th class in Kolkata. I want to build a career in digital marketing. Which course should I do?", timestamp: "10:11 AM" },
        { id: "3", role: "model", text: "Congratulations on completing your 12th! That is the perfect time to start. I highly recommend our Master Program in Digital Marketing + Gen AI + Agentic AI. It covers everything from SEO to real AI agents. Do you have any prior computer science or technical background?", timestamp: "10:12 AM" },
        { id: "4", role: "user", text: "No, I am from commerce. My name is Subham Sen and you can reach me at subham.sen@gmail.com or call +91-98402-12345. Do I need a computer science degree to learn AI agents?", timestamp: "10:14 AM" },
        { id: "5", role: "model", text: "Absolutely not, Subham! Our courses are designed from scratch for absolute beginners. You do not need any coding or technical degree. Since you are looking for a complete career launch, this program includes 100% placement support and real live campaigns. Would you like me to guide you on how to book a free demo counselling session?", timestamp: "10:15 AM" }
      ]
    },
    {
      id: "seed_2",
      extracted: {
        name: "Neha Sharma",
        email: "neha.digital@yahoo.co.in",
        phone: "+91-88224-54321",
        background: "professional",
        interestedCourse: "Web Development Course",
        notes: "Working as a copywriter. Wants to expand into building full landing pages and storefronts to increase client fees."
      },
      createdAt: "Yesterday, 4:32 PM",
      lastMessage: "Are there weekend classes available for working folks?",
      status: "contacted",
      conversation: [
        { id: "1", role: "model", text: "Hi! I'm Niya. How can I help you today?", timestamp: "4:28 PM" },
        { id: "2", role: "user", text: "Hi Niya, I'm Neha. I currently work as a copywriter but I want to learn web development to build landing pages for my clients. Do you have a practical course?", timestamp: "4:29 PM" },
        { id: "3", role: "model", text: "Hi Neha! It's wonderful to meet you. Yes, we have a very practical Web Development Course specifically designed to teach website building and landing page optimization. It fits perfectly with copywriting to create high-converting funnels! Are you looking for weekend classes while working?", timestamp: "4:31 PM" },
        { id: "4", role: "user", text: "Yes, exactly! My contact is neha.digital@yahoo.co.in and +91-88224-54321. Are there weekend classes available for working folks?", timestamp: "4:32 PM" },
        { id: "5", role: "model", text: "Yes, Neha! We offer both offline batches in Kolkata and flexible online interactive batches with weekend options tailored specifically for working professionals. You will learn hands-on by creating a custom portfolio of storefronts.", timestamp: "4:32 PM" }
      ]
    },
    {
      id: "seed_3",
      extracted: {
        name: "Rajesh Dev",
        email: "rajesh.bakery@outlook.com",
        phone: "+91-99321-99000",
        background: "business_owner",
        interestedCourse: "E-commerce & Dropshipping Training",
        notes: "Owns a local bakery brand in Kolkata. Interested in expanding to online shipping and managing Shopify / Amazon ad listings."
      },
      createdAt: "2 days ago, 11:04 AM",
      lastMessage: "Can we learn about shipping integrations and Amazon marketplaces?",
      status: "enrolled",
      conversation: [
        { id: "1", role: "model", text: "Hi! I'm Niya. How can I help you explore NIHT programs?", timestamp: "10:55 AM" },
        { id: "2", role: "user", text: "I run a local bakery called Rajesh Dev's Bakeries in Kolkata. We want to start selling our custom cookies online across India. Which training would help?", timestamp: "10:58 AM" },
        { id: "3", role: "model", text: "That sounds delicious, Rajesh! You should absolutely look into our specialized E-commerce & Dropshipping Training. It teaches you to build e-commerce sites (using Shopify), manage marketplace channels like Amazon, and run high-converting ad campaigns. Would you be running the store yourself?", timestamp: "11:01 AM" },
        { id: "4", role: "user", text: "Yes, myself and my son. My email is rajesh.bakery@outlook.com and phone +91-99321-99000. Can we learn about shipping integrations and Amazon marketplaces?", timestamp: "11:03 AM" },
        { id: "5", role: "model", text: "Absolutely! The program includes detailed modules on setting up payment gateways, nationwide shipping providers, and optimizing organic Amazon listings to maximize sales. I recommend booking an direct counselling call to map your store strategy!", timestamp: "11:04 AM" }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<Message[] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTestPrompt, setActiveTestPrompt] = useState<string | null>(null);

  // Triggered whenever Niya extracts a lead in the interactive simulator widget
  const handleLeadCaptured = (extracted: ExtractedLead, chatHistory: Message[]) => {
    setLeads(prev => {
      const existsIndex = prev.findIndex(l => l.id === currentSessionLeadId);
      const lastMsg = chatHistory[chatHistory.length - 1]?.text || "";

      if (existsIndex >= 0) {
        const existing = prev[existsIndex];
        
        // Trigger temporary UI notification on subsequent extractions
        if (!existing.extracted.name && extracted.name) {
          showNotification(`Niya captured client name: "${extracted.name}"`);
        } else if (!existing.extracted.email && extracted.email) {
          showNotification(`Niya extracted email: "${extracted.email}"`);
        }

        const updatedLead: LeadRecord = {
          ...existing,
          extracted: {
            name: extracted.name || existing.extracted.name,
            email: extracted.email || existing.extracted.email,
            phone: extracted.phone || existing.extracted.phone,
            background: extracted.background || existing.extracted.background,
            interestedCourse: extracted.interestedCourse || existing.extracted.interestedCourse,
            notes: extracted.notes || existing.extracted.notes,
          },
          conversation: chatHistory,
          lastMessage: lastMsg,
        };

        const updatedLeads = [...prev];
        updatedLeads[existsIndex] = updatedLead;
        return updatedLeads;
      } else {
        // First-time capture
        showNotification(
          extracted.name 
            ? `Niya captured a new lead: "${extracted.name}"` 
            : "Niya is analyzing a live visitor profile..."
        );

        const newLead: LeadRecord = {
          id: currentSessionLeadId,
          extracted: extracted,
          createdAt: "Just now",
          lastMessage: lastMsg,
          conversation: chatHistory,
          status: "new"
        };
        return [newLead, ...prev];
      }
    });
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleUpdateLeadStatus = (leadId: string, status: "new" | "contacted" | "enrolled") => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
  };

  const handleTriggerPromptTest = (promptText: string) => {
    setActiveTestPrompt(promptText);
    setActiveTab("preview");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* Upper header admin nav */}
      <header className="bg-slate-900 border-b border-slate-800 text-white py-4 px-6 md:px-12 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base tracking-tight flex items-center gap-2">
              Niya Control Deck <span className="bg-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-500/20">WordPress Agent v1.0</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium">NIHT Digital Marketing Institute • Kolkata</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs font-semibold border border-slate-700/40">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${activeTab === "preview" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            <Laptop className="w-3.5 h-3.5" /> Simulated Website
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 relative ${activeTab === "leads" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            <Database className="w-3.5 h-3.5" /> Captured Leads
            {leads.filter(l => l.status === "new").length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("integration")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${activeTab === "integration" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
          >
            <Code className="w-3.5 h-3.5" /> WordPress Embed
          </button>
        </div>
      </header>

      {/* Real-time lead analysis toast notification */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">AI Background Processing</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{notification}</p>
          </div>
        </div>
      )}

      {/* Main split work area */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-68px)] overflow-hidden">
        {/* Main interactive window area based on selected tab */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          {activeTab === "preview" && (
            <WebsiteMockup 
              widgetConfig={widgetConfig} 
              onLeadCaptured={handleLeadCaptured}
              activeTestPrompt={activeTestPrompt}
              clearActiveTestPrompt={() => setActiveTestPrompt(null)}
            />
          )}

          {activeTab === "leads" && (
            <div className="p-6 md:p-8 max-w-7xl mx-auto h-full overflow-y-auto">
              <DashboardStats 
                leads={leads} 
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onSelectLeadChat={(conv) => setSelectedChat(conv)}
              />
            </div>
          )}

          {activeTab === "integration" && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto">
              <IntegrationPanel 
                config={widgetConfig} 
                onChangeConfig={(cfg) => setWidgetConfig(cfg)}
              />
            </div>
          )}
        </div>

        {/* Sidebar Admin panel containing fast shortcuts and guidelines */}
        <aside className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-5 flex flex-col gap-6 justify-between select-text overflow-y-auto h-auto md:h-full">
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-slate-950 text-xs uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400" /> Quick-Test Scenarios
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">Click any scenario below to immediately trigger high-intent student profiles inside the chat widget simulator.</p>
              
              <div className="mt-4 space-y-2.5">
                <button 
                  onClick={() => handleTriggerPromptTest("Hello! I am Amit Sen. I just finished college. Can you recommend a digital marketing course with placement support? My email is amit.sen@outlook.com.")}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-left transition-all hover:border-slate-300 flex items-start gap-2.5 group cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Simulate Student Inquirer</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Amit Sen: college graduate, looking for job placements, shares email.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleTriggerPromptTest("Hi, I want to learn dropshipping. I run a leather goods store in Kolkata and want to launch an online shop. My number is +91-90000-88888.")}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-left transition-all hover:border-slate-300 flex items-start gap-2.5 group cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Simulate Business Owner</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Local store, wants dropshipping/online Shopify expansion, shares mobile.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleTriggerPromptTest("Can I join digital marketing course if I don't know computer coding? I am a copywriter.")}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 text-left transition-all hover:border-slate-300 flex items-start gap-2.5 group cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Simulate Career Switcher</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Copywriter switcher, anxious about technical coding requirements.</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="font-bold text-slate-950 text-xs uppercase tracking-wider">AI Guardrails (System Constraints)</h3>
              <ul className="space-y-2.5 text-[11px] text-slate-600 leading-relaxed">
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Never invents fees — directs visitors to consult advisors.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Only discusses NIHT courses & digital marketing.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Keeps answers concise (under 150 words).</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 text-[10px] text-slate-400 leading-relaxed text-center">
            Designed for **NIHT Infosolution**. Connected with modern **Gemini 3.5 Flash** models via secure server side proxying.
          </div>
        </aside>
      </main>

      {/* Transcript Log Dialog Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl flex flex-col h-[520px] shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4.5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">Conversation Transcripts</h3>
              </div>
              <button 
                onClick={() => setSelectedChat(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal message list */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 flex flex-col gap-3">
              {selectedChat.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`max-w-[85%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.role === "model" 
                      ? "bg-white text-slate-800 self-flex-start border border-slate-100 rounded-bl-none shadow-xs" 
                      : "bg-slate-900 text-white self-flex-end rounded-br-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                  <span className={`text-[9px] block mt-1 text-right ${msg.role === "model" ? "text-slate-400" : "text-white/60"}`}>
                    {msg.timestamp || "Active Session"}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedChat(null)}
                className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
