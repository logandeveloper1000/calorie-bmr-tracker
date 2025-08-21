// src/components/MealLogger.tsx
import dayjs from "dayjs";
import { useMeals } from "../hooks/useMeals";
import { useState, useRef, useEffect } from "react";

function toNum(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function trimLeadingZeros(s: string) {
  if (s === "" || s === "0") return s;
  if (s.startsWith("0.") || s.startsWith(".")) return s.replace(/^0+(?=\.)/, "0");
  return s.replace(/^0+(?=\d)/, "");
}

type ToastType = "success" | "error" | null;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Failed to log meal.";
  }
}

export default function MealLogger() {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const { meals, loading, total, addMeal, removeMeal } = useMeals(date);

  const [name, setName] = useState("");
  const [caloriesStr, setCaloriesStr] = useState<string>(""); // string input
  const [time, setTime] = useState<string>(dayjs().format("HH:mm"));

  // UI state
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastType, setToastType] = useState<ToastType>(null);
  const hideTimerRef = useRef<number | null>(null);

  // Clean up toast timers
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  const showToast = (type: Exclude<ToastType, null>, msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setToastType(null);
      setToastMsg("");
    }, 4000);
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const calories = toNum(caloriesStr);
    if (!name || !calories || calories <= 0) {
      showToast("error", "Please fill all fields correctly.");
      return;
    }

    try {
      setSaving(true);
      await addMeal(name, calories, time);
      setName("");
      setCaloriesStr("");
      showToast("success", "Meal added successfully.");
    } catch (err: unknown) {
      showToast("error", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      {/* Slide-down toast */}
      <div
        className={`toast ${toastType ? "show" : ""} ${toastType ? `toast--${toastType}` : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>

      <h2 style={{ marginBottom: "20px" }}>Meal Logger</h2>

      <form onSubmit={onAdd}>
        {/* All inputs side by side */}
        <div className="grid">
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={saving}
            />
          </label>
          <label>
            Meal
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chicken salad"
              disabled={saving}
            />
          </label>
          <label>
            Calories
            <input
              type="number"
              inputMode="numeric"
              value={caloriesStr}
              onChange={(e) => setCaloriesStr(trimLeadingZeros(e.target.value))}
              min={0}
              placeholder="e.g. 450"
              disabled={saving}
            />
          </label>
          <label>
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={saving}
            />
          </label>
        </div>

        {/* Full-width button under inputs */}
        <button
          className="primary btn-full"
          type="submit"
          style={{ marginTop: "30px", marginBottom: "30px" }}
          disabled={saving}
        >
          {saving ? <span className="btn-spinner" aria-hidden="true" /> : "Add"}
        </button>
      </form>

      <div className="list">
        {loading ? (
          <p>Loading…</p>
        ) : meals.length === 0 ? (
          <p>No meals logged.</p>
        ) : (
          meals.map((m) => (
            <div key={m.id} className="list-item">
              <div>
                <strong>{m.name}</strong>
                <div className="muted">{m.time}</div>
              </div>
              <div className="right">
                <span>{m.calories} kcal</span>
                <button
                  className="danger"
                  onClick={() => removeMeal(m.id)}
                  disabled={saving}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="total">
        Total: <strong>{total} kcal</strong>
      </div>
    </div>
  );
}
