export const footerNav = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
} as const;

export const social = [
  { label: "X", href: "https://x.com/biomathcore", icon: "twitter" },
  { label: "GitHub", href: "https://github.com/biomathcore", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/biomathcore", icon: "linkedin" },
] as const;

export const brand = {
  name: "BioMath Core",
  tagline: "Numerical intelligence for life sciences",
  copyrightFrom: 2024,
};
