import { useRef, useState, useEffect } from 'react';
import {
  Search, User, ArrowRight, ChevronLeft, ChevronRight, X,
  Globe, Mail, Plus, Edit, Trash2, LogOut,
  Lock, LayoutDashboard, Loader2, RefreshCw, CheckCircle, AlertTriangle
} from "lucide-react";

// Standard Inline Instagram SVG component (Lucide design compatible)
const Instagram = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const API_BASE = "http://127.0.0.1:8000/api";

export default function Home() {
  const scrollRef = useRef(null);
  const [activeCard, setActiveCard] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [provinces, setProvinces] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || "");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("admin@test.com");
  const [authPassword, setAuthPassword] = useState("password");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Dashboard State
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashTab, setDashTab] = useState("provinces"); // provinces, daerahs, organizations
  const [dashProvinces, setDashProvinces] = useState([]);
  const [dashDaerahs, setDashDaerahs] = useState([]);
  const [dashOrgs, setDashOrgs] = useState([]);
  const [isLoadingDashData, setIsLoadingDashData] = useState(false);

  // CRUD Modal Form State
  const [showCrudForm, setShowCrudForm] = useState(false);
  const [crudAction, setCrudAction] = useState("create"); // create, edit
  const [crudTargetId, setCrudTargetId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmittingCrud, setIsSubmittingCrud] = useState(false);

  // Form Fields
  const [provForm, setProvForm] = useState({ name: "", image: "" });
  const [daerahForm, setDaerahForm] = useState({ province_id: "", name: "", image: "", website: "", instagram: "", email: "" });
  const [orgForm, setOrgForm] = useState({ name: "", region: "", description: "", logo: "", website: "", instagram: "", email: "", status: "active", province_id: "", daerah_id: "" });

  // Initial Provinces Fetch
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const res = await fetch(`${API_BASE}/provinces`);
      const json = await res.json();
      if (json.success) {
        setProvinces(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoadingDashData(true);
    try {
      const headers = { "Accept": "application/json" };

      // Fetch Provinces
      const resP = await fetch(`${API_BASE}/provinces`, { headers });
      const jsonP = await resP.json();
      if (jsonP.success) setDashProvinces(jsonP.data);

      // Fetch Daerahs
      const resD = await fetch(`${API_BASE}/daerahs`, { headers });
      const jsonD = await resD.json();
      if (jsonD.success) setDashDaerahs(jsonD.data);

      // Fetch Organizations (paginate fallback to load all or first page)
      const resO = await fetch(`${API_BASE}/organizations`, { headers });
      const jsonO = await resO.json();
      if (jsonO.success) setDashOrgs(jsonO.data.data || jsonO.data);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setIsLoadingDashData(false);
    }
  };

  useEffect(() => {
    if (showDashboard) {
      fetchDashboardData();
    }
  }, [showDashboard]);

  // Handle Scroll to switch active indicators
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = 320 + 16; // card width + gap
      const index = Math.round(scrollPosition / cardWidth) + 1;
      if (index >= 1 && index <= filteredProvinces.length) {
        setActiveCard(index);
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -336, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 336, behavior: 'smooth' });
    }
  };

  // Open Province Details Modal
  const handleViewProvinceDetails = async (slug) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`${API_BASE}/provinces/${slug}`);
      const json = await res.json();
      if (json.success) {
        setSelectedProvince(json.data);
      }
    } catch (err) {
      console.error("Failed to load province detail", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Authentication: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const json = await res.json();
      if (json.success) {
        const loggedUser = json.data.user;
        const loggedToken = json.data.token;

        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('token', loggedToken);

        setUser(loggedUser);
        setToken(loggedToken);
        setShowAuthModal(false);
        setAuthPassword("");
      } else {
        setAuthError(json.message || "Invalid credentials");
      }
    } catch (err) {
      setAuthError("Failed to connect to backend server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Authentication: Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken("");
      setShowDashboard(false);
    }
  };

  // CRUD Trigger: Open Creation/Edit forms
  const openCreateForm = (tab) => {
    setCrudAction("create");
    setCrudTargetId(null);
    setValidationErrors({});

    if (tab === "provinces") {
      setProvForm({ name: "", image: "" });
    } else if (tab === "daerahs") {
      setDaerahForm({ province_id: dashProvinces[0]?.id || "", name: "", image: "", website: "", instagram: "", email: "" });
    } else if (tab === "organizations") {
      setOrgForm({
        name: "", region: "", description: "", logo: "", website: "", instagram: "", email: "",
        status: "active", province_id: dashProvinces[0]?.id || "", daerah_id: dashDaerahs[0]?.id || ""
      });
    }
    setShowCrudForm(true);
  };

  const openEditForm = (tab, item) => {
    setCrudAction("edit");
    setCrudTargetId(item.id);
    setValidationErrors({});

    if (tab === "provinces") {
      setProvForm({ name: item.name, image: item.image || "" });
    } else if (tab === "daerahs") {
      setDaerahForm({
        province_id: item.province_id,
        name: item.name,
        image: item.image || "",
        website: item.website || "",
        instagram: item.instagram || "",
        email: item.email || ""
      });
    } else if (tab === "organizations") {
      setOrgForm({
        name: item.name,
        region: item.region,
        description: item.description || "",
        logo: item.logo || "",
        website: item.website || "",
        instagram: item.instagram || "",
        email: item.email || "",
        status: item.status || "active",
        province_id: item.province_id || "",
        daerah_id: item.daerah_id || ""
      });
    }
    setShowCrudForm(true);
  };

  // CRUD Execution: Save (Create/Update)
  const handleSaveCrud = async (e) => {
    e.preventDefault();
    setIsSubmittingCrud(true);
    setValidationErrors({});

    let url = "";
    let method = "";
    let bodyData = {};

    if (dashTab === "provinces") {
      url = crudAction === "create" ? `${API_BASE}/provinces` : `${API_BASE}/provinces/${crudTargetId}`;
      method = crudAction === "create" ? "POST" : "PUT";
      bodyData = provForm;
    } else if (dashTab === "daerahs") {
      url = crudAction === "create" ? `${API_BASE}/daerahs` : `${API_BASE}/daerahs/${crudTargetId}`;
      method = crudAction === "create" ? "POST" : "PUT";
      bodyData = daerahForm;
    } else if (dashTab === "organizations") {
      url = crudAction === "create" ? `${API_BASE}/organizations` : `${API_BASE}/organizations/${crudTargetId}`;
      method = crudAction === "create" ? "POST" : "PUT";
      bodyData = orgForm;
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      const json = await res.json();
      if (json.success) {
        setShowCrudForm(false);
        fetchDashboardData();
        fetchProvinces(); // Refresh landing cards too
      } else {
        if (json.errors) {
          setValidationErrors(json.errors);
        } else {
          alert(json.message || "Failed to perform operation");
        }
      }
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmittingCrud(false);
    }
  };

  // CRUD Execution: Delete
  const handleDeleteCrud = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    let url = `${API_BASE}/${dashTab}/${id}`;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchDashboardData();
        fetchProvinces(); // Refresh landing cards too
      } else {
        alert(json.message || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to connect for deletion.");
    }
  };

  // Filter provinces by search
  const filteredProvinces = provinces.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#050816] relative overflow-hidden text-white font-sans">
      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:22px_22px] pointer-events-none" />

      {/* BLUE GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,132,255,0.18),transparent_60%)] pointer-events-none" />

      {/* MAP */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Indonesia_location_map.svg"
          alt="Indonesia"
          className="w-[90%] max-w-6xl object-contain"
        />
      </div>

      {/* WRAPPER */}
      <div className="relative min-h-screen p-3 lg:p-5">
        {/* CONTAINER */}
        <div
          className="
            relative
            min-h-[calc(100vh-24px)]
            lg:min-h-[calc(100vh-40px)]
            rounded-[28px]
            border
            border-white/10
            bg-[#04101f]/80
            backdrop-blur-xl
            overflow-hidden
            shadow-[0_0_80px_rgba(0,80,255,0.12)]
            flex
            flex-col
          "
        >
          {/* HEADER */}
          <header className="flex items-center justify-between px-6 lg:px-8 py-6 shrink-0 z-20 border-b border-white/5 bg-[#04101f]/40 backdrop-blur-md">
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                <div className="w-4 h-4 rounded-full border-2 border-black relative">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2" />
                  <div className="absolute left-1/2 top-0 w-[2px] h-full bg-black -translate-x-1/2" />
                </div>
              </div>

              <h1 className="text-xl lg:text-2xl font-black tracking-widest uppercase m-0 text-white">
                BZN PORTAL
              </h1>
            </div>

            {/* SEARCH HERO */}
            <div className="relative max-w-xs w-full hidden md:block">
              <input
                type="text"
                placeholder="Search Province..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 pl-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-all"
              />
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 text-white/80">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-white">{user.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-yellow-400">{user.role}</span>
                  </div>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setShowDashboard(true)}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                    >
                      <LayoutDashboard size={14} />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-white transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-400/50 text-xs font-bold flex items-center gap-2 transition"
                >
                  <User size={14} className="text-yellow-400" />
                  Console Access
                </button>
              )}
            </div>
          </header>

          {/* HERO & CONTENT */}
          <section className="relative z-10 px-6 lg:px-10 xl:px-14 pt-10 lg:pt-14 pb-10 flex-1 flex items-center">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-center w-full">

              {/* LEFT */}
              <div className="max-w-[620px]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-[2px] bg-yellow-400" />
                  <span className="text-[11px] tracking-[0.25em] text-yellow-400 uppercase font-bold">
                    Baznas Nasional Monitoring
                  </span>
                </div>

                <h2
                  className="
                    text-5xl
                    sm:text-6xl
                    xl:text-[76px]
                    font-black
                    leading-[0.9]
                    tracking-tighter
                    uppercase
                    mb-8
                    text-white
                  "
                >
                  System
                  <br />
                  Centraliz
                  <br />
                  Control
                  <br />
                  National
                </h2>

                <p className="mt-6 text-sm lg:text-base text-white/50 leading-relaxed max-w-[520px]">
                  Real-time centralized control interface for national zakat reporting. Eagerly-mapped datasets across provincial systems to maximize local accountability and support direct embed socials.
                </p>

                {/* BUTTON */}
                <div className="mt-10 flex items-center gap-4">
                  <button className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                    <RefreshCw size={24} className="animate-spin-slow" />
                  </button>

                  <button
                    onClick={() => user?.role === 'admin' ? setShowDashboard(true) : setShowAuthModal(true)}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-full
                      bg-[#0047FF]
                      hover:bg-[#003BCC]
                      transition-all
                      px-8
                      py-4
                      flex
                      items-center
                      gap-3
                      shadow-[0_0_30px_rgba(0,71,255,0.45)]
                    "
                  >
                    <span className="text-sm font-bold tracking-wider uppercase whitespace-nowrap">
                      {user?.role === 'admin' ? 'Open Dashboard Console' : 'Access Main Console'}
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* RIGHT: PROVINCES SLIDER */}
              <div className="relative w-full min-w-0 flex flex-col justify-center h-full">

                {/* SEARCH FOR MOBILE */}
                <div className="relative w-full mb-4 md:hidden">
                  <input
                    type="text"
                    placeholder="Search Province..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-4 pl-10 text-xs text-white"
                  />
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                </div>

                {/* SLIDER TOP */}
                <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
                  <div>
                    <p className="text-[11px] tracking-[0.25em] uppercase text-yellow-400 font-bold">
                      National Explorer
                    </p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <h3 className="text-3xl lg:text-4xl font-black uppercase text-white">
                        Indonesian Provinces
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-[#0047FF] text-[10px] font-bold tracking-widest shadow-[0_0_15px_rgba(0,71,255,0.5)] uppercase">
                        {filteredProvinces.length} Active Records
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] hidden xl:block">
                    Scroll horizontally to explore
                  </p>
                </div>

                {/* CARDS DISPLAY */}
                {isLoadingProvinces ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="w-[300px] h-[320px] rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse shrink-0 flex flex-col justify-end p-6">
                        <div className="w-16 h-2 bg-white/10 rounded mb-3" />
                        <div className="w-32 h-6 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredProvinces.length === 0 ? (
                  <div className="w-full h-[320px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 text-xs gap-3">
                    <AlertTriangle size={32} className="text-yellow-400/50" />
                    No Provinces found matching your search.
                  </div>
                ) : (
                  <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredProvinces.map((province, index) => {
                      const id = index + 1;
                      return (
                        <div
                          key={province.id}
                          onClick={() => handleViewProvinceDetails(province.slug)}
                          className={`
                            group
                            relative
                            w-[280px]
                            lg:w-[300px]
                            xl:w-[320px]
                            h-[300px]
                            lg:h-[320px]
                            rounded-2xl
                            overflow-hidden
                            snap-center
                            shrink-0
                            cursor-pointer
                            transition-all
                            duration-500
                            border
                            ${id === activeCard
                              ? 'border-yellow-400 bg-gradient-to-br from-[#1a2e22]/50 to-[#0a1611]/80 shadow-[0_0_30px_rgba(250,204,21,0.15)]'
                              : 'border-white/10 bg-gradient-to-br from-[#1c2430]/80 to-[#0f151f]/80 opacity-70 hover:opacity-100'}
                          `}
                        >
                          {/* IMAGE BACKGROUND */}
                          {province.image ? (
                            <img
                              src={province.image}
                              alt={province.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                              <svg className="w-full h-full object-cover scale-150 translate-x-10 -translate-y-10 text-white/50" viewBox="0 0 100 100" fill="currentColor">
                                <path d="M20,50 Q40,20 60,40 T90,30 Q80,60 50,70 T20,50 Z" />
                              </svg>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                          {/* ACTIVE HIGHLIGHT */}
                          {id === activeCard && (
                            <div className="absolute inset-0 border border-yellow-400/50 rounded-2xl border-dashed m-1 pointer-events-none" />
                          )}

                          {/* CONTENT */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            <p className={`text-[9px] uppercase tracking-[0.25em] font-black ${id === activeCard ? 'text-yellow-400' : 'text-gray-400'}`}>
                              {province.slug}
                            </p>

                            <h4 className="mt-1 text-2xl font-black uppercase leading-tight tracking-wide text-white">
                              {province.name}
                            </h4>

                            <div className="mt-3 flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] text-white/80 font-bold uppercase">
                                {province.organizations_count || 0} Organizations
                              </span>
                            </div>

                            <button className="mt-4 flex items-center gap-2 text-xs text-white/50 group-hover:text-yellow-400 transition uppercase tracking-widest font-bold">
                              Explore Region
                              <ArrowRight
                                size={14}
                                className="group-hover:translate-x-1 transition-transform"
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* BOTTOM SLIDER NAV */}
                {filteredProvinces.length > 0 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition bg-white/5 backdrop-blur-sm">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition bg-white/5 backdrop-blur-sm">
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-4xl font-black text-yellow-400 italic">
                        {String(activeCard).padStart(2, '0')}
                      </span>
                      <div className="w-16 h-[2px] bg-yellow-400" />
                      <div className="w-32 h-[2px] bg-white/20 relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
                          style={{ width: `${(activeCard / filteredProvinces.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* GLOWS */}
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0047FF]/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute -left-32 bottom-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
        </div>
      </div>

      {/* 1. PROVINCE DETAIL EXPLORER MODAL */}
      {selectedProvince && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-4xl max-h-[85vh] rounded-[24px] border border-white/10 bg-[#04101f] shadow-[0_0_80px_rgba(0,132,255,0.15)] flex flex-col overflow-hidden animate-zoomIn">

            {/* Header Banner */}
            <div className="relative h-44 shrink-0 bg-gradient-to-r from-blue-900 to-indigo-950 overflow-hidden flex items-end p-6">
              {selectedProvince.image && (
                <img
                  src={selectedProvince.image}
                  alt={selectedProvince.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] to-transparent" />
              <button
                onClick={() => setSelectedProvince(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white transition z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">PROVINCE REGION</span>
                <h3 className="text-3xl font-black uppercase text-white mt-1 m-0">{selectedProvince.name}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

              {/* Daerahs (Districts) Section */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-yellow-400 font-black mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                  Regional Districts ({selectedProvince.daerahs?.length || 0} Daerah)
                </h4>
                {(!selectedProvince.daerahs || selectedProvince.daerahs.length === 0) ? (
                  <div className="text-center py-6 text-white/30 border border-dashed border-white/5 rounded-xl text-xs">
                    No districts registered under this province.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProvince.daerahs.map((daerah) => (
                      <div key={daerah.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col justify-between gap-4 hover:border-blue-500/30 transition-all">
                        <div>
                          <h5 className="text-sm font-bold text-white uppercase">{daerah.name}</h5>
                          <p className="text-[10px] text-white/35 font-mono mt-0.5">{daerah.slug}</p>
                        </div>
                        {/* Embed Social links */}
                        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                          {daerah.website ? (
                            <a href={daerah.website} target="_blank" rel="noreferrer" title="Website" className="p-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 transition">
                              <Globe size={14} />
                            </a>
                          ) : (
                            <span className="p-1.5 rounded-full bg-white/5 text-white/10" title="No Website"><Globe size={14} /></span>
                          )}
                          {daerah.instagram ? (
                            <a href={`https://instagram.com/${daerah.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" title="Instagram" className="p-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/30 text-pink-400 transition">
                              <Instagram size={14} />
                            </a>
                          ) : (
                            <span className="p-1.5 rounded-full bg-white/5 text-white/10" title="No Instagram"><Instagram size={14} /></span>
                          )}
                          {daerah.email ? (
                            <a href={`mailto:${daerah.email}`} title="Email" className="p-1.5 rounded-full bg-green-500/10 hover:bg-green-500/30 text-green-400 transition">
                              <Mail size={14} />
                            </a>
                          ) : (
                            <span className="p-1.5 rounded-full bg-white/5 text-white/10" title="No Email"><Mail size={14} /></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Organizations Section */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-yellow-400 font-black mb-4">
                  Organizations Active ({selectedProvince.organizations?.length || 0})
                </h4>
                {(!selectedProvince.organizations || selectedProvince.organizations.length === 0) ? (
                  <div className="text-center py-6 text-white/30 border border-dashed border-white/5 rounded-xl text-xs">
                    No active organizations in this province yet.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProvince.organizations.map((org) => (
                      <div key={org.id} className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.01] to-white/[0.03] flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-bold text-white">{org.name}</h5>
                          <span className="text-[9px] uppercase tracking-wider text-white/40">{org.region}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${org.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {org.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. AUTHENTICATION (LOGIN) OVERLAY */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#041224] p-6 shadow-[0_0_60px_rgba(250,204,21,0.15)] relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)] mb-3">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">Central Security Login</h3>
              <p className="text-xs text-white/50 mt-1 max-w-[280px]">Access Admin CRUD management and provincial data directories.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold">Email Address</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  placeholder="admin@test.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase text-xs tracking-wider transition shadow-[0_0_20px_rgba(250,204,21,0.3)] mt-2 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying Identity...
                  </>
                ) : (
                  "Authenticate Secure Token"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. FULL SCREEN ADMIN DASHBOARD MODAL */}
      {showDashboard && (
        <div className="fixed inset-0 z-40 bg-[#020710] flex flex-col text-white overflow-hidden animate-fadeIn">
          {/* Top Bar */}
          <div className="h-16 border-b border-white/10 bg-[#04101f]/80 backdrop-blur px-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} className="text-yellow-400" />
              <h3 className="text-md font-bold uppercase tracking-wider">National Control Console</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-2.5 py-1 rounded bg-[#0047FF]/20 text-blue-400 font-bold border border-blue-500/20 uppercase tracking-widest text-[9px]">
                Active Session: Super Admin
              </span>
              <button
                onClick={() => { setShowDashboard(false); setShowCrudForm(false); }}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-white/5 bg-[#030914] px-6 py-3 gap-3">
            {[
              { id: "provinces", label: "Manage Provinces" },
              { id: "daerahs", label: "Manage Daerahs" },
              { id: "organizations", label: "Manage Organizations" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setDashTab(tab.id); setShowCrudForm(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${dashTab === tab.id ? 'bg-[#0047FF] text-white shadow-[0_0_15px_rgba(0,71,255,0.4)]' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Body split-pane */}
          <div className="flex-1 flex overflow-hidden">

            {/* Left Pane: Table */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-yellow-400 font-black">
                  Database Directory: {dashTab}
                </h4>

                <button
                  onClick={() => openCreateForm(dashTab)}
                  className="px-3.5 py-2 rounded-lg bg-[#0047FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(0,71,255,0.3)] uppercase tracking-wider"
                >
                  <Plus size={14} />
                  Add New
                </button>
              </div>

              {isLoadingDashData ? (
                <div className="h-[40vh] flex flex-col items-center justify-center text-white/30 text-xs gap-3">
                  <Loader2 size={36} className="animate-spin text-yellow-400" />
                  Retrieving real-time data directories...
                </div>
              ) : (
                <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/[0.03] border-b border-white/5 text-white/50 uppercase font-black tracking-wider text-[10px]">
                        <th className="p-4">ID</th>
                        <th className="p-4">Name</th>
                        {dashTab === "provinces" && <th className="p-4">Slug</th>}
                        {dashTab === "daerahs" && <th className="p-4">Parent Province</th>}
                        {dashTab === "daerahs" && <th className="p-4">Social Embed Links</th>}
                        {dashTab === "organizations" && <th className="p-4">Region</th>}
                        {dashTab === "organizations" && <th className="p-4">Status</th>}
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashTab === "provinces" && dashProvinces.map((prov) => (
                        <tr key={prov.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                          <td className="p-4 font-mono text-white/40">{prov.id}</td>
                          <td className="p-4 font-bold text-white uppercase">{prov.name}</td>
                          <td className="p-4 text-white/50">{prov.slug}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => openEditForm("provinces", prov)} className="p-1.5 rounded bg-white/5 hover:bg-yellow-400 hover:text-black transition" title="Edit"><Edit size={12} /></button>
                            <button onClick={() => handleDeleteCrud(prov.id)} className="p-1.5 rounded bg-white/5 hover:bg-red-500 hover:text-white transition" title="Delete"><Trash2 size={12} /></button>
                          </td>
                        </tr>
                      ))}

                      {dashTab === "daerahs" && dashDaerahs.map((daerah) => (
                        <tr key={daerah.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                          <td className="p-4 font-mono text-white/40">{daerah.id}</td>
                          <td className="p-4 font-bold text-white uppercase">{daerah.name}</td>
                          <td className="p-4 text-yellow-400/80 font-bold uppercase">{daerah.province?.name || daerah.province_id}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {daerah.website && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-bold">WEB</span>}
                              {daerah.instagram && <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[8px] font-bold">IG</span>}
                              {daerah.email && <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[8px] font-bold">MAIL</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => openEditForm("daerahs", daerah)} className="p-1.5 rounded bg-white/5 hover:bg-yellow-400 hover:text-black transition" title="Edit"><Edit size={12} /></button>
                            <button onClick={() => handleDeleteCrud(daerah.id)} className="p-1.5 rounded bg-white/5 hover:bg-red-500 hover:text-white transition" title="Delete"><Trash2 size={12} /></button>
                          </td>
                        </tr>
                      ))}

                      {dashTab === "organizations" && dashOrgs.map((org) => (
                        <tr key={org.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                          <td className="p-4 font-mono text-white/40">{org.id}</td>
                          <td className="p-4 font-bold text-white">{org.name}</td>
                          <td className="p-4 text-white/50">{org.region}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${org.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {org.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => openEditForm("organizations", org)} className="p-1.5 rounded bg-white/5 hover:bg-yellow-400 hover:text-black transition" title="Edit"><Edit size={12} /></button>
                            <button onClick={() => handleDeleteCrud(org.id)} className="p-1.5 rounded bg-white/5 hover:bg-red-500 hover:text-white transition" title="Delete"><Trash2 size={12} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Pane: Slide-over form editor */}
            {showCrudForm && (
              <div className="w-[380px] border-l border-white/10 bg-[#040e1b] overflow-y-auto p-6 animate-slideIn">
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-yellow-400">
                    {crudAction === "create" ? "Add New Record" : "Edit Record"}
                  </h4>
                  <button onClick={() => setShowCrudForm(false)} className="p-1 rounded hover:bg-white/5 text-white/50 transition">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSaveCrud} className="space-y-4 text-xs">

                  {/* PROVINCE FORM FIELDS */}
                  {dashTab === "provinces" && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Province Name</label>
                        <input
                          type="text"
                          required
                          value={provForm.name}
                          onChange={(e) => setProvForm({ ...provForm, name: e.target.value })}
                          placeholder="Jawa Timur"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                        {validationErrors.name && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.name[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Image URL</label>
                        <input
                          type="text"
                          value={provForm.image}
                          onChange={(e) => setProvForm({ ...provForm, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                    </>
                  )}

                  {/* DAERAH FORM FIELDS */}
                  {dashTab === "daerahs" && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Parent Province</label>
                        <select
                          value={daerahForm.province_id}
                          onChange={(e) => setDaerahForm({ ...daerahForm, province_id: e.target.value })}
                          className="w-full bg-[#040e1b] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        >
                          {dashProvinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        {validationErrors.province_id && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.province_id[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Daerah / District Name</label>
                        <input
                          type="text"
                          required
                          value={daerahForm.name}
                          onChange={(e) => setDaerahForm({ ...daerahForm, name: e.target.value })}
                          placeholder="Kota Depok"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                        {validationErrors.name && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.name[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Image URL</label>
                        <input
                          type="text"
                          value={daerahForm.image}
                          onChange={(e) => setDaerahForm({ ...daerahForm, image: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Website Link</label>
                        <input
                          type="url"
                          value={daerahForm.website}
                          onChange={(e) => setDaerahForm({ ...daerahForm, website: e.target.value })}
                          placeholder="https://depok.baznas.go.id"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                        {validationErrors.website && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.website[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Instagram Embed Link</label>
                        <input
                          type="text"
                          value={daerahForm.instagram}
                          onChange={(e) => setDaerahForm({ ...daerahForm, instagram: e.target.value })}
                          placeholder="@baznas_kotadepok"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Email Link</label>
                        <input
                          type="email"
                          value={daerahForm.email}
                          onChange={(e) => setDaerahForm({ ...daerahForm, email: e.target.value })}
                          placeholder="baznas.depok@baznas.go.id"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                        {validationErrors.email && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.email[0]}</p>}
                      </div>
                    </>
                  )}

                  {/* ORGANIZATIONS FORM FIELDS */}
                  {dashTab === "organizations" && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Organization Name</label>
                        <input
                          type="text"
                          required
                          value={orgForm.name}
                          onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                          placeholder="BAZNAS Kota Depok"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                        {validationErrors.name && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.name[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Region Location</label>
                        <input
                          type="text"
                          required
                          value={orgForm.region}
                          onChange={(e) => setOrgForm({ ...orgForm, region: e.target.value })}
                          placeholder="Depok"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                        {validationErrors.region && <p className="text-red-400 mt-1 text-[10px]">{validationErrors.region[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Parent Province</label>
                        <select
                          value={orgForm.province_id}
                          onChange={(e) => setOrgForm({ ...orgForm, province_id: e.target.value })}
                          className="w-full bg-[#040e1b] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        >
                          <option value="">None</option>
                          {dashProvinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Parent Daerah (District)</label>
                        <select
                          value={orgForm.daerah_id}
                          onChange={(e) => setOrgForm({ ...orgForm, daerah_id: e.target.value })}
                          className="w-full bg-[#040e1b] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        >
                          <option value="">None</option>
                          {dashDaerahs.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Status</label>
                        <select
                          value={orgForm.status}
                          onChange={(e) => setOrgForm({ ...orgForm, status: e.target.value })}
                          className="w-full bg-[#040e1b] border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Logo URL</label>
                        <input
                          type="text"
                          value={orgForm.logo}
                          onChange={(e) => setOrgForm({ ...orgForm, logo: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-white/50 font-bold mb-1.5">Description</label>
                        <textarea
                          value={orgForm.description}
                          onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                          placeholder="Tell us about this organization branch..."
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-400 transition"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingCrud}
                    className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase text-xs tracking-wider transition shadow-[0_0_15px_rgba(250,204,21,0.2)] mt-4 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingCrud ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      "Commit Database Save"
                    )}
                  </button>

                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}