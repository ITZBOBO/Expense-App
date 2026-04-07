import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

function GoalModal({ onClose, existing }) {
  const { addGoal, updateGoal } = useExpense();
  const [name, setName] = useState(existing?.name || "");
  const [target, setTarget] = useState(existing?.target || "");
  const [saved, setSaved] = useState(existing?.saved || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target || !saved) return;
    if (existing) {
      updateGoal({ ...existing, name, target: Number(target), saved: Number(saved) });
    } else {
      addGoal({ name, target: Number(target), saved: Number(saved) });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{existing ? "Edit Goal" : "Add Saving Goal"}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Goal Name</label>
            <input className="form-input" placeholder="e.g. MacBook Pro" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Target Amount (₦)</label>
            <input className="form-input" type="number" min="1" placeholder="0" value={target} onChange={(e) => setTarget(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Amount Saved So Far (₦)</label>
            <input className="form-input" type="number" min="0" placeholder="0" value={saved} onChange={(e) => setSaved(e.target.value)} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{existing ? "Save Changes" : "Add Goal"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Goals() {
  const { goals, deleteGoal } = useExpense();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <>
      <div className="page-header">
        <h1>Saving Goals</h1>
        <p>Track your savings progress towards your financial goals.</p>
      </div>

      <div className="goals-grid">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          return (
            <div className="goal-card-full" key={g.id}>
              <div className="goal-top">
                <span className="goal-name">{g.name}</span>
                <span className="goal-target">{fmt(g.target)}</span>
              </div>
              <div className="progress-track" style={{ marginBottom: 12 }}>
                <div className="progress-fill" style={{ width: `${pct}%` }}>{pct}%</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                  Saved: <strong style={{ color: "var(--green-dark)" }}>{fmt(g.saved)}</strong>
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="filter-btn"
                    style={{ padding: "4px 12px", fontSize: ".78rem" }}
                    onClick={() => { setEditing(g); setShowModal(true); }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => { if (confirm(`Delete goal "${g.name}"?`)) deleteGoal(g.id); }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="add-goal-card" onClick={() => { setEditing(null); setShowModal(true); }}>
          <span style={{ fontSize: "2rem" }}>＋</span>
          <span>Add New Goal</span>
        </div>
      </div>

      {showModal && (
        <GoalModal
          existing={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </>
  );
}
