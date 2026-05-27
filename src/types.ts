export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  iconName: string; // Will match lucide key
  timeline: string;
  pricingEstimate: string;
  nigerianSectors: string[];
  automationPower: string;
}

export interface CaseStudyItem {
  id: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  impactMetric: string;
  metricLabel: string;
  beforeState: string;
  afterState: string;
}

export interface PricingCalculatorOption {
  webType: "none" | "landing" | "business" | "school_church_portal";
  aiFeatures: string[]; // "whatsapp_bot", "customer_care", "sms_alerts", "auto_billing", "ai_training"
  maintenanceScope: "self" | "basic" | "premium";
  skillClass: "none" | "individual" | "corporate_training";
}

export interface AuditItem {
  id: string;
  component: string;
  brutalTruth: string;
  impactScore: "CRITICAL" | "HIGH" | "MEDIUM";
  redesignSolution: string;
  seoImplication: string;
}

export interface CompetitorItem {
  name: string;
  styleInspiration: string;
  rating: string;
  coreAdvantage: string;
  localAdaptation: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "Technical" | "Billing" | "General";
}
