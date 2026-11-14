export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
  children?: {
    label: string;
    href: string;
    description: string;
    badge?: string;
  }[];
}

export const siteConfig = {
  name: "CodeXa Studio IDE",
  shortName: "CodeXa Studio",
  tagline: "Code without limits. Build beyond.",
  description:
    "An AI-powered development workspace that brings your code, tools, and intelligent assistance together. Precision-engineered for modern software development.",
  url: "https://ide.codxa-agency.online",
  ogImage: "/assets/brand/codexa-logo.png",
  agencyUrl: "https://codxa-agency.online",
  agencyName: "CodeXa Agency",
  officialLaunchDate: "17 November 2026",
  launchTimestamp: "2026-11-17T00:00:00Z",
  navItems: [
    {
      label: "Product",
      href: "/workspace",
      description: "Interactive IDE Workbench",
      children: [
        {
          label: "Interactive Workspace",
          href: "/workspace",
          description: "Full in-browser studio simulator with explorer, multi-tab editor, and terminal.",
          badge: "Interactive",
        },
        {
          label: "Code to Live Preview",
          href: "/#preview",
          description: "Watch live UI compile in real-time as code writes.",
        },
        {
          label: "Theme Engine",
          href: "/#themes",
          description: "Obsidian dark, Midnight Slate, OLED, and custom palettes.",
        },
      ],
    },
    {
      label: "Features",
      href: "/features",
      description: "Full capabilities & tools",
      children: [
        {
          label: "All Features",
          href: "/features",
          description: "Architecture, local-first engine, git integration, and extensions.",
        },
        {
          label: "Local-First Security",
          href: "/features#local-first",
          description: "Zero external code telemetry unless explicitly enabled.",
        },
        {
          label: "Unified Terminal",
          href: "/features#terminal",
          description: "Multi-session terminal with integrated command synthesis.",
        },
      ],
    },
    {
      label: "AI Models",
      href: "/ai",
      badge: "Multi-Model",
      description: "Chat, Plan, Agent & Debug workflows",
    },
    {
      label: "Platforms",
      href: "/platforms",
      description: "Desktop & mobile availability",
    },
    {
      label: "Download",
      href: "/download",
      badge: "v1.0 Preview",
      description: "Installers, checksums & manifests",
    },
    {
      label: "Releases",
      href: "/releases",
      description: "Changelog and release notes",
    },
    {
      label: "Docs",
      href: "/docs",
      description: "Setup, shortcuts, and guides",
    },
    {
      label: "FAQ",
      href: "/faq",
      description: "Frequently asked questions",
    },
  ] as NavItem[],
  links: {
    agencyPortal: "https://codxa-agency.online",
    agencyApply: "https://www.codeaxisapply.xyz",
    docs: "/docs",
    releases: "/releases",
    download: "/download",
    faq: "/faq",
    privacy: "/privacy",
    terms: "/terms",
    security: "/security",
  },
};

