export interface DocArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
  };
  tableOfContents: { id: string; label: string }[];
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
    codeBlock?: {
      language: string;
      code: string;
    };
  }[];
}

export const DOC_ARTICLES: Record<string, DocArticle> = {
  "ast-indexing-architecture": {
    slug: "ast-indexing-architecture",
    title: "Optimizing Local AST Indexing for 500k+ Monorepos",
    category: "COMPILER BENCHMARKS",
    readTime: "4 min read",
    date: "10 Nov 2026",
    excerpt:
      "A technical deep dive into in-memory abstract syntax tree generation, memory layout optimizations, and local caching strategies in CodeXa Studio.",
    author: {
      name: "CodeXa Compiler Team",
      role: "Platform Architecture",
    },
    tableOfContents: [
      { id: "memory-layout", label: "In-Memory Tree Representation" },
      { id: "incremental-watcher", label: "Incremental File Watching" },
      { id: "benchmarks", label: "Empirical Latency Benchmarks" },
    ],
    sections: [
      {
        id: "memory-layout",
        heading: "In-Memory Tree Representation",
        paragraphs: [
          "Traditional language servers serialize AST nodes into JSON-RPC packets across IPC boundaries. In monorepos spanning hundreds of thousands of lines of TypeScript and Rust, this introduces noticeable cursor latency.",
          "CodeXa Studio stores the symbol index in a flat continuous memory buffer using pointer arrays. Node coordinates, references, and type signatures remain in memory without round-trip serialization.",
        ],
        codeBlock: {
          language: "typescript",
          code: `// CodeXa Flat Buffer AST Allocation
interface ASTBufferHeader {
  magic: 0x435841; // 'CXA'
  symbolCount: number;
  byteLength: number;
}

export function lookupSymbolFast(buffer: ArrayBuffer, hash: number): number {
  const view = new DataView(buffer);
  let low = 0, high = view.getUint32(4, true) - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    const midHash = view.getUint32(16 + mid * 16, true);
    if (midHash === hash) return view.getUint32(20 + mid * 16, true);
    if (midHash < hash) low = mid + 1; else high = mid - 1;
  }
  return -1;
}`,
        },
      },
      {
        id: "incremental-watcher",
        heading: "Incremental File Watching",
        paragraphs: [
          "When a file changes on disk, only the affected sub-tree is reparsed. Invariant hashing ensures downstream symbol references are retained without re-indexing the entire workspace directory.",
          "The watcher operates through native operating system APIs: ReadDirectoryChangesW on Windows, FSEvents on macOS, and inotify on Linux.",
        ],
      },
      {
        id: "benchmarks",
        heading: "Empirical Latency Benchmarks",
        paragraphs: [
          "Under stress testing on a 500,000-line TypeScript repository, average rename propagation completed in under 24 milliseconds, maintaining full 120 FPS editor render frames.",
        ],
      },
    ],
  },
  "zero-telemetry-byok": {
    slug: "zero-telemetry-byok",
    title: "Zero-Telemetry Development: The Architecture of Local Keychains",
    category: "SECURITY & KEYCHAIN",
    readTime: "6 min read",
    date: "04 Nov 2026",
    excerpt:
      "How CodeXa stores personal provider API keys strictly inside on-device cryptographic keychains without external proxy transit.",
    author: {
      name: "CodeXa Security Engineering",
      role: "Cryptographic Systems",
    },
    tableOfContents: [
      { id: "keychain-model", label: "Local Keychain Architecture" },
      { id: "direct-dispatch", label: "Direct Client-to-Provider Transit" },
      { id: "zero-telemetry", label: "Air-Gapped Telemetry Policy" },
    ],
    sections: [
      {
        id: "keychain-model",
        heading: "Local Keychain Architecture",
        paragraphs: [
          "Most cloud-based AI coding tools route developer tokens through proprietary intermediaries for tracking, rate limiting, and analytics. For enterprise teams and privacy-conscious engineers, this represents an unacceptable compliance vulnerability.",
          "CodeXa Studio utilizes the operating system's native cryptographic vault: Windows Credential Manager, macOS Keychain Services, and Linux Secret Service API (via libsecret). Keys never touch CodeXa Agency servers.",
        ],
        codeBlock: {
          language: "typescript",
          code: `// Direct Hardware Keychain Read
import { getSecret } from "@codexa/keychain";

export async function getProviderClient(provider: "anthropic" | "openai" | "google") {
  const secretKey = await getSecret({
    service: "codexa-studio-ide",
    account: \`byok-\${provider}\`,
  });

  return new DirectProviderClient({
    apiKey: secretKey,
    directEndpoint: true, // No intermediary proxy
  });
}`,
        },
      },
      {
        id: "direct-dispatch",
        heading: "Direct Client-to-Provider Transit",
        paragraphs: [
          "When you run queries in Bring-Your-Own-Key (BYOK) mode, outgoing HTTPS requests originate directly from your local network to the AI provider endpoint with TLS 1.3 encryption.",
        ],
      },
      {
        id: "zero-telemetry",
        heading: "Air-Gapped Telemetry Policy",
        paragraphs: [
          "CodeXa ships with zero telemetry by default. Crash reports and usage metrics require manual opt-in. In offline mode with the NEXA Edge model, internet access is completely unneeded.",
        ],
      },
    ],
  },
  "dual-agent-task-planner": {
    slug: "dual-agent-task-planner",
    title: "Deterministic Dual-Agent Task Decomposition & Execution",
    category: "AI ORCHESTRATION",
    readTime: "5 min read",
    date: "28 Oct 2026",
    excerpt:
      "Comparing synchronous prompt pipelines against autonomous dual-agent planner-synthesizer topologies for multi-file refactoring runs.",
    author: {
      name: "CodeXa AI Research",
      role: "Autonomous Systems",
    },
    tableOfContents: [
      { id: "dual-agent-topology", label: "The Planner-Synthesizer Split" },
      { id: "hunk-verification", label: "Atomic Hunk Verification" },
      { id: "ast-grounding", label: "AST-Grounded Prompting" },
    ],
    sections: [
      {
        id: "dual-agent-topology",
        heading: "The Planner-Synthesizer Split",
        paragraphs: [
          "Single-agent LLM systems frequently lose context when tasked with multi-file edits. CodeXa bifurcates the cognitive process into two discrete agents:",
          "1. Astra 6 Planner: Analyzes user intent against the AST dependency graph and generates a deterministic DAG (Directed Acyclic Graph) of edit operations.",
          "2. Synthesizer: Executes individual hunk rewrites in isolated memory sandboxes, passing results to Fabel 5.1 for invariant verification.",
        ],
        codeBlock: {
          language: "typescript",
          code: `// Dual-Agent Orchestration Flow
const plan = await Astra6.planTask({
  task: "Refactor auth middleware to handle JWT cookie refresh",
  astGraph: workspace.getSymbolGraph(),
});

for (const step of plan.steps) {
  const diff = await Synthesizer.generateHunk(step);
  const isValid = await Fabel5.verify({ diff, rules: workspace.lintRules });
  if (isValid) {
    workspace.stageHunk(diff);
  }
}`,
        },
      },
      {
        id: "hunk-verification",
        heading: "Atomic Hunk Verification",
        paragraphs: [
          "Before any proposed edit is shown to the developer, syntactic AST validation ensures no syntax errors or unclosed brackets exist. CodeXa rejects invalid hunks automatically without interrupting the engineer.",
        ],
      },
      {
        id: "ast-grounding",
        heading: "AST-Grounded Prompting",
        paragraphs: [
          "Rather than dumping raw text into the model context window, CodeXa extracts only the relevant type interfaces, exports, and call hierarchies, saving up to 70% of prompt token quotas.",
        ],
      },
    ],
  },
};

export function getAllArticles(): DocArticle[] {
  return Object.values(DOC_ARTICLES);
}

export function getArticleBySlug(slug: string): DocArticle | undefined {
  return DOC_ARTICLES[slug];
}