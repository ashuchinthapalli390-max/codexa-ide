export interface PlatformRelease {
  os: "windows" | "macos" | "linux" | "android" | "ios";
  displayName: string;
  architecture: string[];
  status: "available" | "preview" | "planned" | "coming_soon";
  version: string;
  releaseDate: string;
  fileSize?: string;
  sha256?: string;
  downloadUrl?: string;
  channel: "stable" | "preview" | "insider" | "beta";
  requiresLicense: boolean;
  minSystemReqs: string;
  instructions: string[];
}

export interface ReleaseHistoryItem {
  version: string;
  date: string;
  type: "major" | "minor" | "patch" | "preview";
  highlights: string[];
  fixes: string[];
  knownIssues?: string[];
}

export interface ReleaseManifest {
  product: string;
  agency: string;
  officialLaunchDate: string;
  latestVersion: string;
  platforms: Record<string, PlatformRelease>;
  history: ReleaseHistoryItem[];
}

export const releaseManifest: ReleaseManifest = {
  product: "CodeXa Studio IDE",
  agency: "CodeXa Agency",
  officialLaunchDate: "17 November 2026",
  latestVersion: "1.0.0-Preview",
  platforms: {
    windows: {
      os: "windows",
      displayName: "Windows",
      architecture: ["x64", "ARM64"],
      status: "preview",
      version: "1.0.0-Preview",
      releaseDate: "November 2026",
      fileSize: "84.2 MB",
      sha256: "9a75d5f2a1b9c8d3e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
      downloadUrl: "/api/releases/download?platform=windows",
      channel: "preview",
      requiresLicense: true,
      minSystemReqs: "Windows 10/11 (64-bit), 8GB RAM, 2GB free disk space",
      instructions: [
        "Download the CodeXa Studio IDE installer executable (.exe).",
        "Launch the installer and accept the CodeXa Agency EULA.",
        "Sign in using your CodeXa Agency account credentials.",
        "Enter your CXA-DESK hardware license key or request instant evaluation.",
      ],
    },
    macos: {
      os: "macos",
      displayName: "macOS",
      architecture: ["Apple Silicon (M1-M4)", "Intel x64"],
      status: "coming_soon",
      version: "1.0.0-Planned",
      releaseDate: "Target: Q1 2027",
      channel: "beta",
      requiresLicense: true,
      minSystemReqs: "macOS Monterey (12.0) or later, Apple Silicon or Intel 64-bit",
      instructions: [
        "macOS Universal Binary is currently in internal staging for notarization.",
        "Register your CodeXa Agency account to receive instant notification upon public notarization.",
      ],
    },
    linux: {
      os: "linux",
      displayName: "Linux",
      architecture: ["x64 (.deb, .AppImage)"],
      status: "coming_soon",
      version: "1.0.0-Planned",
      releaseDate: "Roadmap: 2027",
      channel: "beta",
      requiresLicense: true,
      minSystemReqs: "Ubuntu 22.04+, Debian 12+, Fedora 38+, glibc 2.34+",
      instructions: [
        "Linux distribution packages are undergoing kernel integration tests.",
      ],
    },
    android: {
      os: "android",
      displayName: "CodeXa Mobile IDE",
      architecture: ["arm64-v8a", "armeabi-v7a"],
      status: "available",
      version: "1.0.0",
      releaseDate: "October 2026",
      fileSize: "46.5 MB",
      downloadUrl: "https://codxa-agency.online/downloads/CodeXa.apk",
      channel: "stable",
      requiresLicense: false,
      minSystemReqs: "Android 8.0 (Oreo) or higher",
      instructions: [
        "Download the official CodeXa Agency APK package.",
        "Enable 'Install from Unknown Sources' in system settings if prompted.",
        "Log in with your CodeXa Agency intern, team, or client account.",
      ],
    },
    ios: {
      os: "ios",
      displayName: "iOS Mobile Companion",
      architecture: ["Universal iOS"],
      status: "planned",
      version: "1.0.0-Beta",
      releaseDate: "Planned: Q1 2027",
      channel: "beta",
      requiresLicense: false,
      minSystemReqs: "iOS 16.0 or higher",
      instructions: [
        "TestFlight invitations will open alongside official launch milestones.",
      ],
    },
  },
  history: [
    {
      version: "1.0.0-Preview",
      date: "November 2026",
      type: "preview",
      highlights: [
        "Initial developer preview of CodeXa Studio IDE engine",
        "Integrated multi-model AI assistant supporting Astra 6, Fabel 5.1, and Nexa",
        "Built-in split terminal with isolated virtual shell environment",
        "Live reactive preview engine with hot-sync visual inspection",
        "Obsidian ultra-dark design system with crimson accent tokens",
      ],
      fixes: [
        "Optimized syntax highlighter memory consumption on files > 10,000 LOC",
        "Hardened device activation key binding to prevent credential spoofing",
        "Enhanced explorer tree rendering with zero layout shift on folder expansion",
      ],
      knownIssues: [
        "macOS notarized DMG scheduled for companion publication in upcoming update cycle",
        "Remote SSH workspace connector in private beta testing",
      ],
    },
    {
      version: "0.9.4-Internal",
      date: "October 2026",
      type: "minor",
      highlights: [
        "First complete build of CodeXa Agentic Planner with diff generation",
        "Agency unified authentication bridge (Iron Session compatibility)",
        "Mobile companion app APK v1.0 released for agency engineers",
      ],
      fixes: [
        "Resolved terminal escape character rendering in dark high-contrast mode",
        "Fixed tab drag-and-drop ordering synchronization",
      ],
    },
  ],
};

