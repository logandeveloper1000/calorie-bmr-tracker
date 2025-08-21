// src/hooks/useMeals.ts
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/useAuth";

export type Meal = { id: string; name: string; calories: number; time: string; date: string; };

export function useMeals(date: string) {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !date) return;
    const ref = collection(db, "users", user.uid, "meals", date, "list");
    const q = query(ref, orderBy("time"));
    const unsub = onSnapshot(q, (snap) => {
      setMeals(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Meal, "id">) })));
      setLoading(false);
    });
    return () => unsub();
  }, [user, date]);

  const total = useMemo(() => meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0), [meals]);

  const addMeal = async (name: string, calories: number, time: string) => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "meals", date, "list");
    await addDoc(ref, { name, calories, time, date });
  };

  const removeMeal = async (id: string) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "meals", date, "list", id);
    await deleteDoc(ref);
  };

  return { meals, loading, total, addMeal, removeMeal };
}
