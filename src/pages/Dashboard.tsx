import { useAuth } from "../context/AuthContext";
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

      <main className="grid-2">
        <ProfileForm />
        <DailySummary />
        <MealLogger />
      </main>
    </div>
  );
}
