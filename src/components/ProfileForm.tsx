// src/components/ProfileForm.tsx
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { calcBMR, calcTDEE } from "../utils/bmr";
import type { Activity, Gender } from "../utils/bmr";
import { useProfile } from "../hooks/useProfile";

const schema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().min(10).max(120),
  gender: z.enum(["male", "female"]),
  activity: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
});

function toNum(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

// Trim leading zeros but keep "0" and empty string valid while typing.
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
    return "Failed to save profile.";
  }
}

export default function ProfileForm() {
  const { profile, saveProfile } = useProfile();

  // Keep raw input as strings so the user can clear the field.
  const [weightStr, setWeightStr] = useState<string>(profile?.weight?.toString() ?? "");
  const [heightStr, setHeightStr] = useState<string>(profile?.height?.toString() ?? "");
  const [ageStr, setAgeStr] = useState<string>(profile?.age?.toString() ?? "");
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [activity, setActivity] = useState<Activity>(profile?.activity ?? "moderate");

  // Derived state
  const [bmr, setBmr] = useState<number>(profile?.bmr ?? 0);
  const [dailyGoalStr, setDailyGoalStr] = useState<string>(profile?.dailyGoal?.toString() ?? "");

  // UI state
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastType, setToastType] = useState<ToastType>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!profile) return;
    setWeightStr(profile.weight?.toString() ?? "");
    setHeightStr(profile.height?.toString() ?? "");
    setAgeStr(profile.age?.toString() ?? "");
    setGender(profile.gender);
    setActivity(profile.activity);
    setBmr(profile.bmr ?? 0);
    setDailyGoalStr(profile.dailyGoal?.toString() ?? "");
  }, [profile]);

  // Recalculate BMR/TDEE whenever inputs change (when valid)
  useEffect(() => {
    const weight = toNum(weightStr);
    const height = toNum(heightStr);
    const age = toNum(ageStr);

    if (weight && height && age && gender && activity) {
      const b = calcBMR({ weightKg: weight, heightCm: height, age, gender });
      const tdee = Math.round(calcTDEE(b, activity));
      setBmr(Math.round(b));
      // Only auto-sync dailyGoal if user hasn't manually overridden it
      if (dailyGoalStr === "" || dailyGoalStr === "0") {
        setDailyGoalStr(String(tdee));
      }
    } else {
      setBmr(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightStr, heightStr, ageStr, gender, activity]);

  // Clean up any pending toast timers on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
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

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const weight = toNum(weightStr);
    const height = toNum(heightStr);
    const age = toNum(ageStr);
    const dailyGoal = toNum(dailyGoalStr) ?? 0;

    const parsed = schema.safeParse({
      weight: weight ?? 0,
      height: height ?? 0,
      age: age ?? 0,
      gender,
      activity,
    });

    if (!parsed.success) {
      showToast("error", "Please fill out all fields correctly.");
      return;
    }

    try {
      setSaving(true);
      await saveProfile({
        weight: parsed.data.weight,
        height: parsed.data.height,
        age: parsed.data.age,
        gender,
        activity,
        bmr,
        dailyGoal,
      });
      showToast("success", "Profile saved successfully.");
    } catch (err: unknown) {
      showToast("error", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Slide-down toast (fixed at top) */}
      <div
        className={`toast ${toastType ? "show" : ""} ${toastType ? `toast--${toastType}` : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>

      <form onSubmit={onSave} className="card">
        <h2>Profile & BMR</h2>

        {/* Top grid: weight / height / age / gender */}
        <div className="grid" aria-disabled={saving}>
          <label>
            Weight (kg)
            <input
              type="number"
              inputMode="decimal"
              value={weightStr}
              onChange={(e) => setWeightStr(trimLeadingZeros(e.target.value))}
              min={1}
              placeholder="e.g. 70"
              disabled={saving}
            />
          </label>

          <label>
            Height (cm)
            <input
              type="number"
              inputMode="numeric"
              value={heightStr}
              onChange={(e) => setHeightStr(trimLeadingZeros(e.target.value))}
              min={1}
              placeholder="e.g. 175"
              disabled={saving}
            />
          </label>

          <label>
            Age
            <input
              type="number"
              inputMode="numeric"
              value={ageStr}
              onChange={(e) => setAgeStr(trimLeadingZeros(e.target.value))}
              min={10}
              placeholder="e.g. 25"
              disabled={saving}
            />
          </label>

          <label>
            Gender
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              disabled={saving}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        {/* Row: Activity + BMR side by side */}
        <div className="row" style={{ marginTop: 12 }}>
          <label style={{ flex: 1 }}>
            Activity
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as Activity)}
              disabled={saving}
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </label>

          <label style={{ flex: 1 }}>
            BMR
            <input
              type="number"
              inputMode="numeric"
              value={bmr}
              readOnly
              placeholder="BMR auto-calculated"
            />
          </label>
        </div>

        {/* Daily Goal below Activity/BMR and above Save */}
        <div className="row" style={{ marginTop: 8 }}>
          <label style={{ flex: 1 }}>
            Daily Goal
            <input
              type="number"
              inputMode="numeric"
              value={dailyGoalStr}
              onChange={(e) => setDailyGoalStr(trimLeadingZeros(e.target.value))}
              min={0}
              placeholder="Auto from BMR"
              disabled={saving}
            />
          </label>
        </div>

        <button type="submit" className="primary" style={{ marginTop: 10 }} disabled={saving}>
          {saving ? (
            <span className="btn-spinner" aria-hidden="true" />
          ) : (
            "Save Profile"
          )}
        </button>
      </form>
    </>
  );
}
