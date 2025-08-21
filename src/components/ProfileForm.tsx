// src/components/ProfileForm.tsx
import { useState, useEffect } from "react";
import { z } from "zod";
import { calcBMR, calcTDEE } from "../utils/bmr";
import type { Activity, Gender } from "../utils/bmr";
import { useProfile } from "../hooks/useProfile";

const schema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().min(10).max(120),
  gender: z.enum(["male", "female"]),
  activity: z.enum(["sedentary","light","moderate","active","very_active"]),
});

export default function ProfileForm() {
  const { profile, saveProfile } = useProfile();

  const [weight, setWeight] = useState<number>(profile?.weight ?? 70);
  const [height, setHeight] = useState<number>(profile?.height ?? 175);
  const [age, setAge] = useState<number>(profile?.age ?? 25);
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [activity, setActivity] = useState<Activity>(profile?.activity ?? "moderate");
  const [bmr, setBmr] = useState<number>(profile?.bmr ?? 0);
  const [dailyGoal, setDailyGoal] = useState<number>(profile?.dailyGoal ?? 0);

  useEffect(() => {
    if (!profile) return;
    setWeight(profile.weight);
    setHeight(profile.height);
    setAge(profile.age);
    setGender(profile.gender);
    setActivity(profile.activity);
    setBmr(profile.bmr);
    setDailyGoal(profile.dailyGoal);
  }, [profile]);

  const recalc = () => {
    const parsed = schema.safeParse({ weight, height, age, gender, activity });
    if (!parsed.success) return;
    const b = calcBMR({ weightKg: weight, heightCm: height, age, gender });
    const tdee = Math.round(calcTDEE(b, activity));
    setBmr(Math.round(b));
    setDailyGoal(tdee);
  };

  useEffect(recalc, [weight, height, age, gender, activity]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile({ weight, height, age, gender, activity, bmr, dailyGoal });
  };

  return (
    <form onSubmit={onSave} className="card">
      <h2>Profile & BMR</h2>
      <div className="grid">
        <label>Weight (kg)
          <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} min={1}/>
        </label>
        <label>Height (cm)
          <input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} min={1}/>
        </label>
        <label>Age
          <input type="number" value={age} onChange={e=>setAge(Number(e.target.value))} min={10}/>
        </label>
        <label>Gender
          <select value={gender} onChange={e=>setGender(e.target.value as Gender)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>Activity
          <select value={activity} onChange={e=>setActivity(e.target.value as Activity)}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </label>
      </div>

      <div className="row">
        <div className="metric">
          <span className="metric-label">BMR</span>
          <span className="metric-value">{bmr} kcal</span>
        </div>
        <div className="metric">
          <span className="metric-label">Daily Goal</span>
          <input
            type="number"
            value={dailyGoal}
            onChange={e=>setDailyGoal(Number(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <button type="submit" className="primary">Save Profile</button>
    </form>
  );
}
