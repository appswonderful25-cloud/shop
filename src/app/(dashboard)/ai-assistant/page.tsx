"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Package,
  MessageSquare,
  Megaphone,
  Palette,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Wallet,
  Ticket,
  Loader2,
  Settings,
  Zap,
  User,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCalls?: Array<{ name: string; args: Record<string, unknown> }>;
  demo?: boolean;
}

const QUICK_ACTIONS = [
  { icon: BarChart3, label: "Store Stats", prompt: "Give me an overview of my store statistics", color: "text-blue-500" },
  { icon: Package, label: "List Products", prompt: "Show me all my products", color: "text-purple-500" },
  { icon: ShoppingCart, label: "Recent Orders", prompt: "Show me recent orders", color: "text-green-500" },
  { icon: MessageSquare, label: "Messages", prompt: "Show me recent customer messages", color: "text-orange-500" },
  { icon: Megaphone, label: "Marketing", prompt: "Help me create a marketing campaign for my store", color: "text-pink-500" },
  { icon: Palette, label: "Theme Ideas", prompt: "Suggest a beautiful theme for my store", color: "text-indigo-500" },
  { icon: DollarSign, label: "Pricing", prompt: "Analyze my pricing and suggest improvements", color: "text-emerald-500" },
  { icon: Wallet, label: "Wallet", prompt: "Show me my wallet balance and recent payouts", color: "text-cyan-500" },
  { icon: Sparkles, label: "Build Store", prompt: "Build me a complete store! I want it called \"My Store\" with a luxury theme and general type", color: "text-amber-500" },
];

interface Earning {
  id: number;
  action: string;
  description: string;
  impact: string;
  estimatedValue: number;
  actualValue: number;
  createdAt: string;
}

const TOOL_ICONS: Record<string, typeof Package> = {
  get_store_stats: BarChart3,
  list_products: Package,
  create_product: Package,
  list_orders: ShoppingCart,
  reply_to_message: MessageSquare,
  list_messages: MessageSquare,
  generate_marketing: Megaphone,
  suggest_theme: Palette,
  adjust_pricing: DollarSign,
  list_returns: BarChart3,
  get_wallet_info: Wallet,
  create_coupon: Ticket,
};

const TOOL_LABELS: Record<string, string> = {
  get_store_stats: "Fetching store stats",
  list_products: "Listing products",
  create_product: "Creating product",
  list_orders: "Listing orders",
  reply_to_message: "Sending reply",
  list_messages: "Listing messages",
  generate_marketing: "Generating marketing",
  suggest_theme: "Suggesting theme",
  adjust_pricing: "Analyzing pricing",
  list_returns: "Listing returns",
  get_wallet_info: "Fetching wallet",
  create_coupon: "Creating coupon",
  build_my_store: "Building store",
  update_store_colors: "Updating colors",
  apply_theme: "Applying theme",
  get_store_settings: "Fetching settings",
  update_store_info: "Updating settings",
  toggle_maintenance: "Toggling maintenance",
};

