// Mifflin–St Jeor
export type Gender = "male" | "female";
export type Activity =
  | "sedentary" | "light" | "moderate" | "active" | "very_active";

export const activityFactor: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calcBMR({
  weightKg,
  heightCm,
  age,
  gender,
}: { weightKg: number; heightCm: number; age: number; gender: Gender; }): number {
  if (gender === "male") {
    return 88.36 + (13.4 * weightKg) + (4.8 * heightCm) - (5.7 * age);
  }
  return 447.6 + (9.2 * weightKg) + (3.1 * heightCm) - (4.3 * age);
}

export function calcTDEE(bmr: number, activity: Activity) {
  return bmr * activityFactor[activity];
}
