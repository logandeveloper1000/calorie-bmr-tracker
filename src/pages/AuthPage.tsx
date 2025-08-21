import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { loginEmail, registerEmail, loginGoogle } = useAuth();
  const [mode, setMode] = useState<"login"|"register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") await loginEmail(email, password);
    else await registerEmail(email, password);
  };

  return (
    <div className="auth">
      <form className="card auth-form" onSubmit={submit}>
        <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <button className="primary" type="submit">
          {mode === "login" ? "Sign In" : "Register"}
        </button>
        <button type="button" onClick={loginGoogle}>Continue with Google</button>
        <div className="switch">
          {mode === "login" ? (
            <span>New here? <button type="button" className="link" onClick={()=>setMode("register")}>Create an account</button></span>
          ) : (
            <span>Already have an account? <button type="button" className="link" onClick={()=>setMode("login")}>Sign in</button></span>
          )}
        </div>
      </form>
    </div>
  );
}
