import { useMeals } from "../hooks/useMeals";
import { useProfile } from "../hooks/useProfile";
import dayjs from "dayjs";

export default function DailySummary() {
  const date = dayjs().format("YYYY-MM-DD");
  const { total } = useMeals(date);
  const { profile } = useProfile();
  const goal = profile?.dailyGoal ?? 0;
  const pct = Math.min(100, Math.round(goal ? (total / goal) * 100 : 0));

  return (
    <div className="card">
      <h2>Today’s Summary</h2>
      <div className="progress">
        <div className="bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="row">
        <div className="metric">
          <span className="metric-label">Consumed</span>
          <span className="metric-value">{total} kcal</span>
        </div>
        <div className="metric">
          <span className="metric-label">Goal</span>
          <span className="metric-value">{goal} kcal</span>
        </div>
        <div className="metric">
          <span className="metric-label">Progress</span>
          <span className="metric-value">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
