"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Users2, Plus, ShieldCheck, Mail, ShieldAlert, MoreHorizontal, Trash2, Loader2, AlertTriangle, RotateCw, Pencil } from "lucide-react";
import InviteModal from "./Invite";
import EditMemberModal from "./EditMember";
import toast from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

interface TeamMember {
  id?: number;
  documentId?: string;
  memberName: string;
  memberEmail: string;
  statusAccess: "admin" | "manager" | "support_agent";
  statusMember: boolean;
  dateCreateUser: string;
}
export default function Teams() {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const liveData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    if (teamData.length === 0) {
      setLoading(true);
    }
    setLoadError(null);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.TEAMS.LIST}?populate=*`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTeamData(data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch team data:", err);
      setLoadError(err?.message || "Failed to fetch team data.");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [teamData.length]);

  useEffect(() => {
    liveData();
  }, [liveData]);

  const handleDelete = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const loadingToast = toast.loading("Deleting team member...");
    const button = e.currentTarget as HTMLElement;
    const targetRow = button.closest(`tr[data-id="${id}"]`) as HTMLElement;

    if (targetRow) {
      targetRow.style.opacity = "0.3";
      targetRow.style.pointerEvents = "none";
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.TEAMS.BY_ID(id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setTeamData(teamData.filter((t: TeamMember) => t.documentId !== id));
        toast.success("Team member deleted!", { id: loadingToast });
      } else {
        throw new Error("Failed to delete team member");
      }
    } catch (err) {
      console.error("Failed to delete team member:", err);
      toast.error("Failed to delete team member.", { id: loadingToast });
      if (targetRow) {
        targetRow.style.opacity = "1";
        targetRow.style.pointerEvents = "auto";
      }
    }
  }

  const handleAddMember = async (name: string, email: string, role: "admin" | "manager" | "support_agent") => {
    const newMember = {
      memberName: name,
      memberEmail: email,
      statusAccess: role,
      statusMember: true,
      dateCreateUser: new Date().toISOString(),
    };

    const loadingToast = toast.loading("Adding team member...");

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.TEAMS.CREATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ data: newMember }),
      });

      if (res.ok) {
        const data = await res.json();
        setTeamData([...teamData, data.data]);
        toast.success("Member added!", { id: loadingToast });
      } else {
        throw new Error("Failed to add member");
      }
    } catch (err) {
      console.error("Failed to add member:", err);
      toast.error("Failed to add member.", { id: loadingToast });
    }
  };

  const handleUpdateMember = async (documentId: string, data: { memberEmail: string; statusAccess: "admin" | "manager" | "support_agent" }) => {
    const loadingToast = toast.loading("Updating team member...");
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.TEAMS.BY_ID(documentId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ data }),
      });
      if (res.ok) {
        setTeamData((prev) =>
          prev.map((t) =>
            t.documentId === documentId ? { ...t, ...data } : t
          )
        );
        toast.success("Member updated!", { id: loadingToast });
      } else {
        throw new Error("Failed to update member");
      }
    } catch (err) {
      console.error("Failed to update member:", err);
      toast.error("Failed to update member.", { id: loadingToast });
      throw err;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative" dir="ltr">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users2 className="text-indigo-600 dark:text-indigo-400" size={26} />
            Team & Permissions
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Manage your store staff members, assign roles, and control domain access permissions.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] shrink-0 cursor-pointer">
          <Plus size={16} />
          Invite Member
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading team data...</span>
        </div>
      )}

      {!loading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-red-500 py-16">
          <AlertTriangle size={20} />
          <span>{loadError}</span>
          <button onClick={liveData} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
            <RotateCw size={13} /> Retry
          </button>
        </div>
      )}

      {!loading && !loadError && teamData.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-400 dark:text-zinc-500 py-16">
          <Users2 size={24} />
          <span>No team members found.</span>
        </div>
      )}

      {!loading && !loadError && teamData.length > 0 && (
        <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Permissions Control</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {teamData.map((member: TeamMember) => {
                  const isDropdownOpen = activeDropdownId === member.documentId;

                  return (
                    <tr key={member.documentId || member.id || member.memberEmail} data-id={member.documentId} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                            {member.memberName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white">{member.memberName}</span>
                            <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Mail size={12} />
                              {member.memberEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{member.statusAccess === "admin" ? "Admin" : member.statusAccess === "manager" ? "Manager" : "Support Agent"}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border
                          ${
                            member.statusAccess === "admin"
                              ? "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30"
                              : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                          }
                        `}>
                          {member.statusAccess === "admin" ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                          {member.statusAccess === "admin" ? "Full Access" : member.statusAccess === "manager" ? "Products & Orders" : "Tickets Only"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold  ${member.statusMember === true ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" : "text-red-500 bg-red-200 dark:bg-red-900/30 dark:text-red-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${member.statusMember === true ? "bg-emerald-500" : "bg-red-500"}`} />
                          {member.statusMember === true ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 relative">
                        <button onClick={() => setActiveDropdownId((member as TeamMember).documentId || "")} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer">
                          <MoreHorizontal size={18} />
                        </button>
                        {isDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId("")} />
                            <div className="absolute right-4 mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-slate-100 dark:border-zinc-700/50 py-1.5 z-50 animate-scale-in text-left">
                              <button onClick={() => { setEditingMember(member); setActiveDropdownId(""); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors flex items-center gap-2 cursor-pointer">
                                <Pencil size={14} />
                                Edit Member
                              </button>
                              <button onClick={(e) => { handleDelete((member as TeamMember).documentId ?? "", e); setActiveDropdownId(""); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2 cursor-pointer">
                                <Trash2 size={14} />
                                Revoke Access
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddMember={handleAddMember} />
      <EditMemberModal isOpen={!!editingMember} onClose={() => setEditingMember(null)} member={editingMember} onUpdate={handleUpdateMember} />

    </div>
  );
}
