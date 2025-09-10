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
  company,
  legal,
];
