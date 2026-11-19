/** Competitor comparison content (summarised from public vendor pages). */

export interface ComparisonItem {
  category: string;
  rows: {
    dimension: string;
    codexa: string | boolean;
    cursor: string | boolean;
    antigravity: string | boolean;
    vscode: string | boolean;
  }[];
}

export const COMPARISON_CATEGORIES: ComparisonItem[] = [
  {
    category: "A • Editor & Workspace Core",
    rows: [
      {
        dimension: "Base Desktop Architecture",
        codexa: "Local-First Desktop Core",
        cursor: "Electron VS Code Fork",
        antigravity: "Cloud Agent Workspace",
        vscode: "Open-Source Electron",
      },
      {
        dimension: "Local AST In-Memory Cache",
        codexa: "Native Sub-50ms Buffer",
        cursor: "Limited Client Cache",
        antigravity: "Cloud Indexing",
        vscode: "Via Extension LSPs",
      },
      {
        dimension: "Integrated PTY Terminal Matrix",
        codexa: true,
        cursor: true,
        antigravity: "Sandboxed Subagent CLI",
        vscode: true,
      },
      {
        dimension: "Extension Ecosystem",
        codexa: "Open VSX Registry",
        cursor: "Open VSX / Gallery",
        antigravity: "Marketplace Plugins & Skills",
        vscode: "VS Code Marketplace",
      },
      {
        dimension: "Mobile Companion Availability",
        codexa: "Android (Under Dev)",
        cursor: "Web/iOS Companion",
        antigravity: "Browser Tab Access",
        vscode: "vscode.dev (Web only)",
      },
    ],
  },
  {
    category: "B • AI Functionality & Universal Model Access",
    rows: [
      {
        dimension: "Supported Model Diversity",
        codexa: "Astra 6, Fabel, Gemini, NEXA",
        cursor: "Claude 3.5, GPT-4o",
        antigravity: "Gemini 2.5 Pro / Flash",
        vscode: "GitHub Copilot GPT",
      },
      {
        dimension: "Universal Model Access (All Paid Plans)",
        codexa: true,
        cursor: "Tier-Restricted Models",
        antigravity: "Quota Tier Restricted",
        vscode: "Copilot Add-on Dependent",
      },
      {
        dimension: "Deterministic Task Planner",
        codexa: true,
        cursor: "Agent Mode (Beta)",
        antigravity: "Native Swarm Orchestration",
        vscode: false,
      },
      {
        dimension: "Line-by-Line Syntactic AST Review",
        codexa: true,
        cursor: true,
        antigravity: "Artifact Inspection",
        vscode: "Via Extension",
      },
      {
        dimension: "Uncapped Offline Coding Model",
        codexa: "NEXA Edge (100% Air-Gap)",
        cursor: false,
        antigravity: false,
        vscode: false,
      },
    ],
  },
  {
    category: "C • Development Workflow & Runtime",
    rows: [
      {
        dimension: "Synchronized Live DOM Container",
        codexa: "Dual Mobile/Desktop Split",
        cursor: "External Browser Tab",
        antigravity: "Browser Subagent Tab",
        vscode: "Separate Simple Browser",
      },
      {
        dimension: "Visual Git Branch & Hunk Staging",
        codexa: true,
        cursor: true,
        antigravity: "Workspace Commits",
        vscode: true,
      },
      {
        dimension: "Zero-Port Local Runtime Preview",
        codexa: true,
        cursor: false,
        antigravity: "Local Port Forwarding",
        vscode: "Manual Localhost Port",
      },
    ],
  },
  {
    category: "D • Privacy, Keychains & Infrastructure",
    rows: [
      {
        dimension: "Bring-Your-Own-Key (BYOK)",
        codexa: "Encrypted OS Vault",
        cursor: "Supported with Limits",
        antigravity: "Managed Cloud Auth",
        vscode: "Via Third-Party Plugins",
      },
      {
        dimension: "Default Telemetry Policy",
        codexa: "Zero Cloud Telemetry",
        cursor: "Opt-out Privacy Mode",
        antigravity: "Google Cloud Policy",
        vscode: "Opt-out Telemetry",
      },
      {
        dimension: "Local Credential Vault Storage",
        codexa: "WinCred / Keychain / Libsecret",
        cursor: "Local Storage",
        antigravity: "Cloud Account Storage",
        vscode: "OS Keychain Support",
      },
    ],
  },
];

export const PRICING_COMPARISON_CARDS = [
  {
    product: "CodeXa Studio IDE",
    highlight: true,
    freeTier: "Pre-Beta Access & Unlimited Local NEXA",
    starterPrice: "₹328 / month (₹262.40 with CODEXA20)",
    proPrice: "₹1,716 / month (Pro)",
    billingCurrency: "INR (Direct Indian UPI & Cards)",
    aiUsageStructure: "250k - 5M weighted premium units. All models accessible across all plans.",
    notes: "Transparent Indian billing. No foreign currency transaction fees.",
  },
  {
    product: "Cursor",
    highlight: false,
    freeTier: "Free Hobby Tier (2,000 completions + 50 slow requests)",
    starterPrice: "$20 / month (~₹1,670 / mo)",
    proPrice: "$40 / month (~₹3,340 / mo Business)",
    billingCurrency: "USD (International Card)",
    aiUsageStructure: "500 fast requests/mo, then pooled queue. High-end models metered strictly.",
    notes: "Official pricing verified from cursor.com/pricing as of Nov 2026.",
  },
  {
    product: "Google Antigravity",
    highlight: false,
    freeTier: "Free Individual Preview with basic quotas",
    starterPrice: "Pay-As-You-Go / Cloud Pro",
    proPrice: "Google Cloud Organization Billing",
    billingCurrency: "USD (Google Cloud Billing)",
    aiUsageStructure: "Token quotas tied to Google Cloud project limits & Gemini API tiers.",
    notes: "Antigravity is an agent-first cloud IDE by Google DeepMind.",
  },
  {
    product: "VS Code (+ Copilot)",
    highlight: false,
    freeTier: "Free Open-Source Core Editor",
    starterPrice: "$10 / month (Copilot Individual)",
    proPrice: "$19 / user / month (Copilot Business)",
    billingCurrency: "USD (Microsoft Billing)",
    aiUsageStructure: "Unlimited chat completions with OpenAI models, separate enterprise limits.",
    notes: "VS Code is completely free; Copilot is an optional subscription add-on.",
  },
];
