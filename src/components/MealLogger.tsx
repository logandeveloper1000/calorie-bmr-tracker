import dayjs from "dayjs";
import { useMeals } from "../hooks/useMeals";
import { useState } from "react";

export default function MealLogger() {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const { meals, loading, total, addMeal, removeMeal } = useMeals(date);

  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [time, setTime] = useState<string>(dayjs().format("HH:mm"));

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || calories <= 0) return;
    await addMeal(name, calories, time);
    setName("");
    setCalories(0);
  };

  return (
    <div className="card">
      <h2>Meal Logger</h2>

      <div className="row">
        <label>Date
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </label>
      </div>

      <form onSubmit={onAdd} className="grid">
        <label>Meal
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Chicken salad" />
        </label>
        <label>Calories
          <input type="number" value={calories} onChange={e=>setCalories(Number(e.target.value))} min={0}/>
        </label>
        <label>Time
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
        </label>
        <button className="primary" type="submit">Add</button>
      </form>

      <div className="list">
        {loading ? <p>Loading…</p> : meals.length === 0 ? <p>No meals logged.</p> :
          meals.map(m => (
            <div key={m.id} className="list-item">
              <div>
                <strong>{m.name}</strong>
                <div className="muted">{m.time}</div>
              </div>
              <div className="right">
                <span>{m.calories} kcal</span>
                <button className="danger" onClick={()=>removeMeal(m.id)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>

      <div className="total">Total: <strong>{total} kcal</strong></div>
    </div>
  );
}
