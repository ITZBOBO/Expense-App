import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";

const CATEGORIES = ["Food", "Transport", "Shopping", "Health", "Entertainment", "Salary", "Freelance", "Subscription", "Other"];
const METHODS = ["Cash", "PayPal", "Visa **1234", "Mastercard **5678", "Bank Transfer"];

export default function AddTransactionForm({ onClose }) {
  const { addTransaction } = useExpense();
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [method, setMethod] = useState("Cash");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    addTransaction({ type, amount: Number(amount), description, category, method });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Transaction</div>

        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn${type === "income" ? " active income" : ""}`}
            onClick={() => setType("income")}
          >
            ↑ Income
          </button>
          <button
            type="button"
            className={`type-btn${type === "expense" ? " active expense" : ""}`}
            onClick={() => setType("expense")}
          >
            ↓ Expense
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount (₦)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Name / Description</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Netflix, Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
              {METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}
