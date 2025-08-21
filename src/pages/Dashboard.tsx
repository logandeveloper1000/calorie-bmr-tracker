// src/pages/Dashboard.tsx
import { useAuth } from "../context/useAuth";
import ProfileForm from "../components/ProfileForm";
import MealLogger from "../components/MealLogger";
import DailySummary from "../components/DailySummary";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <header className="topbar">
        <h1>Calorie & BMR Tracker</h1>
        <div className="user">
          <span className="muted">{user?.email}</span>
          <button onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-profile">
          <ProfileForm />
        </div>
        <div className="dashboard-summary">
          <DailySummary />
        </div>
        <div className="dashboard-meals">
          <MealLogger />
        </div>
      </main>
    </div>
  );
}
