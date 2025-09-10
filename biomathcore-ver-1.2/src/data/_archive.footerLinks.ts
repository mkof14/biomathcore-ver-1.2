// src/data/footerLinks.ts
// Footer link groups: top pages, service categories, company, legal.

export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterSection = { title: string; links: FooterLink[] };

/** Top pages (mirrors header + FAQ) */
const topPages: FooterSection = {
  title: "Top Pages",
  links: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "AI Chat", href: "/ai-chat" },
    { label: "AI Health Assistant", href: "/ai-health-assistant" },
    { label: "Member", href: "/member-zone/dashboard" },
    { label: "FAQ", href: "/faq" },
    { label: "Investors", href: "/investors" },
    { label: "Contact", href: "/contact" },
  ],
};

/** All service categories (20) */
const serviceCategories: FooterSection = {
  title: "Service Categories",
  links: [
    { label: "Critical Health", href: "/categories/critical-health" },
    { label: "Everyday Wellness", href: "/categories/everyday-wellness" },
    {
      label: "Longevity Longevity & Anti-Aging & Anti-Aging Anti-Aging",
      href: "/categories/longevity-anti-aging",
    },
    { label: "Mental Wellness", href: "/categories/mental-wellness" },
    { label: "Fitness & Performance", href: "/categories/fitness-performance" },
    { label: "Women’s Health", href: "/categories/womens-health" },
    { label: "Men’s Health", href: "/categories/mens-health" },
    { label: "Beauty Beauty & Skincare & Skincare Skincare", href: "/categories/beauty-skincare" },
    { label: "Nutrition Nutrition & Diet & Diet Diet", href: "/categories/nutrition-diet" },
    { label: "Sleep Sleep & Recovery & Recovery Recovery", href: "/categories/sleep-recovery" },
    { label: "Environmental Health", href: "/categories/environmental-health" },
    { label: "Family Health", href: "/categories/family-health" },
    {
      label: "Preventive Medicine & Longevity",
      href: "/categories/preventive-medicine-longevity",
    },
    {
      label: "Biohacking & Performance",
      href: "/categories/biohacking-performance",
    },
    { label: "Senior Care", href: "/categories/senior-care" },
    { label: "Eye-Health Suite", href: "/categories/eye-health-suite" },
    {
      label: "Digital Therapeutics Store",
      href: "/categories/digital-therapeutics-store",
    },
    {
      label: "General Sexual Longevity & Anti-Aging",
      href: "/categories/general-sexual-longevity",
    },
    { label: "Men's General Sexual Longevity & Anti-Aging", href: "/categories/mens-sexual-health" },
    {
      label: "Women's General Sexual Longevity & Anti-Aging",
      href: "/categories/womens-sexual-health",
    },
  ],
};

/** Company */
const company: FooterSection = {
  title: "Company",
  links: [
    { label: "News", href: "/news" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/corporate#careers" },
    { label: "Refer a Friend", href: "/refer" },
    { label: "Investors", href: "/investors" },
    { label: "Contact", href: "/contact" },
  ],
};

/** Legal */
const legal: FooterSection = {
  title: "Legal",
  links: [
    { label: "Privacy Policy", href: "/legal#privacy" },
    { label: "Terms of Service", href: "/legal#terms" },
    { label: "HIPAA Notice", href: "/legal#hipaa" },
    { label: "Security", href: "/legal#security" },
    { label: "Disclaimer", href: "/legal#disclaimer" },
  ],
};

export const footerSections: FooterSection[] = [
  topPages,
  serviceCategories,
  company,
  legal,
];
