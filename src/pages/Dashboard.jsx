import React, { useState, useEffect } from 'react';
import { LayoutDashboard, X, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [dashTab, setDashTab] = useState("provinces"); // provinces, daerahs, organizations
  const [dashProvinces, setDashProvinces] = useState([]);
  const [dashDaerahs, setDashDaerahs] = useState([]);
  const [dashOrgs, setDashOrgs] = useState([]);
  const [isLoadingDashData, setIsLoadingDashData] = useState(false);

  const [showCrudForm, setShowCrudForm] = useState(false);
  const [crudAction, setCrudAction] = useState("create"); // create, edit
  const [crudTargetId, setCrudTargetId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmittingCrud, setIsSubmittingCrud] = useState(false);

  const [provForm, setProvForm] = useState({ name: "", image: "" });
  const [daerahForm, setDaerahForm] = useState({ province_id: "", name: "", image: "", website: "", instagram: "", email: "" });
  const [orgForm, setOrgForm] = useState({ name: "", region: "", description: "", logo: "", website: "", instagram: "", email: "", status: "active", province_id: "", daerah_id: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!savedUser || !token) {
      navigate('/'); // Redirect to home if not logged in
    } else {
      setUser(JSON.parse(savedUser));
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setIsLoadingDashData(true);
    try {
      // Fetch Provinces
      const resP = await api.get('/provinces');
      if (resP.data.success) setDashProvinces(resP.data.data);

      // Fetch Daerahs
      const resD = await api.get('/daerahs');
      if (resD.data.success) setDashDaerahs(resD.data.data);

      // Fetch Organizations
      const resO = await api.get('/organizations');
      if (resO.data.success) setDashOrgs(resO.data.data.data || resO.data.data);
    } catch (err) {
      console.error("Error loading dashboard data", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    } finally {
      setIsLoadingDashData(false);
    }
  };

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

  const handleSaveCrud = async (e) => {
    e.preventDefault();
    setIsSubmittingCrud(true);
    setValidationErrors({});

    let url = "";
    let method = "";
    let bodyData = {};

    if (dashTab === "provinces") {
      url = crudAction === "create" ? `/provinces` : `/provinces/${crudTargetId}`;
      bodyData = provForm;
    } else if (dashTab === "daerahs") {
      url = crudAction === "create" ? `/daerahs` : `/daerahs/${crudTargetId}`;
      bodyData = daerahForm;
    } else if (dashTab === "organizations") {
      url = crudAction === "create" ? `/organizations` : `/organizations/${crudTargetId}`;
      bodyData = orgForm;
    }
    
    method = crudAction === "create" ? "POST" : "PUT";

    try {
      const res = await api({
        method: method,
        url: url,
        data: bodyData
      });
      
      if (res.data.success) {
        setShowCrudForm(false);
        fetchDashboardData();
      } else {
        if (res.data.errors) {
          setValidationErrors(res.data.errors);
        } else {
          alert(res.data.message || "Failed to perform operation");
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        alert("Failed to submit request.");
      }
    } finally {
      setIsSubmittingCrud(false);
    }
  };

  const handleDeleteCrud = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await api.delete(`/${dashTab}/${id}`);
      if (res.data.success) {
        fetchDashboardData();
      } else {
        alert(res.data.message || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to connect for deletion.");
    }
  };

  if (!user) return null; // Will redirect in useEffect

  return (
    <div className="min-h-screen z-40 bg-slate-50 flex flex-col text-baznas-ink overflow-hidden animate-fadeIn">
      {/* Top Bar */}
      <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} className="text-baznas-green" />
          <h3 className="text-md font-bold uppercase tracking-wider">Konsol Kendali Nasional</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs px-2.5 py-1 rounded bg-baznas-green/10 text-baznas-green font-bold border border-baznas-green/20 uppercase tracking-widest text-[9px]">
            Sesi Aktif: {user.name || 'Super Admin'}
          </span>
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition flex items-center gap-2 px-3 text-xs uppercase font-bold"
          >
            <X size={14} /> Tutup Dasbor
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-3 gap-3 shrink-0">
        {[
          { id: "provinces", label: "Kelola Provinsi" },
          { id: "daerahs", label: "Kelola Daerah" },
          { id: "organizations", label: "Kelola Organisasi" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setDashTab(tab.id); setShowCrudForm(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${dashTab === tab.id ? 'bg-baznas-green text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
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
            <h4 className="text-xs uppercase tracking-[0.2em] text-baznas-green font-black">
              Direktori Database: {dashTab}
            </h4>

            <button
              onClick={() => openCreateForm(dashTab)}
              className="px-3.5 py-2 rounded-lg bg-baznas-green hover:bg-baznas-dark text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md uppercase tracking-wider"
            >
              <Plus size={14} />
              Tambah Baru
            </button>
          </div>

          {isLoadingDashData ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
              <Loader2 size={36} className="animate-spin text-baznas-green" />
              Mengambil direktori data real-time...
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider text-[10px]">
                    <th className="p-4">ID</th>
                    <th className="p-4">Nama</th>
                    {dashTab === "provinces" && <th className="p-4">Slug</th>}
                    {dashTab === "daerahs" && <th className="p-4">Provinsi Induk</th>}
                    {dashTab === "daerahs" && <th className="p-4">Tautan Media Sosial</th>}
                    {dashTab === "organizations" && <th className="p-4">Wilayah</th>}
                    {dashTab === "organizations" && <th className="p-4">Status</th>}
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dashTab === "provinces" && dashProvinces.map((prov) => (
                    <tr key={prov.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-mono text-slate-400">{prov.id}</td>
                      <td className="p-4 font-bold text-baznas-ink uppercase">{prov.name}</td>
                      <td className="p-4 text-slate-500">{prov.slug}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("provinces", prov)} className="p-1.5 rounded bg-slate-100 hover:bg-baznas-yellow hover:text-white transition" title="Edit"><Edit size={12} /></button>
                        <button onClick={() => handleDeleteCrud(prov.id)} className="p-1.5 rounded bg-slate-100 hover:bg-red-500 hover:text-white transition" title="Delete"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  ))}

                  {dashTab === "daerahs" && dashDaerahs.map((daerah) => (
                    <tr key={daerah.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-mono text-slate-400">{daerah.id}</td>
                      <td className="p-4 font-bold text-baznas-ink uppercase">{daerah.name}</td>
                      <td className="p-4 text-baznas-green font-bold uppercase">{daerah.province?.name || daerah.province_id}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {daerah.website && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[8px] font-bold">WEB</span>}
                          {daerah.instagram && <span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 text-[8px] font-bold">IG</span>}
                          {daerah.email && <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[8px] font-bold">MAIL</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("daerahs", daerah)} className="p-1.5 rounded bg-slate-100 hover:bg-baznas-yellow hover:text-white transition" title="Edit"><Edit size={12} /></button>
                        <button onClick={() => handleDeleteCrud(daerah.id)} className="p-1.5 rounded bg-slate-100 hover:bg-red-500 hover:text-white transition" title="Delete"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  ))}

                  {dashTab === "organizations" && dashOrgs.map((org) => (
                    <tr key={org.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-mono text-slate-400">{org.id}</td>
                      <td className="p-4 font-bold text-baznas-ink">{org.name}</td>
                      <td className="p-4 text-slate-500">{org.region}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("organizations", org)} className="p-1.5 rounded bg-slate-100 hover:bg-baznas-yellow hover:text-white transition" title="Edit"><Edit size={12} /></button>
                        <button onClick={() => handleDeleteCrud(org.id)} className="p-1.5 rounded bg-slate-100 hover:bg-red-500 hover:text-white transition" title="Delete"><Trash2 size={12} /></button>
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
          <div className="w-[380px] border-l border-slate-200 bg-white overflow-y-auto p-6 animate-slideIn shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-baznas-green">
                {crudAction === "create" ? "Tambah Data Baru" : "Edit Data"}
              </h4>
              <button onClick={() => setShowCrudForm(false)} className="p-1 rounded hover:bg-slate-100 text-slate-400 transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCrud} className="space-y-4 text-xs">

              {/* PROVINCE FORM FIELDS */}
              {dashTab === "provinces" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Nama Provinsi</label>
                    <input
                      type="text"
                      required
                      value={provForm.name}
                      onChange={(e) => setProvForm({ ...provForm, name: e.target.value })}
                      placeholder="Jawa Timur"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                    {validationErrors.name && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">URL Gambar</label>
                    <input
                      type="text"
                      value={provForm.image}
                      onChange={(e) => setProvForm({ ...provForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                  </div>
                </>
              )}

              {/* DAERAH FORM FIELDS */}
              {dashTab === "daerahs" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Provinsi Induk</label>
                    <select
                      value={daerahForm.province_id}
                      onChange={(e) => setDaerahForm({ ...daerahForm, province_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    >
                      {dashProvinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {validationErrors.province_id && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.province_id[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Nama Daerah / Distrik</label>
                    <input
                      type="text"
                      required
                      value={daerahForm.name}
                      onChange={(e) => setDaerahForm({ ...daerahForm, name: e.target.value })}
                      placeholder="Kota Depok"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                    {validationErrors.name && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">URL Gambar</label>
                    <input
                      type="text"
                      value={daerahForm.image}
                      onChange={(e) => setDaerahForm({ ...daerahForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Tautan Website</label>
                    <input
                      type="url"
                      value={daerahForm.website}
                      onChange={(e) => setDaerahForm({ ...daerahForm, website: e.target.value })}
                      placeholder="https://depok.baznas.go.id"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                    {validationErrors.website && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.website[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Tautan Instagram</label>
                    <input
                      type="text"
                      value={daerahForm.instagram}
                      onChange={(e) => setDaerahForm({ ...daerahForm, instagram: e.target.value })}
                      placeholder="@baznas_kotadepok"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Tautan Email</label>
                    <input
                      type="email"
                      value={daerahForm.email}
                      onChange={(e) => setDaerahForm({ ...daerahForm, email: e.target.value })}
                      placeholder="baznas.depok@baznas.go.id"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                    {validationErrors.email && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.email[0]}</p>}
                  </div>
                </>
              )}

              {/* ORGANIZATIONS FORM FIELDS */}
              {dashTab === "organizations" && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Nama Organisasi</label>
                    <input
                      type="text"
                      required
                      value={orgForm.name}
                      onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                      placeholder="BAZNAS Kota Depok"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                    {validationErrors.name && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Lokasi Wilayah</label>
                    <input
                      type="text"
                      required
                      value={orgForm.region}
                      onChange={(e) => setOrgForm({ ...orgForm, region: e.target.value })}
                      placeholder="Depok"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                    {validationErrors.region && <p className="text-red-500 mt-1 text-[10px]">{validationErrors.region[0]}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Provinsi Induk</label>
                    <select
                      value={orgForm.province_id}
                      onChange={(e) => setOrgForm({ ...orgForm, province_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    >
                      <option value="">Tidak Ada</option>
                      {dashProvinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Daerah Induk</label>
                    <select
                      value={orgForm.daerah_id}
                      onChange={(e) => setOrgForm({ ...orgForm, daerah_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    >
                      <option value="">Tidak Ada</option>
                      {dashDaerahs.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Status</label>
                    <select
                      value={orgForm.status}
                      onChange={(e) => setOrgForm({ ...orgForm, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">URL Logo</label>
                    <input
                      type="text"
                      value={orgForm.logo}
                      onChange={(e) => setOrgForm({ ...orgForm, logo: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5">Deskripsi</label>
                    <textarea
                      value={orgForm.description}
                      onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                      placeholder="Ceritakan tentang cabang organisasi ini..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-baznas-ink focus:outline-none focus:border-baznas-green transition"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmittingCrud}
                className="w-full py-3 rounded-lg bg-baznas-green hover:bg-baznas-dark text-white font-bold uppercase text-xs tracking-wider transition shadow-md mt-4 flex items-center justify-center gap-1.5"
              >
                {isSubmittingCrud ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Menyimpan ke Database...
                  </>
                ) : (
                  "Simpan Data"
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
