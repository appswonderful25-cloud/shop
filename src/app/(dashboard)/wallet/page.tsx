"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Wallet as WalletIcon, ArrowUpRight, Plus, CreditCard, Landmark, CheckCircle2, AlertCircle, Loader2, AlertTriangle, RotateCw } from "lucide-react";
import { FaPaypal } from "react-icons/fa6";
import ConnectAccountModal from "./ConnectAccountModal";
import { API_CONFIG } from "@/lib/api-config";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingClearance, setPendingClearance] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [walletDocId, setWalletDocId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    if (linkedAccounts.length === 0) setLoading(true);
    setLoadError(null);

    try {
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}/api/wallets?populate=*`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = data.data || data || [];
      const wallet = Array.isArray(items) ? items[0] : items;

      if (wallet) {
        setWalletDocId(wallet.documentId);
        setBalance(parseFloat(wallet.currentBalance) || 0);
        setTotalEarnings(parseFloat(wallet.totalEarnings) || 0);
        setPendingClearance(parseFloat(wallet.pendingClearance) || 0);
        setTotalWithdrawn(parseFloat(wallet.totalWithdrawn) || 0);
        setTransactions(wallet.payoutHistory || []);

        const accounts = wallet.linkedAccounts || [];
        setLinkedAccounts(accounts);
        if (accounts.length > 0 && !selectedMethod) {
          setSelectedMethod(accounts[0].display);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch wallet data:", err);
      setLoadError(err?.message || "Failed to fetch wallet data.");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [linkedAccounts.length, selectedMethod]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Please enter a valid payout amount.");
      return;
    }

    if (amount > balance) {
      setErrorMessage("Insufficient funds. You cannot withdraw more than your available balance.");
      return;
    }

    const newPayout = {
      payoutId: `PAY-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().split('T')[0],
      amount: amount.toFixed(2),
      method: selectedMethod || 'Direct Payout',
      status: "success",
    };

    const updatedHistory = [newPayout, ...transactions];
    const newBalance = balance - amount;

    if (walletDocId) {
      try {
        await fetch(`${API_CONFIG.STRAPI_BASE_URL}/api/wallets/${walletDocId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { currentBalance: newBalance, payoutHistory: updatedHistory } }),
        });
      } catch (err) {
        console.error("Failed to update wallet:", err);
      }
    }

    setBalance(newBalance);
    setTransactions(updatedHistory);
    setWithdrawAmount("");
    setSuccessMessage(`Successfully processed payout of $${amount.toFixed(2)}!`);
  };

  const handleConnectAccount = async (type: string, name: string, number: string) => {
    const isPaypal = type === "PaypalAccount" || type === "PayPal";
    const display = isPaypal
      ? `PayPal (${number})`
      : type === "Visa"
        ? `Visa ending in ${number.slice(-4)}`
        : `Bank Account (••••${number.slice(-4)})`;

    const bankName = isPaypal ? "PayPal" : type === "Visa" ? "Visa Card" : "Bank Account";
    const newAccount = { id: Date.now(), type: isPaypal ? "PayPal" : type, name, display, bankName, number };
    const updatedAccounts = [...linkedAccounts, newAccount];
    setLinkedAccounts(updatedAccounts);
    setSelectedMethod(display);

    if (walletDocId) {
      try {
        await fetch(`${API_CONFIG.STRAPI_BASE_URL}/api/wallets/${walletDocId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { linkedAccounts: updatedAccounts } }),
        });
      } catch (err) {
        console.error("Failed to update wallet accounts:", err);
      }
    }
  };

  const getAccountIcon = (acc: any) => {
    if (acc.type === "PayPal" || acc.bankName?.toLowerCase().includes("paypal")) return <FaPaypal size={16} className="text-blue-600" />;
    if (acc.type === "Visa") return <CreditCard size={16} />;
    return <Landmark size={16} />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left relative" dir="ltr">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <WalletIcon className="text-indigo-600 dark:text-indigo-400" size={26} />
            Payouts & Wallet
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Monitor your available balance, link bank credentials, and request instant revenue payouts.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading wallet data...</span>
        </div>
      )}

      {!loading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
          <AlertTriangle size={20} />
          <span>{loadError}</span>
          <button onClick={fetchData} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
            <RotateCw size={13} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            <div className="md:col-span-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-zinc-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden h-56 flex flex-col justify-between border border-indigo-900/40">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-xs font-bold text-indigo-200/60 uppercase tracking-widest block">Available Balance</span>
                  <span className="text-3xl font-extrabold tracking-tight mt-1.5 block">${balance.toFixed(2)}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-xs">
                  SaaS
                </div>
              </div>
              <div className="z-10">
                <span className="text-sm font-mono tracking-widest block opacity-70">
                  {linkedAccounts.length > 0 ? `•••• •••• •••• ${linkedAccounts[0].number?.slice(-4) || '4242'}` : '•••• •••• •••• 4242'}
                </span>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs uppercase tracking-wider opacity-50">Store Wallet</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-rose-500/80" />
                    <div className="w-6 h-6 rounded-full bg-amber-500/80" />
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Payout</h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Plus size={14} /> Link Account
                </button>
              </div>

              {linkedAccounts.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {linkedAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => setSelectedMethod(acc.display)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        selectedMethod === acc.display
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-400"
                          : "border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      {getAccountIcon(acc)}
                      {acc.display}
                    </div>
                  ))}
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3.5 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold animate-fade-in">
                  <AlertCircle size={16} /> {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3.5 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fade-in">
                  <CheckCircle2 size={16} /> {successMessage}
                </div>
              )}

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Withdraw Destination</label>
                    <select
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer h-[46px]"
                    >
                      {linkedAccounts.length > 0 ? linkedAccounts.map(acc => (
                        <option key={acc.id} value={acc.display}>{acc.display}</option>
                      )) : (
                        <option value="Direct Payout">Direct Payout (no account linked)</option>
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Amount to Withdraw ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 pr-16 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white h-[46px]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount(balance.toFixed(2))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3.5 rounded-xl transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                  <ArrowUpRight size={16} /> Confirm Payout Request
                </button>
              </form>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Payout History</h3>
            </div>
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-zinc-500 py-12">
                No payout history yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {transactions?.map((tx, idx) => (
                      <tr key={tx.payoutId || idx} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                        <td className="p-4 font-bold font-mono text-slate-900 dark:text-white">{tx.payoutId}</td>
                        <td className="p-4 text-slate-500 dark:text-zinc-400">{tx.date}</td>
                        <td className="p-4 font-medium">{tx.method}</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">${tx.amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tx.status === "success" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400" : tx.status === "failed" ? "text-rose-600 bg-rose-950/20 dark:text-rose-400" : "text-amber-600 bg-amber-50 dark:text-amber-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tx.status === "success" ? "bg-emerald-500" : tx.status === "failed" ? "bg-rose-500" : "bg-amber-500"}`} />
                            {tx.status === "success" ? "Success" : tx.status === "failed" ? "Failed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ConnectAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConnect={handleConnectAccount} />
        </>
      )}

    </div>
  );
}
