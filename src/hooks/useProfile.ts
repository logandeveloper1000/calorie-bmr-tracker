// src/hooks/useProfile.ts
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import type { Activity, Gender } from "../utils/bmr";

export type Profile = {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: Gender;
  activity: Activity;
  bmr: number;
  dailyGoal: number; // calories
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "meta", "profile");
    const unsub = onSnapshot(ref, (snap) => {
      setProfile(snap.exists() ? (snap.data() as Profile) : null);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const saveProfile = async (p: Profile) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "meta", "profile");
    await setDoc(ref, p, { merge: true });
  };

  return { profile, loading, saveProfile };
}
