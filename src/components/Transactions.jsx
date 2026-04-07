import { useState, useMemo } from "react";
import { useExpense } from "../context/ExpenseContext";
import AddTransactionForm from "./AddTransactionForm";

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

function exportCSV(transactions) {
  const header = ["Date", "Type", "Amount", "Description", "Category", "Method"];
  const rows = transactions.map((t) => {
    const d = new Date(t.date);
    return [
      d.toLocaleDateString(),
      t.type,
      t.amount,
      `"${t.description || ""}"`,
      t.category,
      t.method || "Cash",
    ].join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `spendtrack-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const { filtered, filter, setFilter, deleteTransaction, clearAll } = useExpense();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const displayed = useMemo(() => {
    if (!search.trim()) return filtered;
    const q = search.toLowerCase();
    return filtered.filter(
      (t) =>
        (t.description || "").toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.method || "").toLowerCase().includes(q)
    );
  }, [filtered, search]);

  return (
    <>
      <div className="page-header">
        <h1>Transactions</h1>
        <p>All your income and expense records.</p>
      </div>

      <div className="tx-page-filters">
        {["all", "income", "expense"].map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        <div className="search-wrap">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="export-btn"
          onClick={() => exportCSV(displayed)}
          title="Export to CSV"
        >
          ↓ Export CSV
        </button>

        {filtered.length > 0 && (
          <button
            className="filter-btn danger"
            onClick={() => { if (window.confirm("Clear all transactions?")) clearAll(); }}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="table-card">
        {displayed.length === 0 ? (
          <div className="empty-state">
            {search ? `No results for "${search}"` : "No transactions found. Add one below!"}
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>PAYMENT NAME</th>
                <th>METHOD</th>
                <th>CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((t) => {
                const d = new Date(t.date);
                const dateStr = `${d.getDate()} ${d.toLocaleString("en", { month: "short" })} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                return (
                  <tr key={t.id} className="tx-row">
                    <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>{dateStr}</td>
                    <td className={t.type === "income" ? "amount-income" : "amount-expense"}>
                      {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                    </td>
                    <td style={{ fontWeight: 500 }}>{t.description || t.category}</td>
                    <td><span className="method-badge">{t.method || "Cash"}</span></td>
                    <td><span className="cat-badge">{t.category}</span></td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteTransaction(t.id)} title="Delete">✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)} title="Add transaction">+</button>
      {showAdd && <AddTransactionForm onClose={() => setShowAdd(false)} />}
    </>
  );
}
