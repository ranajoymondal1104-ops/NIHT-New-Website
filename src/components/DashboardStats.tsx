import { useState } from "react";
import { 
  Users, UserCheck, GraduationCap, Briefcase, Store, CheckSquare, 
  MessageSquare, Clock, Filter, Eye, Phone, Mail, FileText, ChevronRight 
} from "lucide-react";
import { LeadRecord, Message } from "../types";

interface DashboardStatsProps {
  leads: LeadRecord[];
  onUpdateLeadStatus: (leadId: string, status: "new" | "contacted" | "enrolled") => void;
  onSelectLeadChat: (conversation: Message[]) => void;
}

export default function DashboardStats({ leads, onUpdateLeadStatus, onSelectLeadChat }: DashboardStatsProps) {
  const [filter, setFilter] = useState<"all" | "student" | "professional" | "business_owner">("all");

  const filteredLeads = leads.filter(lead => {
    if (filter === "all") return true;
    return lead.extracted.background === filter;
  });

  // Calculate statistics
  const totalLeads = leads.length;
  const studentLeads = leads.filter(l => l.extracted.background === "student").length;
  const professionalLeads = leads.filter(l => l.extracted.background === "professional").length;
  const businessLeads = leads.filter(l => l.extracted.background === "business_owner").length;
  const enrolledLeads = leads.filter(l => l.status === "enrolled").length;

  const getBackgroundIcon = (bgType: string | null) => {
    switch (bgType) {
      case "student":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "professional":
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case "business_owner":
        return <Store className="w-4 h-4 text-emerald-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBackgroundLabel = (bgType: string | null) => {
    switch (bgType) {
      case "student":
        return "Student";
      case "professional":
        return "Professional";
      case "business_owner":
        return "Business Owner";
      default:
        return "Other / Unknown";
    }
  };

  const getStatusBadge = (status: "new" | "contacted" | "enrolled") => {
    switch (status) {
      case "new":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">New</span>;
      case "contacted":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Contacted</span>;
      case "enrolled":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Enrolled</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">{totalLeads}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Real-time visitor inquiry logs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Students</span>
            <GraduationCap className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">{studentLeads}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Undergrads & school switchers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Professionals</span>
            <Briefcase className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">{professionalLeads}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Working & career upgraders</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Owners</span>
            <Store className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">{businessLeads}</h3>
          <p className="text-[10px] text-slate-400 mt-1">E-commerce & local brands</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled</span>
            <UserCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2 tracking-tight">{enrolledLeads}</h3>
          <p className="text-[10px] text-emerald-400 mt-1">Active class sign-ups</p>
        </div>
      </div>

      {/* Main Leads Board Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Header and filters */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">AI Captured Leads</h3>
            <p className="text-xs text-slate-500">Structured student data extracted in the background during conversational chat.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <span className="text-slate-400 px-2 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Filter:</span>
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("student")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === "student" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Students
            </button>
            <button 
              onClick={() => setFilter("professional")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === "professional" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Professionals
            </button>
            <button 
              onClick={() => setFilter("business_owner")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${filter === "business_owner" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
            >
              Owners
            </button>
          </div>
        </div>

        {/* Lead Rows list */}
        <div className="divide-y divide-slate-100">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-800 text-sm">No leads captured in this filter yet</p>
              <p className="text-xs text-slate-500 mt-1">Start a conversation in the website preview and introduce yourself to Niya!</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 md:space-y-0 md:flex md:items-center gap-6 flex-1">
                  
                  {/* Lead main avatar / background badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/60 font-bold shrink-0">
                      {lead.extracted.name ? lead.extracted.name[0].toUpperCase() : "V"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {lead.extracted.name || "Anonymous Visitor"}
                        {getStatusBadge(lead.status)}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> Registered: {lead.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="md:border-l md:border-slate-100 md:pl-6">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Classification</span>
                    <div className="flex items-center gap-1.5 mt-1 font-semibold text-xs text-slate-700">
                      {getBackgroundIcon(lead.extracted.background)}
                      <span>{getBackgroundLabel(lead.extracted.background)}</span>
                    </div>
                  </div>

                  {/* Interested Course */}
                  <div className="md:border-l md:border-slate-100 md:pl-6 max-w-xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Interested Course</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                      {lead.extracted.interestedCourse || "Evaluating courses..."}
                    </p>
                  </div>

                  {/* Extracted Details - Email/Phone */}
                  <div className="md:border-l md:border-slate-100 md:pl-6 text-xs text-slate-600 space-y-1">
                    {lead.extracted.email && (
                      <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {lead.extracted.email}</p>
                    )}
                    {lead.extracted.phone && (
                      <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {lead.extracted.phone}</p>
                    )}
                    {!lead.extracted.email && !lead.extracted.phone && (
                      <p className="text-slate-400 italic">No contact info captured yet</p>
                    )}
                  </div>

                  {/* Summary / Notes */}
                  {lead.extracted.notes && (
                    <div className="md:border-l md:border-slate-100 md:pl-6 max-w-sm flex-1 hidden xl:block">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Gemini Context Summary</span>
                      <p className="text-xs text-slate-500 mt-1 italic leading-relaxed line-clamp-2">
                        "{lead.extracted.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Operations */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Dropdown selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                      className="text-xs font-medium bg-slate-100 hover:bg-slate-200 border-none rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                    </select>
                  </div>

                  {/* View Dialog Session */}
                  <button
                    onClick={() => onSelectLeadChat(lead.conversation)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="View Conversation Transcripts"
                  >
                    <Eye className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Transcripts</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
