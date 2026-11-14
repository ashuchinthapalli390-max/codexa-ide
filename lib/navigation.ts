export interface NavSubItem {
  title: string;
  desc: string;
  href: string;
  iconName: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavCategory {
  title: string;
  items: NavSubItem[];
}

export interface MegaMenuConfig {
  featured: {
    title: string;
    desc: string;
    href: string;
    ctaLabel: string;
    badge?: string;
  };
  categories: NavCategory[];
}

export interface NavItemConfig {
  label: string;
  href: string;
  isMega?: boolean;
  megaConfig?: MegaMenuConfig;
}

export interface AnnouncementConfig {
  badge: string;
  title: string;
  couponCode: string;
  discountPercent: number;
  expiryNotice: string;
  utilityLinks: {
    label: string;
    href: string;
    isExternal?: boolean;
  }[];
}

export const ANNOUNCEMENT_DATA: AnnouncementConfig = {
  badge: "PRE-BETA EXCLUSIVE",
  title: "Build Early. Save 20%",
  couponCode: "CODEXA20",
  discountPercent: 20,
  expiryNotice: "Valid until official v5 launch",
  utilityLinks: [
    { label: "Documentation", href: "/docs" },
    { label: "Release Notes", href: "/releases" },
    { label: "System Status", href: "/docs#status" },
  ],
};

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Product",
    href: "/features",
    isMega: true,
    megaConfig: {
      featured: {
        title: "CodeXa Studio Architecture",
        desc: "Deterministic AST reasoning, dual-engine code synthesis, and sub-50ms execution loop for high-throughput engineering teams.",
        href: "/features",
        ctaLabel: "Explore Architecture",
        badge: "CORE ENGINE",
      },
      categories: [
        {
          title: "IDE CAPABILITIES",
          items: [
            {
              title: "Overview",
              desc: "Complete architectural breakdown of the local-first AI development environment.",
              href: "/features",
              iconName: "Code2",
            },
            {
              title: "Features & Benchmarks",
              desc: "In-memory AST cache, sub-50ms autocomplete, and syntax verification engine.",
              href: "/features#ast",
              iconName: "Zap",
            },
            {
              title: "Developer Workspace",
              desc: "Integrated multi-pane editor, visual terminal matrix, and symbol intelligence.",
              href: "/workspace",
              iconName: "Layers",
            },
          ],
        },
        {
          title: "RUNTIME & EXECUTION",
          items: [
            {
              title: "Live Preview Workbench",
              desc: "Synchronized dual-viewport container runtime for web and native application testing.",
              href: "/workspace#preview",
              iconName: "Laptop",
            },
            {
              title: "Developer Tools & Terminal",
              desc: "GPU-accelerated terminal emulator, interactive debugger, and git graph visualization.",
              href: "/workspace#terminal",
              iconName: "Terminal",
            },
          ],
        },
      ],
    },
  },
  {
    label: "CodeXa AI",
    href: "/ai",
    isMega: true,
    megaConfig: {
      featured: {
        title: "Multi-Model AI Synthesis",
        desc: "Orchestrate GPT-6 Astra, Fabel 5.1, Gemini 3.8 Flash, and Claude alongside local zero-cloud Ollama clusters.",
        href: "/ai",
        ctaLabel: "Model Capabilities",
        badge: "AIR-GAPPED AI",
      },
      categories: [
        {
          title: "REASONING MODES",
          items: [
            {
              title: "Dual-Agent Planning",
              desc: "Real-time CodeXa Chat & Plan agents collaborating on atomic multi-file diffs.",
              href: "/ai#planning",
              iconName: "Boxes",
            },
            {
              title: "Localized Autocomplete",
              desc: "Sub-50ms in-line code predictions powered by local AST context windows.",
              href: "/ai#autocomplete",
              iconName: "Zap",
            },
          ],
        },
        {
          title: "SECURITY & METERING",
          items: [
            {
              title: "Bring Your Own Key (BYOK)",
              desc: "Provider credentials encrypted exclusively inside your local operating system keychain.",
              href: "/ai#byok",
              iconName: "Key",
            },
            {
              title: "AI Usage & Token Limits",
              desc: "Authoritative weighted token meter, monthly quota management, and audit logs.",
              href: "/workspace/usage",
              iconName: "Cpu",
            },
            {
              title: "Provider Integrations",
              desc: "OpenAI GPT-6 Astra, Claude, Gemini, Grok, and NEXA runtime architecture.",
              href: "/integrations",
              iconName: "Layers",
            },
          ],
        },
      ],
    },
  },
  {
    label: "Models",
    href: "/models",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "Compare",
    href: "/compare",
  },
  {
    label: "Reviews",
    href: "/reviews",
  },
  {
    label: "Platforms",
    href: "/#availability",
  },
  {
    label: "Resources",
    href: "/docs",
    isMega: true,
    megaConfig: {
      featured: {
        title: "Developer Knowledge Base",
        desc: "Exhaustive API documentation, security air-gap manuals, compiler benchmarks, and deployment manifests.",
        href: "/docs",
        ctaLabel: "Browse Docs",
        badge: "VERIFIED MANUALS",
      },
      categories: [
        {
          title: "DOCUMENTATION & GUIDES",
          items: [
            {
              title: "Documentation",
              desc: "Comprehensive guides for installation, keybindings, SDK extensions, and runtime configuration.",
              href: "/docs",
              iconName: "BookOpen",
            },
            {
              title: "Release Notes & Manifests",
              desc: "Cryptographic SHA-256 binary checksums and immutable changelog records.",
              href: "/releases",
              iconName: "FileCode",
            },
            {
              title: "Developer FAQ",
              desc: "Frequently asked questions regarding offline air-gap, billing, and telemetry.",
              href: "/faq",
              iconName: "Sparkles",
            },
          ],
        },
        {
          title: "SUPPORT & ECOSYSTEM",
          items: [
            {
              title: "Technical Support & SLA",
              desc: "Dedicated agency enterprise engineering SLA support and priority ticketing.",
              href: "/docs#support",
              iconName: "ShieldCheck",
            },
            {
              title: "Community Discord",
              desc: "Connect directly with fellow engineers and the core CodeXa compiler architects.",
              href: "https://discord.gg/codexa",
              iconName: "Globe",
              isExternal: true,
            },
          ],
        },
      ],
    },
  },
];