function renderContent(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 underline decoration-violet-300 dark:decoration-violet-600 hover:text-violet-800 dark:hover:text-violet-300 font-medium">
          {part.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [showSettings, setShowSettings] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const savedModel = localStorage.getItem("ai_model") || "gpt-4o";
    setModel(savedModel);
  }, []);

  const fetchEarnings = useCallback(async () => {
    setEarningsLoading(true);
    try {
      const res = await fetch("/api/proxy/ai-earnings?sort=createdAt:desc&pagination[pageSize]=50");
      if (res.ok) {
        const data = await res.json();
        setEarnings(data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setEarningsLoading(false);
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("ai_model", model);
    setShowSettings(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error || "Something went wrong"}`, timestamp: new Date() },
        ]);
        return;
      }

      const toolCalls = (data.toolCalls || []).map((tc: Record<string, unknown>) => ({
        name: (tc.function as Record<string, unknown>)?.name as string,
        args: JSON.parse(((tc.function as Record<string, unknown>)?.arguments as string) || "{}"),
      }));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
          demo: data.demo || false,
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}`, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
      setActiveTool(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Suspense fallback={
      <div className="w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-violet-500" />
      </div>
    }>
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Assistant
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                DEMO
              </span>
            </h1>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              Your intelligent store manager
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={() => {
              setShowEarnings(!showEarnings);
              if (!showEarnings) fetchEarnings();
            }}
            className={`p-2 rounded-lg transition-colors ${showEarnings ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"}`}
            title="AI Earnings"
          >
            <DollarSign size={18} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="AI Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            AI Model Selection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-zinc-400 mb-1 block">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
              </select>
            </div>
            <div className="flex items-end">
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                API key is managed by admin in Store Settings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveSettings}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              Save Settings
            </button>
            <Link
              href="/settings/ai"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-violet-600 transition-colors"
            >
              Advanced Settings →
            </Link>
          </div>
        </div>
      )}

      {/* Earnings Panel */}
      {showEarnings && (
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-500" />
              AI Earnings Tracker
            </h3>
            <button
              onClick={fetchEarnings}
              className="text-xs text-violet-600 hover:text-violet-700"
            >
              Refresh
            </button>
          </div>
          {earningsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          ) : earnings.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-4">
              No AI actions tracked yet. Start using the AI assistant to track earnings.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {earnings.slice(0, 10).map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${earning.impact === "positive" ? "bg-emerald-500" : earning.impact === "negative" ? "bg-red-500" : "bg-slate-400"}`} />
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">{earning.description}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">{new Date(earning.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    +${earning.estimatedValue.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Total Estimated Earnings</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                ${earnings.reduce((sum, e) => sum + (e.estimatedValue || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
              <Bot size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome to ShopShop AI
              </h2>
              <p className="text-sm text-slate-400 dark:text-zinc-500 max-w-md">
                Your intelligent store assistant. Ask me anything about your store,
                or use quick actions below to get started.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 max-w-md">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                Demo Mode Active — All tools are real and work! No OpenAI key needed. Configure one in AI Settings for smarter responses.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all group"
                >
                  <action.icon size={20} className={`${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => sendMessage("Build me a complete store! Tell me your store name, type (fashion/electronics/food/beauty), and preferred style (aurora/luxury/mint/neonCyber/forest).")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25"
            >
              <Sparkles size={18} />
              Build My Store in One Click
            </button>
            {!apiKey && (
              <div className="text-xs text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-900 rounded-lg px-4 py-2">
                API key is managed by admin. Contact your store administrator if AI is not working.
              </div>
            )}
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-md"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-bl-md"
              }`}
            >
              {/* Tool Calls */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mb-2 space-y-1">
                  {msg.toolCalls.map((tc, i) => {
                    const Icon = TOOL_ICONS[tc.name] || Zap;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                      >
                        <Icon size={12} />
                        <span>{TOOL_LABELS[tc.name] || tc.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {renderContent(msg.content)}
              </div>
              <div className={`text-[10px] mt-1 ${msg.role === "user" ? "text-violet-200" : "text-slate-400 dark:text-zinc-500"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-slate-600 dark:text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-100 dark:bg-zinc-800 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                <Loader2 size={14} className="animate-spin" />
                <span>{activeTool ? TOOL_LABELS[activeTool] || "Thinking..." : "Thinking..."}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Bar (when messages exist) */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_ACTIONS.slice(0, 4).map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 rounded-full hover:border-violet-300 hover:text-violet-600 transition-colors whitespace-nowrap"
            >
              <action.icon size={12} />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={apiKey ? "Ask me anything about your store..." : "Configure API key first..."}
              rows={1}
              className="w-full px-4 py-3 pr-12 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line · Powered by OpenAI
        </p>
      </div>
    </div>
    </Suspense>
  );
}
