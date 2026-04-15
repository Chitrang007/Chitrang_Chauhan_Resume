import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form onSubmit={login} className="bg-slate-900 p-8 rounded-xl space-y-4 w-80">

        <input
          className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
          placeholder="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white"
          placeholder="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button className="w-full bg-emerald-600 p-2 rounded font-bold">
          Login
        </button>

      </form>
    </div>
  );
}