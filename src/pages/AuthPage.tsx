// src/pages/AuthPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app"; // ← add

function authMessage(err: FirebaseError) {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "That email is already registered.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before completing.";
    default:
      return err.message || "Something went wrong.";
  }
}

export default function AuthPage() {
  const { user, loginEmail, registerEmail, loginGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      if (mode === "login") await loginEmail(email, password);
      else await registerEmail(email, password);
      // navigation happens in the effect when `user` updates
    } catch (err: unknown) {
      if (err instanceof FirebaseError) setError(authMessage(err));
      else if (err && typeof err === "object" && "message" in err)
        setError(String((err as { message?: unknown }).message));
      else setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth-card">
        <div className="brand">
          <span className="logo-dot" />
          <h1>Calorie & BMR Tracker</h1>
        </div>

        <p className="subtitle">
          {mode === "login"
            ? "Sign in to continue tracking your meals and goals."
            : "Create an account to save your profile and daily progress."}
        </p>

        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
            <div className="helper">Use your Coding Temple email if you have one.</div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={submitting}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="btn btn-primary btn-full" type="submit" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div className="divider">or</div>

          <button
            className="btn btn-google btn-full"
            type="button"
            onClick={loginGoogle}
            disabled={submitting}
          >
            <span className="g" />
            Continue with Google
          </button>

          <div className="switch">
            {mode === "login" ? (
              <span>
                New here?
                <button type="button" className="link" onClick={() => setMode("register")} disabled={submitting}>
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?
                <button type="button" className="link" onClick={() => setMode("login")} disabled={submitting}>
                  Sign in
                </button>
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
