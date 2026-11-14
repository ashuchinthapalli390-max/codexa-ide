"use client";

import React, { useState, useEffect } from "react";
import { Settings, Shield, Save, Check, RefreshCw, AlertCircle } from "lucide-react";

export function AdminPricingPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [expiresAt, setExpiresAt] = useState("2026-11-17T00:00:00+05:30");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/plans");
      const json = await res.json();
      setData(json);
      if (json.campaign) {
        setDiscountPercent(json.campaign.discountPercent);
        setExpiresAt(json.campaign.expiresAt);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_CAMPAIGN",
          campaignUpdates: {
            discountPercent: Number(discountPercent),
            expiresAt,
          },
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
        fetchAdminData();
      }
    } catch {}
  };

  if (loading && !data) {
    return <div className="p-8 text-white/50 font-mono text-xs">Loading admin controls...</div>;
  }

  return (
    <div className="space-y-8 text-white font-sans">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400">
            AGENCY AUTHORIZED CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mt-1">
            Pricing &amp; Promotion Administration
          </h1>
        </div>
        <button
          onClick={fetchAdminData}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Campaign Configuration Card */}
      <form onSubmit={handleSaveCampaign} className="p-6 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-4">
        <h3 className="text-base font-orbitron font-bold text-white">
          Active Pre-Beta Campaign Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <label className="text-white/60 block mb-1">Coupon Code</label>
            <input
              type="text"
              disabled
              value={data?.campaign?.code || "CODEXA20"}
              className="w-full px-3 py-2 rounded-xl bg-[#141519] border border-white/10 text-white font-mono opacity-80"
            />
          </div>

          <div>
            <label className="text-white/60 block mb-1">Discount Percentage (%)</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#141519] border border-white/15 text-white font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-white/60 block mb-1">
              Campaign Expiry Timestamp (ISO with Timezone)
            </label>
            <input
              type="text"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141519] border border-white/15 text-white font-mono"
            />
            <p className="text-[11px] text-white/40 mt-1">
              Authoritative launch deadline used by all countdown tickers across web and IDE.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-white/50 font-mono">
            Current Redemptions: {data?.metrics?.totalRedemptions || 0} / {data?.campaign?.maxRedemptions || 5000}
          </span>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Campaign</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Redemptions Log */}
      <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-4">
        <h3 className="text-base font-orbitron font-bold text-white">
          Recent Coupon Redemptions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase">
                <th className="pb-3">User</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Billed Price</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(data?.redemptions || []).map((r: any) => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 font-mono text-white/80">{r.userEmail}</td>
                  <td className="py-2.5 font-bold text-white">{r.planId}</td>
                  <td className="py-2.5 text-emerald-400 font-mono">{r.discountPercent}% OFF</td>
                  <td className="py-2.5 font-mono text-white">₹{r.discountedPriceInr}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

