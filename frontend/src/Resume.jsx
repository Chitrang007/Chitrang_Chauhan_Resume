import { useState, useEffect } from "react";

function Resume() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") !== "light",
  );
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

  useEffect(() => {
    fetch(`${API_URL}/api/resume`)
      .then((res) => res.json())
      .then((data) => {
        setResumeData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const before = () => document.documentElement.classList.remove("dark");
    const after = () => {
      if (isDark) document.documentElement.classList.add("dark");
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [isDark]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-emerald-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-0 sm:p-8 transition-colors">
      <div className="resume-container max-w-[210mm] mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-hidden sm:rounded-xl border-t-8 border-slate-900 dark:border-emerald-500">
        <header className="p-8 md:p-12 pb-6 border-b border-gray-100 dark:border-slate-800 relative">
          <button
            onClick={() => setIsDark(!isDark)}
            className="no-print absolute top-8 right-10 p-2 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            {resumeData.personal.name}
          </h1>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-400 uppercase mt-1">
            {resumeData.personal.title}
          </p>

          <div className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              {resumeData.personal.location} | {resumeData.personal.email} |{" "}
              {resumeData.personal.phone}
            </p>
            <div className="flex gap-4 mt-2 no-print font-bold">
              <a
                href={resumeData.personal.linkedin}
                target="_blank"
                className="hover:text-blue-600 dark:hover:text-white underline"
              >
                LinkedIn
              </a>
              <a
                href={resumeData.personal.github}
                target="_blank"
                className="hover:text-blue-600 dark:hover:text-white underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 pt-4 space-y-10">
          <section>
            <h2 className="section-title text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 border-b-2 border-slate-100 dark:border-slate-800 pb-2 mb-4">
              Summary
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-md">
              {resumeData.summary}
            </p>
          </section>

          <section>
            <h2 className="section-title text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 border-b-2 border-slate-100 dark:border-slate-800 pb-2 mb-4">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {Object.entries(resumeData.skills).map(([key, val]) => (
                <div key={key} className="text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {key}:
                  </span>
                  <span className="ml-2 text-slate-600 dark:text-slate-300">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 border-b-2 border-slate-100 dark:border-slate-800 pb-2 mb-6">
              Work Experience
            </h2>
            <div className="space-y-8">
              {resumeData.experience.map((job) => (
                <div key={job.id} className="print:break-inside-avoid">
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
                    <span className="text-md font-bold text-slate-900 dark:text-white uppercase">
                      {job.company} — {job.role}
                    </span>
                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                      {job.period}
                    </span>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    {job.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 border-b-2 border-slate-100 dark:border-slate-800 pb-2 mb-6">
              Projects
            </h2>
            <div className="space-y-8">
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="print:break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-md font-bold text-slate-900 dark:text-white uppercase">
                      {proj.name}
                    </span>
                    <div className="no-print flex gap-3 text-xs font-bold">
                      {proj.live && (
                        <a
                          href={proj.live}
                          className="text-blue-600 hover:underline"
                        >
                          Live
                        </a>
                      )}
                      {proj.code && (
                        <a
                          href={proj.code}
                          className="text-slate-500 hover:underline"
                        >
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-bold italic text-blue-600 dark:text-blue-400 mb-2">
                    {proj.tech}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="print:break-inside-avoid">
            <h2 className="section-title text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 border-b-2 border-slate-100 dark:border-slate-800 pb-2 mb-4">
              Education
            </h2>
            <div className="flex justify-between items-baseline font-bold">
              <span className="text-slate-900 dark:text-white uppercase">
                {resumeData.education.degree}
              </span>
              <span className="text-slate-900 dark:text-white">
                {resumeData.education.cgpa} CGPA
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
              {resumeData.education.university} | Graduated{" "}
              {resumeData.education.year}
            </p>
          </section>
        </div>

        <footer className="no-print p-10 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => window.print()}
            className="bg-slate-900 dark:bg-emerald-600 text-white px-12 py-4 rounded font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
          >
            Print / Download PDF
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Resume;
