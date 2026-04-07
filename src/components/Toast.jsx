import { useExpense } from "../context/ExpenseContext";

export default function Toast() {
  const { toasts } = useExpense();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" ? "✓" : "✕"} {t.message}
        </div>
      ))}
    </div>
  );
}
