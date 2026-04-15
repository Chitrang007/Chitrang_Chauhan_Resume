import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/resume')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://localhost:8080/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Saved");
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateBullet = (section, idx, bIdx, val) => {
    const updated = { ...data };
    updated[section][idx].bullets[bIdx] = val;
    setData(updated);
  };

  const addProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: "New Project",
      tech: "",
      live: "",
      code: "",
      bullets: ["New bullet"]
    };
    setData({ ...data, projects: [...data.projects, newProject] });
  };

  const removeProject = (idx) => {
    const updated = data.projects.filter((_, i) => i !== idx);
    setData({ ...data, projects: updated });
  };

  const addProjectBullet = (idx) => {
    const updated = [...data.projects];
    updated[idx].bullets.push("New bullet");
    setData({ ...data, projects: updated });
  };

  const addExperience = () => {
    const newExp = {
      id: crypto.randomUUID(),
      company: "Company",
      role: "Role",
      startDate: "",
      endDate: "",
      current: false,
      bullets: ["New bullet"]
    };
    setData({ ...data, experience: [...data.experience, newExp] });
  };

  const removeExperience = (idx) => {
    const updated = data.experience.filter((_, i) => i !== idx);
    setData({ ...data, experience: updated });
  };

  const addExperienceBullet = (idx) => {
    const updated = [...data.experience];
    updated[idx].bullets.push("New bullet");
    setData({ ...data, experience: updated });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="p-20 text-emerald-500 font-bold">Loading Editor...</div>;
  if (!data) return <div className="p-20 text-red-500 font-bold">Data fetch failed.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
          <div className="flex gap-4">
           <button
              type="button"
              onClick={logout}
              className="text-slate-400 font-bold px-4"
           >
              Logout
          </button>
          <button type="submit" disabled={saving} className="bg-emerald-600 px-10 py-2 rounded-lg font-bold hover:bg-emerald-500 transition-all">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-emerald-500 font-bold uppercase text-xs">Primary Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-slate-900 p-3 rounded border border-slate-800" value={data.personal.name} onChange={(e) => setData({...data, personal: {...data.personal, name: e.target.value}})} />
            <input className="bg-slate-900 p-3 rounded border border-slate-800" value={data.personal.title} onChange={(e) => setData({...data, personal: {...data.personal, title: e.target.value}})} />
          </div>
          <textarea className="w-full bg-slate-900 p-4 rounded border border-slate-800 h-32" value={data.summary} onChange={(e) => setData({...data, summary: e.target.value})} />
        </section>

        <section className="space-y-4">
          <h2 className="text-emerald-500 font-bold uppercase text-xs">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(data.skills).map(category => (
              <div key={category} className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">{category}</label>
                <input className="bg-slate-900 p-3 rounded border border-slate-800" value={data.skills[category]} onChange={(e) => setData({...data, skills: {...data.skills, [category]: e.target.value}})} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-emerald-500 font-bold uppercase text-xs">Work History</h2>
            <button type="button" onClick={addExperience} className="bg-emerald-600 px-4 py-1 rounded text-sm font-bold">
              + Add Experience
            </button>
          </div>

          {data.experience.map((job, idx) => (
            <div key={job.id} className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4">
              <div className="flex gap-4 items-center">
                <input className="bg-slate-900 p-2 rounded border border-slate-800 font-bold" value={job.company} onChange={(e) => { const n = [...data.experience]; n[idx].company = e.target.value; setData({...data, experience: n}) }} />
                <input className="flex-1 bg-slate-900 p-2 rounded border border-slate-800" value={job.role} onChange={(e) => { const n = [...data.experience]; n[idx].role = e.target.value; setData({...data, experience: n}) }} />
                <button type="button" onClick={() => removeExperience(idx)} className="text-red-400 text-xs">
                  Delete
                </button>
              </div>

              <div className="flex gap-4">
                <input
                  type="month"
                  className="bg-slate-900 p-2 rounded border border-slate-800"
                  value={job.startDate || ""}
                  onChange={(e) => {
                    const n = [...data.experience];
                    n[idx].startDate = e.target.value;
                    setData({ ...data, experience: n });
                  }}
                />

                <input
                  type="month"
                  className="bg-slate-900 p-2 rounded border border-slate-800"
                  value={job.endDate || ""}
                  disabled={job.current}
                  onChange={(e) => {
                    const n = [...data.experience];
                    n[idx].endDate = e.target.value;
                    setData({ ...data, experience: n });
                  }}
                />

                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={job.current || false}
                    onChange={(e) => {
                      const n = [...data.experience];
                      n[idx].current = e.target.checked;
                      setData({ ...data, experience: n });
                    }}
                  />
                  Current
                </label>
              </div>

              <div className="space-y-2">
                {job.bullets.map((b, bIdx) => (
                  <input key={bIdx} className="w-full bg-slate-950 p-2 rounded border border-slate-800 text-sm" value={b} onChange={(e) => updateBullet('experience', idx, bIdx, e.target.value)} />
                ))}
              </div>

              <button type="button" onClick={() => addExperienceBullet(idx)} className="text-emerald-400 text-xs">
                + Add Bullet
              </button>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-emerald-500 font-bold uppercase text-xs">Project Portfolio</h2>
            <button type="button" onClick={addProject} className="bg-emerald-600 px-4 py-1 rounded text-sm font-bold">
              + Add Project
            </button>
          </div>

          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  className="w-full bg-slate-900 p-2 rounded border border-slate-800 font-bold"
                  value={proj.name}
                  onChange={(e) => {
                    const n = [...data.projects];
                    n[idx].name = e.target.value;
                    setData({ ...data, projects: n });
                  }}
                />
                <button type="button" onClick={() => removeProject(idx)} className="text-red-400 text-xs">
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="bg-slate-900 p-2 rounded border border-slate-800 text-sm"
                  placeholder="Live URL"
                  value={proj.live || ""}
                  onChange={(e) => {
                    const n = [...data.projects];
                    n[idx].live = e.target.value;
                    setData({ ...data, projects: n });
                  }}
                />

                <input
                  className="bg-slate-900 p-2 rounded border border-slate-800 text-sm"
                  placeholder="GitHub URL"
                  value={proj.code || ""}
                  onChange={(e) => {
                    const n = [...data.projects];
                    n[idx].code = e.target.value;
                    setData({ ...data, projects: n });
                  }}
                />
              </div>

              <div className="space-y-2">
                {proj.bullets.map((b, bIdx) => (
                  <input
                    key={bIdx}
                    className="w-full bg-slate-950 p-2 rounded border border-slate-800 text-sm"
                    value={b}
                    onChange={(e) => updateBullet('projects', idx, bIdx, e.target.value)}
                  />
                ))}
              </div>

              <button type="button" onClick={() => addProjectBullet(idx)} className="text-emerald-400 text-xs">
                + Add Bullet
              </button>
            </div>
          ))}
        </section>
      </form>
    </div>
  );
}

export default Admin;