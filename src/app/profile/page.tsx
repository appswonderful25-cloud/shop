'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';

interface UserData {
  id: number; username: string; email: string; fullName?: string; phoneNumber?: string;
  nationality?: string; postCode?: number; location?: string; bio?: string; image?: string;
  taxid?: string; paymentMethods?: PaymentMethod[]; addresses?: Address[];
  role?: { name: string; type: string };
}

interface PaymentMethod {
  id: string; type: 'card' | 'paypal' | 'bank';
  label: string; last4?: string; brand?: string; expiry?: string; email?: string; iban?: string;
}

interface Address {
  id: string; label: string; fullName: string; phone: string; street: string; city: string;
  state: string; zip: string; country: string; isDefault: boolean;
}

interface StoreTheme {
  globalColor: string; headerColor: string; headerTextColor: string; footerColor: string;
  cardBg: string; textColor: string; mutedText: string; border: string;
  borderRadius: string; fontDisplay: string;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'info' | 'payments' | 'addresses'>('info');
  const [theme, setTheme] = useState<StoreTheme>({
    globalColor: '#6366f1', headerColor: '#1e1b4b', headerTextColor: '#ffffff',
    footerColor: '#1e1b4b', cardBg: '#ffffff', textColor: '#111827', mutedText: '#6b7280',
    border: '#e5e7eb', borderRadius: '0.75rem', fontDisplay: 'inherit',
  });
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Edit states
  const [editInfo, setEditInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({ fullName: '', phoneNumber: '', nationality: '', postCode: '', location: '', bio: '' });
  const [showPayForm, setShowPayForm] = useState(false);
  const [payForm, setPayForm] = useState<{ type: 'card' | 'paypal' | 'bank'; label: string; last4: string; brand: string; expiry: string; email: string; iban: string }>({ type: 'card', label: '', last4: '', brand: '', expiry: '', email: '', iban: '' });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: '', fullName: '', phone: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false });

  const br = theme.borderRadius;

  // Load theme
  useEffect(() => {
    fetch(`${STRAPI}/api/store-setting/public`).then(r => r.ok ? r.json() : null).then(d => {
      if (!d) return;
      setTheme(prev => ({
        ...prev,
        globalColor: d.globalColor || prev.globalColor,
        headerColor: d.headerColor || prev.headerColor,
        headerTextColor: d.headerTextColor || prev.headerTextColor,
        footerColor: d.footerColor || prev.footerColor,
      }));
    }).catch(() => {});
  }, []);

  // Load user
  const loadUser = useCallback(() => {
    fetch('/api/auth/update-profile').then(r => r.json()).then(d => {
      if (!d.ok) { router.replace('/login'); return; }
      setUser(d.user);
      setInfoForm({
        fullName: d.user.fullName || '',
        phoneNumber: d.user.phoneNumber || '',
        nationality: d.user.nationality || '',
        postCode: d.user.postCode?.toString() || '',
        location: d.user.location || '',
        bio: d.user.bio || '',
      });
      setLoading(false);
    }).catch(() => router.replace('/login'));
  }, [router]);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (!d.token) { router.replace('/login'); return; }
      loadUser();
    }).catch(() => router.replace('/login'));
  }, [router, loadUser]);

  const flash = (type: 'ok' | 'err', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const saveInfo = async () => {
    setSaving(true);
    try {
      const body: any = {};
      if (infoForm.fullName) body.fullName = infoForm.fullName;
      if (infoForm.phoneNumber) body.phoneNumber = infoForm.phoneNumber;
      if (infoForm.nationality) body.nationality = infoForm.nationality;
      if (infoForm.postCode) body.postCode = parseInt(infoForm.postCode) || undefined;
      if (infoForm.location) body.location = infoForm.location;
      if (infoForm.bio !== undefined) body.bio = infoForm.bio;
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) { flash('err', d.error || 'Save failed'); return; }
      setUser(d.user);
      setEditInfo(false);
      flash('ok', 'Profile updated');
    } catch { flash('err', 'Network error'); }
    setSaving(false);
  };

  const addPayment = () => {
    if (!user) return;
    const pm = [...(user.paymentMethods || []), { ...payForm, id: uid() }];
    fetch('/api/auth/update-profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethods: pm }),
    }).then(r => r.json()).then(d => {
      if (d.ok) { setUser(d.user); setShowPayForm(false); setPayForm({ type: 'card', label: '', last4: '', brand: '', expiry: '', email: '', iban: '' }); flash('ok', 'Payment method added'); }
      else flash('err', d.error || 'Failed');
    }).catch(() => flash('err', 'Network error'));
  };

  const removePayment = (id: string) => {
    if (!user) return;
    const pm = (user.paymentMethods || []).filter(p => p.id !== id);
    fetch('/api/auth/update-profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethods: pm }),
    }).then(r => r.json()).then(d => { if (d.ok) { setUser(d.user); flash('ok', 'Removed'); } });
  };

  const addAddress = () => {
    if (!user) return;
    const addrs = [...(user.addresses || []), { ...addrForm, id: uid() }];
    if (addrForm.isDefault) addrs.forEach(a => { if (a.id !== addrs[addrs.length - 1].id) a.isDefault = false; });
    fetch('/api/auth/update-profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: addrs }),
    }).then(r => r.json()).then(d => {
      if (d.ok) { setUser(d.user); setShowAddrForm(false); setAddrForm({ label: '', fullName: '', phone: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false }); flash('ok', 'Address added'); }
      else flash('err', d.error || 'Failed');
    }).catch(() => flash('err', 'Network error'));
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const addrs = (user.addresses || []).filter(a => a.id !== id);
    fetch('/api/auth/update-profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: addrs }),
    }).then(r => r.json()).then(d => { if (d.ok) { setUser(d.user); flash('ok', 'Removed'); } });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const addrs = (user.addresses || []).map(a => ({ ...a, isDefault: a.id === id }));
    fetch('/api/auth/update-profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses: addrs }),
    }).then(r => r.json()).then(d => { if (d.ok) setUser(d.user); });
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    document.cookie.split(';').forEach(c => {
      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    });
    router.replace('/store');
  };

  const isStaff = ['admin', 'manager', 'support_agent'].includes(user?.role?.type || '');
  const payIcon = (t: string) => t === 'card' ? 'M2 6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 2h12M2 10h20' : t === 'paypal' ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' : 'M3 6h18M3 10h18M3 14h18M3 18h18';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.cardBg }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${theme.globalColor}30`, borderTopColor: theme.globalColor }} />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: theme.cardBg, color: theme.textColor, fontFamily: theme.fontDisplay }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: theme.headerColor, borderBottom: `1px solid ${theme.border}` }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/store" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-white text-xs rounded-lg" style={{ background: theme.globalColor }}>S</div>
            <span className="font-bold text-sm hidden sm:block" style={{ color: theme.headerTextColor }}>My Account</span>
          </Link>
          <div className="flex items-center gap-3">
            {isStaff && (
              <Link href="/overview" className="px-3 py-1.5 text-[10px] font-semibold rounded-full transition-all hover:scale-105"
                style={{ background: `${theme.globalColor}20`, color: theme.globalColor }}>
                Dashboard
              </Link>
            )}
            <Link href="/store" className="text-xs font-medium" style={{ color: `${theme.headerTextColor}80` }}>Back to Store</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {msg && (
          <div className={`mb-4 px-4 py-2.5 text-sm font-medium rounded-xl ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-2xl p-5 mb-5 flex items-center gap-4" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0" style={{ background: `${theme.globalColor}15`, color: theme.globalColor }}>
            {(user.fullName || user.username || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: theme.textColor }}>{user.fullName || user.username}</h1>
            <p className="text-xs truncate" style={{ color: theme.mutedText }}>{user.email}</p>
            {isStaff && (
              <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold uppercase rounded-full" style={{ background: `${theme.globalColor}15`, color: theme.globalColor }}>
                {user.role?.type}
              </span>
            )}
          </div>
          <button onClick={logout} className="px-3 py-1.5 text-[10px] font-medium rounded-full border transition-all hover:opacity-80" style={{ borderColor: theme.border, color: theme.mutedText }}>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: `${theme.globalColor}08` }}>
          {([['info', 'Personal Info'], ['payments', 'Payment Methods'], ['addresses', 'Addresses']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
              style={tab === k ? { background: theme.cardBg, color: theme.globalColor, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: theme.mutedText }}>
              {l}
            </button>
          ))}
        </div>

        {/* Personal Info */}
        {tab === 'info' && (
          <div className="rounded-2xl p-5" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: theme.textColor }}>Personal Information</h2>
              <button onClick={() => editInfo ? saveInfo() : setEditInfo(true)} disabled={saving}
                className="px-3 py-1.5 text-[10px] font-semibold rounded-full transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: editInfo ? theme.globalColor : 'transparent', color: editInfo ? 'white' : theme.globalColor, border: editInfo ? 'none' : `1px solid ${theme.globalColor}` }}>
                {saving ? 'Saving...' : editInfo ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                ['fullName', 'Full Name'], ['phoneNumber', 'Phone'],
                ['nationality', 'Country'], ['postCode', 'Postal Code'], ['location', 'City/Address'],
              ] as const).map(([k, label]) => (
                <div key={k}>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: theme.mutedText }}>{label}</label>
                  {editInfo ? (
                    <input value={infoForm[k] || ''} onChange={e => setInfoForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition-all focus:ring-2"
                      style={{ borderColor: theme.border, color: theme.textColor, '--tw-ring-color': `${theme.globalColor}40` } as any} />
                  ) : (
                    <p className="text-sm py-2" style={{ color: theme.textColor }}>{(user as any)[k] || '---'}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: theme.mutedText }}>Email</label>
                <p className="text-sm py-2" style={{ color: theme.textColor }}>{user.email}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: theme.mutedText }}>Bio</label>
                {editInfo ? (
                  <textarea value={infoForm.bio} onChange={e => setInfoForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none transition-all focus:ring-2"
                    style={{ borderColor: theme.border, color: theme.textColor, '--tw-ring-color': `${theme.globalColor}40` } as any} />
                ) : (
                  <p className="text-sm py-2" style={{ color: theme.textColor }}>{user.bio || '---'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {tab === 'payments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: theme.textColor }}>Payment Methods</h2>
              <button onClick={() => setShowPayForm(true)}
                className="px-3 py-1.5 text-[10px] font-semibold rounded-full transition-all hover:scale-105"
                style={{ background: theme.globalColor, color: 'white' }}>+ Add New</button>
            </div>
            {(user.paymentMethods || []).length === 0 && (
              <div className="text-center py-10 rounded-2xl" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }}>
                <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.mutedText} strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <p className="text-sm" style={{ color: theme.mutedText }}>No payment methods yet</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(user.paymentMethods || []).map(pm => (
                <div key={pm.id} className="p-4 rounded-xl relative group" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }}>
                  <button onClick={() => removePayment(pm.id)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    style={{ background: '#FEE2E2', color: '#DC2626' }}>×</button>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.globalColor}10` }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: theme.textColor }}>{pm.label || pm.type}</p>
                      <p className="text-[10px]" style={{ color: theme.mutedText }}>
                        {pm.type === 'card' && pm.last4 && `•••• ${pm.last4}${pm.brand ? ` · ${pm.brand}` : ''}${pm.expiry ? ` · ${pm.expiry}` : ''}`}
                        {pm.type === 'paypal' && pm.email}
                        {pm.type === 'bank' && pm.iban && `••••${pm.iban.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showPayForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowPayForm(false)}>
                <div className="w-full max-w-sm rounded-2xl p-5" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }} onClick={e => e.stopPropagation()}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: theme.textColor }}>Add Payment Method</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {(['card', 'paypal', 'bank'] as const).map(t => (
                        <button key={t} onClick={() => setPayForm(p => ({ ...p, type: t }))}
                          className="flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all"
                          style={payForm.type === t ? { background: theme.globalColor, color: 'white' } : { background: `${theme.globalColor}08`, color: theme.mutedText }}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <input value={payForm.label} onChange={e => setPayForm(p => ({ ...p, label: e.target.value }))} placeholder="Label (e.g. My Visa)"
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: theme.border, color: theme.textColor }} />
                    {payForm.type === 'card' && <>
                      <input value={payForm.brand} onChange={e => setPayForm(p => ({ ...p, brand: e.target.value }))} placeholder="Brand (Visa, Mastercard)"
                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: theme.border, color: theme.textColor }} />
                      <input value={payForm.last4} onChange={e => setPayForm(p => ({ ...p, last4: e.target.value }))} placeholder="Last 4 digits" maxLength={4}
                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: theme.border, color: theme.textColor }} />
                      <input value={payForm.expiry} onChange={e => setPayForm(p => ({ ...p, expiry: e.target.value }))} placeholder="Expiry (MM/YY)"
                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: theme.border, color: theme.textColor }} />
                    </>}
                    {payForm.type === 'paypal' && (
                      <input value={payForm.email} onChange={e => setPayForm(p => ({ ...p, email: e.target.value }))} placeholder="PayPal email"
                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: theme.border, color: theme.textColor }} />
                    )}
                    {payForm.type === 'bank' && (
                      <input value={payForm.iban} onChange={e => setPayForm(p => ({ ...p, iban: e.target.value }))} placeholder="IBAN / Account Number"
                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: theme.border, color: theme.textColor }} />
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowPayForm(false)} className="flex-1 py-2 text-xs font-medium rounded-lg" style={{ color: theme.mutedText }}>Cancel</button>
                    <button onClick={addPayment} className="flex-1 py-2 text-xs font-semibold text-white rounded-lg" style={{ background: theme.globalColor }}>Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Addresses */}
        {tab === 'addresses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: theme.textColor }}>Shipping Addresses</h2>
              <button onClick={() => setShowAddrForm(true)}
                className="px-3 py-1.5 text-[10px] font-semibold rounded-full transition-all hover:scale-105"
                style={{ background: theme.globalColor, color: 'white' }}>+ Add New</button>
            </div>
            {(user.addresses || []).length === 0 && (
              <div className="text-center py-10 rounded-2xl" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }}>
                <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.mutedText} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p className="text-sm" style={{ color: theme.mutedText }}>No addresses yet</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(user.addresses || []).map(addr => (
                <div key={addr.id} className="p-4 rounded-xl relative group" style={{ background: theme.cardBg, border: `1px solid ${addr.isDefault ? theme.globalColor : theme.border}`, borderRadius: br }}>
                  {addr.isDefault && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full" style={{ background: `${theme.globalColor}15`, color: theme.globalColor }}>Default</span>
                  )}
                  <button onClick={() => removeAddress(addr.id)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    style={{ background: '#FEE2E2', color: '#DC2626' }}>×</button>
                  <div className="mt-5">
                    <p className="text-xs font-semibold mb-1" style={{ color: theme.textColor }}>{addr.label || 'Address'}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: theme.mutedText }}>
                      {addr.fullName && `${addr.fullName}, `}{addr.street}<br />
                      {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}<br />
                      {addr.country}
                      {addr.phone && <><br />{addr.phone}</>}
                    </p>
                    {!addr.isDefault && (
                      <button onClick={() => setDefaultAddress(addr.id)} className="mt-2 text-[10px] font-medium underline" style={{ color: theme.globalColor }}>
                        Set as default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showAddrForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowAddrForm(false)}>
                <div className="w-full max-w-sm rounded-2xl p-5 max-h-[85vh] overflow-y-auto" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: br }} onClick={e => e.stopPropagation()}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: theme.textColor }}>Add Address</h3>
                  <div className="space-y-3">
                    {([
                      ['label', 'Label (Home, Work)'], ['fullName', 'Full Name'], ['phone', 'Phone'],
                      ['street', 'Street Address'], ['city', 'City'], ['state', 'State/Province'],
                      ['zip', 'Postal Code'], ['country', 'Country'],
                    ] as const).map(([k, ph]) => (
                      <input key={k} value={(addrForm as any)[k]} onChange={e => setAddrForm(p => ({ ...p, [k]: e.target.value }))}
                        placeholder={ph} className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                        style={{ borderColor: theme.border, color: theme.textColor }} />
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded" style={{ accentColor: theme.globalColor }} />
                      <span className="text-xs" style={{ color: theme.mutedText }}>Set as default address</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowAddrForm(false)} className="flex-1 py-2 text-xs font-medium rounded-lg" style={{ color: theme.mutedText }}>Cancel</button>
                    <button onClick={addAddress} className="flex-1 py-2 text-xs font-semibold text-white rounded-lg" style={{ background: theme.globalColor }}>Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
