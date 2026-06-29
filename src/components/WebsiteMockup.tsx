import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Award, BookOpen, Users, CheckCircle2, MessageSquare, Phone, 
  MapPin, Sparkles, Laptop, ChevronRight, Send, Briefcase, 
  GraduationCap, Store, Shield, RefreshCw 
} from "lucide-react";
import { Message, ExtractedLead, WidgetConfig } from "../types";

interface WebsiteMockupProps {
  widgetConfig: WidgetConfig;
  onLeadCaptured: (lead: ExtractedLead, chatHistory: Message[]) => void;
  activeTestPrompt: string | null;
  clearActiveTestPrompt: () => void;
}

export default function WebsiteMockup({ 
  widgetConfig, 
  onLeadCaptured, 
  activeTestPrompt, 
  clearActiveTestPrompt 
}: WebsiteMockupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "model",
      text: widgetConfig.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if config updates
  useEffect(() => {
    setMessages(prev => {
      const filtered = prev.filter(m => m.id !== "initial");
      return [
        {
          id: "initial",
          role: "model",
          text: widgetConfig.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...filtered
      ];
    });
  }, [widgetConfig.welcomeMessage]);

  // Handle active test prompt triggered from the Admin sidebar
  useEffect(() => {
    if (activeTestPrompt) {
      setIsOpen(true);
      sendMessage(activeTestPrompt);
      clearActiveTestPrompt();
    }
  }, [activeTestPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })) 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to call API");
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: data.reply || "I'm here to guide you. Please ask any questions about NIHT courses!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If lead data is extracted, notify parent app so it records it!
      if (data.extractedLead && (data.extractedLead.name || data.extractedLead.email || data.extractedLead.background || data.extractedLead.interestedCourse)) {
        onLeadCaptured(data.extractedLead, [...updatedMessages, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "I am having trouble connecting to my brain server right now. Feel free to explore our courses at nihtdigitalmarketing.com or try again in a bit!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleInquireClick = (courseName: string) => {
    setIsOpen(true);
    sendMessage(`I'd like to learn more about the ${courseName}.`);
  };

  const courses = [
    {
      title: "Master Program in Digital Marketing + Gen AI + Agentic AI",
      badge: "Flagship Course",
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      desc: "Advanced training in SEO, PPC/Google Ads, Social Media, plus cutting-edge AI agents, chatbots, and marketing automation.",
      duration: "6 Months",
      benefits: "Paid Internships & Live Campaigns"
    },
    {
      title: "Certificate Program in Digital Marketing",
      badge: "Beginner-Friendly",
      icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
      desc: "Perfect for students after 12th, beginners, and career switchers. Core SEO, ad campaigns, and content strategy with zero coding.",
      duration: "3-4 Months",
      benefits: "100% Placement Support"
    },
    {
      title: "E-commerce & Dropshipping Training",
      badge: "Specialized",
      icon: <Store className="w-5 h-5 text-emerald-500" />,
      desc: "Master selling online. Learn marketplace management (including Amazon & Shopify), running ads, and establishing dropshipping setups.",
      duration: "2 Months",
      benefits: "Build your own store"
    },
    {
      title: "Web Development Course",
      badge: "Practical Skills",
      icon: <Laptop className="w-5 h-5 text-purple-500" />,
      desc: "Practical website building skills tailored to create landing pages, custom online storefronts, and optimized lead portals.",
      duration: "3 Months",
      benefits: "Hands-on coding portfolio"
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> Kolkata, India (Online Nationwide)</span>
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> +91-98302-NIHT</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>Founded 2005</span>
          <span>•</span>
          <span>Trained 20,000+ Students</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-white text-xl tracking-tight">
            N
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">NIHT</span>
            <span className="text-xs block text-slate-500 font-medium -mt-1">Infosolution Pvt. Ltd.</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-600">
          <a href="#" className="text-slate-950 font-semibold border-b-2 border-slate-950 pb-1">Home</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Courses</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Placements</a>
          <a href="#" className="hover:text-slate-950 transition-colors">About Us</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Contact</a>
        </div>
        <button 
          onClick={() => { setIsOpen(true); }}
          className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Book Free Counselling
        </button>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 px-6 md:px-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Kolkata's Award-Winning Institute Since 2005
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Become a Certified Expert in <br />
          <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">Digital Marketing + Agentic AI</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Learn from agency professionals who manage live campaigns. Build websites, set up dropshipping, and command SEO, Meta Ads, and generative AI systems with 100% placement support.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => handleInquireClick("Master Program")}
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            Explore Flagship Program <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setIsOpen(true); }}
            className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-sm font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            Talk to Niya Assistant
          </button>
        </div>

        {/* Dynamic highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/60 pt-12 text-left max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">20,000+</h4>
              <p className="text-xs text-slate-500">Students Trained</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">100%</h4>
              <p className="text-xs text-slate-500">Placement Support</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Paid</h4>
              <p className="text-xs text-slate-500">Internship Options</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">In-house</h4>
              <p className="text-xs text-slate-500">Media & Reel Studio</p>
            </div>
          </div>
        </div>
      </header>

      {/* Courses Section */}
      <section className="bg-slate-100/60 py-16 px-6 md:px-12 border-y border-slate-200/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Career-Oriented Programs</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
              Select a specialized module or go all-in with our comprehensive master certificate program. Learn from campaigns, not slides.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all group">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {course.icon}
                    </div>
                    <span className="text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {course.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mt-4 leading-snug group-hover:text-slate-950">{course.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{course.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <div>Duration: <span className="font-semibold text-slate-800">{course.duration}</span></div>
                    <div>Key perk: <span className="font-semibold text-slate-800">{course.benefits}</span></div>
                  </div>
                  <button 
                    onClick={() => handleInquireClick(course.title)}
                    className="bg-slate-50 hover:bg-slate-150 text-slate-900 hover:text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg border border-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Quick Inquire <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/60 flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
            <div className="flex gap-4">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-md">Global Certifications Included</h4>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  Earn credentials valued worldwide: Google Search & Video Ads, Google Analytics, Facebook/Meta Marketing Science, Semrush SEO, HubSpot Inbound, and more.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleInquireClick("Global Certifications")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Learn about Certifications
            </button>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Why Study with NIHT?</span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              An institute founded by trainers, backed by a real brand agency.
            </h3>
            <p className="mt-4 text-slate-500 text-sm leading-relaxed">
              NIHT is led by founder Angshuman Sett, a certified Google AdWords expert with 15+ years of digital marketing authority. Instead of learning generic concepts from old slides, you get access to active, live campaign ad panels and our dedicated, in-house multimedia studio to practice making high-converting reels, video ads, podcasts, and product demos.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "100% placement support with local & national tie-ups",
                "Paid live campaign internship options with top campaigns",
                "Personal career coach & optimized resume builder guidance",
                "Flexible classroom (offline Kolkata) or interactive online modes"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
              <Sparkles className="w-64 h-64" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-500 text-white px-2.5 py-1 rounded-full">
              STUDENT CORNER
            </span>
            <h4 className="text-xl font-bold mt-4">Simulate a quick chat with Niya to explore options</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Niya is our friendly AI business expert. You can use the widget on the bottom right to tell her about your background (like being a student after 12th, or a business owner looking for leads) and she will tailor-make a training roadmap for you.
            </p>
            <div className="mt-6 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <h5 className="font-bold text-slate-200 text-xs">Quick Test Phrases to try:</h5>
              <div className="mt-3 flex flex-col gap-2">
                <button 
                  onClick={() => { setIsOpen(true); sendMessage("Which course is best for me? I just finished my 12th class."); }}
                  className="bg-slate-800/80 hover:bg-slate-800 hover:text-white text-slate-300 text-[11px] py-1.5 px-3 rounded-lg text-left transition-all border border-slate-700/50 cursor-pointer"
                >
                  "Which course is best after 12th?"
                </button>
                <button 
                  onClick={() => { setIsOpen(true); sendMessage("I own a local business. Can you teach me how to run Google Ads to get leads?"); }}
                  className="bg-slate-800/80 hover:bg-slate-800 hover:text-white text-slate-300 text-[11px] py-1.5 px-3 rounded-lg text-left transition-all border border-slate-700/50 cursor-pointer"
                >
                  "I own a business. Can I learn Google Ads?"
                </button>
                <button 
                  onClick={() => { setIsOpen(true); sendMessage("Do you guarantee placement? Tell me about internships."); }}
                  className="bg-slate-800/80 hover:bg-slate-800 hover:text-white text-slate-300 text-[11px] py-1.5 px-3 rounded-lg text-left transition-all border border-slate-700/50 cursor-pointer"
                >
                  "Tell me about placements and internships."
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING CHAT WIDGET INTERACTIVE COMPONENT */}
      <div 
        className="fixed z-50 transition-all duration-300"
        style={{
          bottom: "24px",
          right: widgetConfig.position === "right" ? "24px" : "auto",
          left: widgetConfig.position === "left" ? "24px" : "auto",
        }}
      >
        {/* Launcher Button */}
        {!isOpen && (
          <button
            id="niya-launcher"
            onClick={() => setIsOpen(true)}
            style={{ backgroundColor: `#${widgetConfig.primaryColor}` }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all animate-bounce"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}

        {/* Chat window panel */}
        {isOpen && (
          <div className="w-[370px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div 
              style={{ backgroundColor: `#${widgetConfig.primaryColor}` }}
              className="p-4 text-white flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/40">
                  N
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">{widgetConfig.title}</h3>
                  <span className="text-[10px] text-white/80 mt-0.5 block flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span> Niya Assistant • Active
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white font-bold text-lg cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Conversation Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`max-w-[80%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.role === "model" 
                      ? "bg-white text-slate-800 self-flex-start border border-slate-100 rounded-bl-none shadow-xs" 
                      : "text-white self-flex-end rounded-br-none"
                  }`}
                  style={msg.role === "user" ? { backgroundColor: `#${widgetConfig.primaryColor}` } : {}}
                >
                  <div className="whitespace-pre-wrap select-text">
                    {/* Render URLs as real clickable links */}
                    {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                      if (part.match(/^https?:\/\//)) {
                        return (
                          <a 
                            key={i} 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                          >
                            nihtdigitalmarketing.com
                          </a>
                        );
                      }
                      return part;
                    })}
                  </div>
                  <span className={`text-[9px] block mt-1 text-right ${msg.role === "model" ? "text-slate-400" : "text-white/70"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="bg-white text-slate-800 self-flex-start border border-slate-100 rounded-2xl rounded-bl-none shadow-xs p-3 flex items-center gap-1.5 max-w-[100px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form area */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about digital marketing courses..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 text-slate-800 text-xs md:text-sm rounded-full px-4 py-2 border border-slate-200 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{ backgroundColor: `#${widgetConfig.primaryColor}` }}
                className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-white shrink-0 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer label */}
            <div className="text-[9px] text-center text-slate-400 bg-slate-50 py-1.5 border-t border-slate-100 flex items-center justify-center gap-1">
              <span>Powered by</span>
              <a href="https://nihtdigitalmarketing.com" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-500 hover:underline">
                NIHT Digital Marketing
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
