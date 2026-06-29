export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface ExtractedLead {
  name: string | null;
  email: string | null;
  phone: string | null;
  background: "student" | "professional" | "business_owner" | "other" | null;
  interestedCourse: string | null;
  notes: string | null;
}

export interface LeadRecord {
  id: string;
  extracted: ExtractedLead;
  createdAt: string;
  lastMessage: string;
  conversation: Message[];
  status: "new" | "contacted" | "enrolled";
}

export interface WidgetConfig {
  primaryColor: string;
  title: string;
  welcomeMessage: string;
  position: "left" | "right";
}
