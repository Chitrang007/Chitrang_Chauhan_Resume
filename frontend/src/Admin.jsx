import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/resume")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8080/api/resume", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ADDED AUTH
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("✅ Changes Saved!");
        navigate("/");
      } else {
        alert("Unauthorized or Server Error");
      }
    } catch (err) {
      alert("Save failed");
      console.error(err)
    } finally {
      setSaving(false);
    }
  };

  const updateBullet = (section, idx, bIdx, val) => {
    const updated = { ...data };
    updated[section][idx].bullets[bIdx] = val;
    setData(updated);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="p-20 text-emerald-500 font-bold">Loading Editor...</div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto space-y-10 pb-20"
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 sticky top-0 bg-slate-950/90 z-20">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            CMS Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={logout}
              className="text-slate-400 font-bold px-4"
            >
              Logout
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 px-10 py-2 rounded-lg font-bold hover:bg-emerald-500 transition-all"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* Section: Primary Info [cite: 53-63] */}
        <section className="space-y-4">
          <h2 className="text-emerald-500 font-bold uppercase text-xs">
            Primary Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="bg-slate-900 p-3 rounded border border-slate-800"
              value={data.personal.name}
              onChange={(e) =>
                setData({
                  ...data,
                  personal: { ...data.personal, name: e.target.value },
                })
              }
            />
            <input
              className="bg-slate-900 p-3 rounded border border-slate-800"
              value={data.personal.title}
              onChange={(e) =>
                setData({
                  ...data,
                  personal: { ...data.personal, title: e.target.value },
                })
              }
            />
          </div>
          <textarea
            className="w-full bg-slate-900 p-4 rounded border border-slate-800 h-32"
            value={data.summary}
            onChange={(e) => setData({ ...data, summary: e.target.value })}
          />
        </section>

        {/* Section: Work History */}
        <section className="space-y-6">
          <h2 className="text-emerald-500 font-bold uppercase text-xs">
            Work History
          </h2>
          {data.experience.map((job, idx) => (
            <div
              key={job.id}
              className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4"
            >
              <div className="flex gap-4">
                <input
                  className="bg-slate-900 p-2 rounded border border-slate-800 font-bold"
                  value={job.company}
                  onChange={(e) => {
                    const n = [...data.experience];
                    n[idx].company = e.target.value;
                    setData({ ...data, experience: n });
                  }}
                />
                <input
                  className="flex-1 bg-slate-900 p-2 rounded border border-slate-800"
                  value={job.role}
                  onChange={(e) => {
                    const n = [...data.experience];
                    n[idx].role = e.target.value;
                    setData({ ...data, experience: n });
                  }}
                />
              </div>
              <div className="space-y-2">
                {job.bullets.map((b, bIdx) => (
                  <input
                    key={bIdx}
                    className="w-full bg-slate-950 p-2 rounded border border-slate-800 text-sm"
                    value={b}
                    onChange={(e) =>
                      updateBullet("experience", idx, bIdx, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Section: Project Portfolio */}
        <section className="space-y-6">
          <h2 className="text-emerald-500 font-bold uppercase text-xs">
            Project Portfolio
          </h2>
          {data.projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4"
            >
              <input
                className="w-full bg-slate-900 p-2 rounded border border-slate-800 font-bold"
                value={proj.name}
                onChange={(e) => {
                  const n = [...data.projects];
                  n[idx].name = e.target.value;
                  setData({ ...data, projects: n });
                }}
              />
              <div className="space-y-2">
                {proj.bullets.map((b, bIdx) => (
                  <input
                    key={bIdx}
                    className="w-full bg-slate-950 p-2 rounded border border-slate-800 text-sm"
                    value={b}
                    onChange={(e) =>
                      updateBullet("projects", idx, bIdx, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </form>
    </div>
  );
}

export default Admin;
