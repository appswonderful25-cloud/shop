"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Key,
  Brain,
  Shield,
  DollarSign,
  Save,
  Eye,
  EyeOff,
  Zap,
  AlertTriangle,
  CheckCircle,
  Settings,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Package,
  MessageSquare,
  Megaphone,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface AISettings {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  permissions: {
    canCreateProducts: boolean;
    canReplyMessages: boolean;
    canAdjustPricing: boolean;
    canCreateCoupons: boolean;
    canGenerateMarketing: boolean;
    maxPriceChange: number;
  };
  costControl: {
    maxRequestsPerDay: number;
    maxTokensPerRequest: number;
    alertOnHighUsage: boolean;
  };
}

const DEFAULT_SETTINGS: AISettings = {
  apiKey: "",
  model: "gpt-4o",
  maxTokens: 2000,
  temperature: 0.7,
  permissions: {
    canCreateProducts: true,
    canReplyMessages: true,
    canAdjustPricing: false,
    canCreateCoupons: true,
    canGenerateMarketing: true,
    maxPriceChange: 20,
  },
  costControl: {
    maxRequestsPerDay: 100,
    maxTokensPerRequest: 2000,
    alertOnHighUsage: true,
  },
};

export default function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "permissions" | "costs">("general");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        const userRole = data?.user?.role?.name;
        setIsAdmin(userRole === "admin");
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();

    const saved = localStorage.getItem("ai_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const handleSave = async () => {
    // Save model preferences to localStorage (merchant-specific)
    localStorage.setItem("ai_settings", JSON.stringify(settings));
    localStorage.setItem("ai_model", settings.model);
    
    // Save API key and global settings to Strapi (admin only)
    try {
      const res = await fetch("/api/auth/find-store-settings");
      const existingData = await res.json();
      const existingSettings = existingData?.user?.data || existingData?.user || {};
      
      const updateRes = await fetch("/api/auth/update-store-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...existingSettings,
            aiApiKey: settings.apiKey,
            aiModel: settings.model,
            aiMaxTokens: settings.maxTokens,
            aiTemperature: settings.temperature,
          },
        }),
      });
      if (!updateRes.ok) {
        const err = await updateRes.json();
        console.error("Failed to save AI settings:", err);
      }
    } catch (err) {
      console.error("Failed to save AI settings:", err);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updatePermission = (key: keyof typeof settings.permissions, value: boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value },
    }));
  };

  const updateCostControl = (key: keyof typeof settings.costControl, value: boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      costControl: { ...prev.costControl, [key]: value },
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-violet-500" />
          <p className="text-sm text-slate-400">Checking permissions...</p>
        </div>
      )}

      {/* Access Denied */}
      {!loading && isAdmin === false && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle size={32} className="text-red-500" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-sm text-slate-400 dark:text-zinc-500 max-w-md">
              AI Settings can only be accessed by store administrators. Contact your admin to configure AI settings.
            </p>
          </div>
          <Link
            href="/overview"
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Back to Overview
          </Link>
        </div>
      )}

      {/* Admin Content */}
      {!loading && isAdmin === true && (
        <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bot className="text-violet-600 dark:text-violet-400" size={26} />
            AI Assistant Settings
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Configure your AI assistant, permissions, and cost controls
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-lg">
        {[
          { id: "general" as const, label: "General", icon: Settings },
          { id: "permissions" as const, label: "Permissions", icon: Shield },
          { id: "costs" as const, label: "Cost Control", icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-4">
          {/* API Key */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <Key size={14} className="text-amber-500" />
              API Configuration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">OpenAI API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={settings.apiKey}
                    onChange={(e) => setSettings((p) => ({ ...p, apiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">
                  Your key is stored locally in your browser. Never shared with anyone.
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">Model</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings((p) => ({ ...p, model: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="gpt-4o">GPT-4o - Best quality (~$5/1M tokens)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini - Fast & cheap (~$0.15/1M tokens)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo - High quality (~$10/1M tokens)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo - Cheapest (~$0.50/1M tokens)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Parameters */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <Brain size={14} className="text-violet-500" />
              Model Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">
                  Max Tokens: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  min={100}
                  max={4000}
                  step={100}
                  value={settings.maxTokens}
                  onChange={(e) => setSettings((p) => ({ ...p, maxTokens: Number(e.target.value) }))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>100</span>
                  <span>4000</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={settings.temperature}
                  onChange={(e) => setSettings((p) => ({ ...p, temperature: Number(e.target.value) }))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Precise (0)</span>
                  <span>Creative (1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
            <Shield size={14} className="text-emerald-500" />
            Merchant Controls
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Control what the AI assistant is allowed to do. Disable any action you don&apos;t want the AI to perform automatically.
          </p>
          <div className="space-y-3">
            {[
              { key: "canCreateProducts" as const, label: "Create Products", desc: "Allow AI to add new products to your store", icon: Package },
              { key: "canReplyMessages" as const, label: "Reply to Messages", desc: "Allow AI to respond to customer messages", icon: MessageSquare },
              { key: "canAdjustPricing" as const, label: "Adjust Pricing", desc: "Allow AI to suggest price changes (disabled by default for safety)", icon: DollarSign, safe: true },
              { key: "canCreateCoupons" as const, label: "Create Coupons", desc: "Allow AI to create discount coupons", icon: Zap },
              { key: "canGenerateMarketing" as const, label: "Generate Marketing", desc: "Allow AI to create marketing content", icon: Megaphone },
            ].map((perm) => (
              <div
                key={perm.key}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <perm.icon size={16} className="text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                      {perm.label}
                      {perm.safe && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">
                          Sensitive
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">{perm.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => updatePermission(perm.key, !settings.permissions[perm.key])}
                  className="text-slate-400"
                >
                  {settings.permissions[perm.key] ? (
                    <ToggleRight size={32} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={32} className="text-slate-300 dark:text-zinc-600" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Max Price Change */}
          <div className="mt-4 p-3 rounded-lg border border-slate-100 dark:border-zinc-800">
            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 block mb-2">
              Max Price Change Allowed: {settings.permissions.maxPriceChange}%
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={settings.permissions.maxPriceChange}
              onChange={(e) => updatePermission("maxPriceChange", Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">
              AI cannot suggest price changes greater than this percentage
            </p>
          </div>
        </div>
      )}

      {/* Cost Control Tab */}
      {activeTab === "costs" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-500" />
              Usage Limits
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">
                  Max Requests Per Day: {settings.costControl.maxRequestsPerDay}
                </label>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={settings.costControl.maxRequestsPerDay}
                  onChange={(e) => updateCostControl("maxRequestsPerDay", Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">
                  Max Tokens Per Request: {settings.costControl.maxTokensPerRequest}
                </label>
                <input
                  type="range"
                  min={100}
                  max={4000}
                  step={100}
                  value={settings.costControl.maxTokensPerRequest}
                  onChange={(e) => updateCostControl("maxTokensPerRequest", Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>100</span>
                  <span>4000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Estimator */}
          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl p-5 text-white">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <BarChart3 size={14} />
              Estimated Daily Cost
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  ${(
                    (settings.costControl.maxRequestsPerDay *
                      settings.costControl.maxTokensPerRequest *
                      (settings.model === "gpt-4o" ? 0.000005 : settings.model === "gpt-4o-mini" ? 0.00000015 : 0.0000005)
                    )
                  ).toFixed(2)}
                </div>
                <div className="text-xs text-violet-200">Per Day</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ${(
                    (settings.costControl.maxRequestsPerDay *
                      settings.costControl.maxTokensPerRequest *
                      (settings.model === "gpt-4o" ? 0.000005 : settings.model === "gpt-4o-mini" ? 0.00000015 : 0.0000005) *
                      30)
                  ).toFixed(2)}
                </div>
                <div className="text-xs text-violet-200">Per Month</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {settings.costControl.maxRequestsPerDay}
                </div>
                <div className="text-xs text-violet-200">Requests/Day</div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-zinc-300">Usage Alerts</div>
                  <div className="text-xs text-slate-400 dark:text-zinc-500">
                    Get notified when approaching daily limits
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateCostControl("alertOnHighUsage", !settings.costControl.alertOnHighUsage)}
                className="text-slate-400"
              >
                {settings.costControl.alertOnHighUsage ? (
                  <ToggleRight size={32} className="text-emerald-500" />
                ) : (
                  <ToggleLeft size={32} className="text-slate-300 dark:text-zinc-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
