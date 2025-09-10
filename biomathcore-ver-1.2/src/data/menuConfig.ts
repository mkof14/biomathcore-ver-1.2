// src/data/menuConfig.ts
// Centralized, typed menu configuration for BioMath Core (top navigation).

export type MenuItem = {
  label: string;
  href?: string;
  external?: boolean;
  children?: MenuItem[];
};

export type MenuConfig = {
  primary: MenuItem[]; // top-level desktop menu
  memberActions: MenuItem[]; // right-side actions (desktop)
  mobile: MenuItem[]; // full mobile structure
};

// TOP NAV: essentials only
const primary: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  {
    label: "AI",
    href: "/ai-chat",
    children: [
      { label: "AI Chat", href: "/ai-chat" },
      { label: "AI Health Assistant", href: "/ai-health-assistant" },
    ],
  },
  {
    label: "Member",
    href: "/member-zone/dashboard",
    children: [
      { label: "Dashboard", href: "/member-zone/dashboard" },
      { label: "My Reports", href: "/member-zone/my-reports" },
      { label: "Account Settings", href: "/member-zone/account-settings" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// Right side quick actions
const memberActions: MenuItem[] = [{ label: "Sign In / Up", href: "/sign-in" }];

const mobile: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Service Categories", href: "/categories" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "AI Chat", href: "/ai-chat" },
  { label: "AI Health Assistant", href: "/ai-health-assistant" },
  {
    label: "Member",
    children: [
      { label: "Dashboard", href: "/member-zone/dashboard" },
      { label: "Reports (Pro)", href: "/member-zone/reports-pro" },
      { label: "My Reports", href: "/member-zone/my-reports" },
      { label: "My Profile", href: "/member-zone/my-profile" },
      { label: "Connect Devices", href: "/member-zone/connect-devices" },
      { label: "Account Settings", href: "/member-zone/account-settings" },
      { label: "Health Black Box", href: "/member-zone/blackbox" },
    ],
  },
  {
    label: "Corporate",
    children: [
      { label: "News", href: "/news" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/corporate#careers" },
      { label: "Refer a Friend", href: "/refer" },
    ],
  },
  {
    label: "Legal",
    children: [
      { label: "Privacy Policy", href: "/legal#privacy" },
      { label: "Terms of Service", href: "/legal#terms" },
      { label: "HIPAA Notice", href: "/legal#hipaa" },
      { label: "Security", href: "/legal#security" },
      { label: "Disclaimer", href: "/legal#disclaimer" },
    ],
  },
  { label: "FAQ", href: "/faq" },
  { label: "Investors", href: "/investors" },
  { label: "Contact", href: "/contact" },
  { label: "Sign In / Up", href: "/sign-in" },
];

export const menuConfig: MenuConfig = { primary, memberActions, mobile };
