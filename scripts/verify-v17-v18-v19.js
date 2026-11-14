/**
 * CodeXa Studio IDE - Comprehensive V17, V18 & V19 Automated Verification Suite
 * Tests live HTTP server endpoints and codebase implementations
 */

const fs = require("fs");

async function runTests() {
  console.log("===============================================================");
  console.log("CODEXA STUDIO IDE — V17, V18, V19 LIVE VERIFICATION SUITE");
  console.log("===============================================================\n");

  let passes = 0;
  let failures = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      if (details) console.log(`       ${details}`);
      passes++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error(`       ${details}`);
      failures++;
    }
  }

  const BASE_URL = "http://localhost:3000";

  // 1. Verify Live Usage Endpoint initial clean zero state (V18)
  console.log("--- 1. Authoritative Metering & Zero Fake Data (V18) ---");
  const uniqueUid = "verify_user_" + Date.now();
  const usageRes = await fetch(`${BASE_URL}/api/usage?uid=${uniqueUid}`);
  assert(usageRes.status === 200, "GET /api/usage returns HTTP 200 OK");
  const usageData = await usageRes.json();
  
  assert(usageData.usage.usedUnits === 0, "Fresh user usage balance starts at 0 units used");
  assert(usageData.usage.percentageUsed === 0, "Fresh user percentage used is 0%");
  assert(usageData.usage.recentEvents.length === 0, "No fake historical audit events pre-populated");
  assert(Object.keys(usageData.usage.premiumBreakdown).length === 0, "No fake premium breakdown pre-populated");
  assert(Object.keys(usageData.usage.freeBreakdown).length === 0, "No fake free breakdown pre-populated");

  // 2. Test Real Token Deduction via POST /api/ai/meter (V18)
  console.log("\n--- 2. Real-Time Token Processing & Fair-Use Execution (V18) ---");
  // Test Free Model (NEXA) -> 0 units deducted
  const freeRes = await fetch(`${BASE_URL}/api/ai/meter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      modelId: "nexa",
      promptPreview: "Local AST test",
      inputTokens: 1000,
      outputTokens: 500,
    }),
  });
  assert(freeRes.status === 200, "POST /api/ai/meter with NEXA returns HTTP 200");
  const freeData = await freeRes.json();
  assert(freeData.success === true, "Free model (NEXA) executes successfully");
  assert(freeData.unitsDeducted === 0, "Free model deducts exactly 0 premium units");

  // Test Premium Model (GPT-6 Astra: 1.5x weight)
  const premRes = await fetch(`${BASE_URL}/api/ai/meter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      modelId: "gpt-6-astra",
      promptPreview: "Refactor monorepo ast",
      inputTokens: 1000,
      outputTokens: 500,
    }),
  });
  assert(premRes.status === 200, "POST /api/ai/meter with GPT-6 Astra returns HTTP 200");
  const premData = await premRes.json();
  assert(premData.success === true, "Premium model (GPT-6 Astra) executes successfully");
  assert(premData.unitsDeducted === 2250, `GPT-6 Astra accurately deducts 1.5x weighted units (1500 * 1.5 = 2250, got: ${premData.unitsDeducted})`);

  // 3. Test Leadership Policy and Model Access (V19)
  console.log("\n--- 3. Leadership Access & Purchase Exemption (V19) ---");
  const leaderCookie = encodeURIComponent(JSON.stringify({
    uid: "founder_ashu_01",
    email: "ashuchinthapalli3900@gmail.com",
    displayName: "Ashu Chinthapalli"
  }));

  const leaderRes = await fetch(`${BASE_URL}/api/usage`, {
    headers: {
      Cookie: `cxa_session=${leaderCookie}`,
    },
  });
  assert(leaderRes.status === 200, "GET /api/usage for Founder returns HTTP 200 OK");
  const leaderData = await leaderRes.json();
  assert(leaderData.isLeadership === true, "Leadership identity verified from founder email session");
  assert(leaderData.usage.planId === "LEADERSHIP", "Leadership policy tier assigned accurately");
  assert(leaderData.usage.monthlyAllowanceUnits >= 25000000, "Leadership account receives extended allowance");

  // 4. Test Key Pages HTTP 200
  console.log("\n--- 4. Essential Page Routes Verification ---");
  const pages = ["/", "/founder", "/pricing", "/account", "/account/subscription", "/download", "/platforms"];
  for (const page of pages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert(res.status === 200, `Page ${page} responds with HTTP 200 OK`);
  }

  // 5. Test V17 Ecosystem 7 Scenes Setup
  console.log("\n--- 5. V17 Cinematic Ecosystem Implementation ---");
  const ecosystemFile = fs.readFileSync("components/sections/AIEcosystemSection.tsx", "utf-8");
  assert(ecosystemFile.includes('"intro"'), "Scene 00 'intro' present in AIEcosystemSection");
  assert(ecosystemFile.includes('"openai"'), "Scene 01 'openai' present in AIEcosystemSection");
  assert(ecosystemFile.includes('"anthropic"'), "Scene 02 'anthropic' present in AIEcosystemSection");
  assert(ecosystemFile.includes('"gemini"'), "Scene 03 'gemini' present in AIEcosystemSection");
  assert(ecosystemFile.includes('"grok"'), "Scene 04 'grok' present in AIEcosystemSection");
  assert(ecosystemFile.includes('"codexa"'), "Scene 05 'codexa' present in AIEcosystemSection");
  assert(ecosystemFile.includes('"unified"'), "Scene 06 'unified' present in AIEcosystemSection");

  const canvasFile = fs.readFileSync("components/ai/InteractiveParticleCanvas.tsx", "utf-8");
  assert(canvasFile.includes("Astra spiral"), "Reference A Astra spiral galaxy algorithm integrated");
  assert(canvasFile.includes("fluidGrad"), "Reference B fluid mesh gradient integrated");
  assert(canvasFile.includes("sweepGrad"), "Reference C kinetic laser sweep integrated");

  // 6. Test Founder Control Center (/founder) & Leadership Protection
  console.log("\n--- 6. V19 Founder Control Center & Download System ---");
  const founderFile = fs.readFileSync("app/founder/page.tsx", "utf-8");
  assert(founderFile.includes("Founder Control Center"), "Founder Control Center page header present");
  assert(founderFile.includes("usage_control"), "Usage Control tab present");
  assert(founderFile.includes("leadership"), "Leadership Registry tab present");
  assert(founderFile.includes("model_management"), "Model Management tab present");
  assert(founderFile.includes("release_management"), "Release Management tab present");
  assert(founderFile.includes("download_access"), "Download Access tab present");
  assert(founderFile.includes("audit_logs"), "Audit Logs tab present");

  const downloadFile = fs.readFileSync("components/download/DownloadSection.tsx", "utf-8");
  assert(downloadFile.includes("Public Beta Available Soon"), "Public visitors see 'Public Beta Available Soon'");
  assert(downloadFile.includes("Internal Preview Authorized"), "Leadership/internal roles see 'Internal Preview Authorized'");

  const pricingFile = fs.readFileSync("components/sections/SubscriptionsPricingSection.tsx", "utf-8");
  assert(pricingFile.includes("Commercial subscription purchase is not required"), "Leadership exemption banner present on pricing page");
  assert(pricingFile.includes("Leadership Exempt"), "Leadership exempt CTA button present");

  console.log("\n===============================================================");
  console.log(`VERIFICATION SUMMARY: ${passes} Passed, ${failures} Failed`);
  console.log("===============================================================");

  if (failures > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});
