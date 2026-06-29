import { useState } from "react";
import { 
  Copy, Check, Info, Settings, Code, Layout, Palette, HelpCircle, FileText 
} from "lucide-react";
import { WidgetConfig } from "../types";

interface IntegrationPanelProps {
  config: WidgetConfig;
  onChangeConfig: (newConfig: WidgetConfig) => void;
}

export default function IntegrationPanel({ config, onChangeConfig }: IntegrationPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"customize" | "code" | "guide">("customize");

  const currentHost = window.location.origin;
  const scriptSrc = `${currentHost}/api/widget.js?primaryColor=${config.primaryColor}&title=${encodeURIComponent(config.title)}&welcome=${encodeURIComponent(config.welcomeMessage)}&position=${config.position}`;
  const embedCode = `<!-- Niya AI Chatbot Integration Code for NIHT Digital Marketing Institute -->
<script src="${scriptSrc}" defer></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = [
    { name: "Slate Black", hex: "0F172A", bg: "bg-slate-900" },
    { name: "NIHT Crimson", hex: "DC2626", bg: "bg-red-600" },
    { name: "Ocean Indigo", hex: "312E81", bg: "bg-indigo-900" },
    { name: "Emerald Mint", hex: "047857", bg: "bg-emerald-700" },
    { name: "Deep Cobalt", hex: "1E3A8A", bg: "bg-blue-900" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Panel header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">WordPress Integration Hub</h3>
          <p className="text-xs text-slate-500">Configure and embed Niya on your live WordPress site.</p>
        </div>
        <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-xs font-semibold">
          <button 
            onClick={() => setActiveTab("customize")}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${activeTab === "customize" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Palette className="w-3.5 h-3.5" /> Customize
          </button>
          <button 
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${activeTab === "code" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Code className="w-3.5 h-3.5" /> Code Snippet
          </button>
          <button 
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${activeTab === "guide" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> WP Guide
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === "customize" && (
          <div className="space-y-6">
            {/* Color section */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-400" /> Widget Accent Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {presetColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => onChangeConfig({ ...config, primaryColor: color.hex })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-medium transition-all text-left cursor-pointer ${
                      config.primaryColor === color.hex 
                        ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full shrink-0 ${color.bg}`} />
                    <span className="truncate">{color.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Custom Hex:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-28 bg-white px-2.5 py-1">
                  <span className="text-slate-400 text-xs font-mono">#</span>
                  <input 
                    type="text" 
                    value={config.primaryColor}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-fA-F0-9]/g, "").slice(0, 6);
                      onChangeConfig({ ...config, primaryColor: val });
                    }}
                    placeholder="0F172A"
                    className="w-full text-xs font-mono text-slate-800 focus:outline-hidden pl-1"
                  />
                </div>
              </div>
            </div>

            {/* Title Configuration */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Chatbot Window Title
              </label>
              <input 
                type="text"
                value={config.title}
                onChange={(e) => onChangeConfig({ ...config, title: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                placeholder="Chat with Niya"
              />
            </div>

            {/* Welcome message configuration */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Layout className="w-3.5 h-3.5 text-slate-400" /> Default Welcome Message
              </label>
              <textarea 
                value={config.welcomeMessage}
                onChange={(e) => onChangeConfig({ ...config, welcomeMessage: e.target.value })}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all shadow-2xs resize-none"
                placeholder="Hi! I'm Niya..."
              />
            </div>

            {/* Toggle position */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Layout className="w-3.5 h-3.5 text-slate-400" /> Screen Placement
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl w-48 text-xs font-semibold">
                <button
                  onClick={() => onChangeConfig({ ...config, position: "left" })}
                  className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-colors ${config.position === "left" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Bottom Left
                </button>
                <button
                  onClick={() => onChangeConfig({ ...config, position: "right" })}
                  className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-colors ${config.position === "right" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Bottom Right
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-4">
            <div className="p-4.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-800 leading-relaxed">
                <p className="font-bold mb-1">How it works:</p>
                This script dynamically loads Niya's widget as a lightweight asynchronous JS package. It handles launching, rendering, responsive styles, and connects directly back to your secure Cloud Run container backend, hiding your private Gemini credentials.
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Embed Code (Copy / Paste)</span>
                <button 
                  onClick={copyToClipboard}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 whitespace-pre shadow-inner">
                {embedCode}
              </pre>
            </div>
            <p className="text-[11px] text-slate-400">
              * Note: For local development, make sure this server is running so the script can load the widget and send messages. Once deployed, the source will automatically use your public Cloud Run URL!
            </p>
          </div>
        )}

        {activeTab === "guide" && (
          <div className="space-y-5 text-xs md:text-sm text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-md border-b border-slate-100 pb-2">WordPress Quick Setup Instructions</h4>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0">1</div>
                <div>
                  <p className="font-bold text-slate-900">Install Integration Plugin</p>
                  <p className="text-xs text-slate-500 mt-0.5">In your WordPress admin, go to **Plugins {`>`} Add New**. Search for and install the free plugin **"WPCode — Insert Headers and Footers"** (or any custom code injector).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0">2</div>
                <div>
                  <p className="font-bold text-slate-900">Access Footer Code Box</p>
                  <p className="text-xs text-slate-500 mt-0.5">Go to **Code Snippets {`>`} Header & Footer** from the left navigation sidebar in your WordPress dashboard.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0">3</div>
                <div>
                  <p className="font-bold text-slate-900">Paste Script & Save</p>
                  <p className="text-xs text-slate-500 mt-0.5">Go to the **"Code Snippet"** tab above, copy the generated code, and paste it directly into the **Footer** text box in WPCode. Click **Save Changes**.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800 shrink-0">4</div>
                <div>
                  <p className="font-bold text-slate-900">Enjoy Live Support!</p>
                  <p className="text-xs text-slate-500 mt-0.5">Refresh your WordPress website. The floating icon in your chosen accent color is now active on your pages, routing questions straight to Niya!</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Supported on WooCommerce, Elementor, Divi, Gutenberg, and standard WordPress themes.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
