import { useState } from "react";
import { useExpense } from "../context/ExpenseContext";
import AddTransactionForm from "./AddTransactionForm";

import { useCountUp } from "../hooks/useCountUp";

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

function SummaryCard({ label, amount, change, down }) {
  const animatedAmount = useCountUp(amount, 1000);

  return (
    <div className="sum-card">
      <div className="sum-card-label">{label}</div>
      <div className="sum-card-amount">
        {fmt(animatedAmount)}
      </div>
      <div>
        <span className={`sum-card-change ${down ? "down" : "up"}`}>
          {down ? "▼" : "▲"} {Math.abs(change)}%
        </span>
        <span className="sum-card-sub">than last month</span>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);
  return (
    <div className="bar-chart-wrap">
      {data.map((d, i) => (
        <div className="bar-group" key={i}>
          <div
            className="bar income-bar"
            style={{ height: `${(d.income / max) * 100}%`, width: 12 }}
            title={`Income: ${fmt(d.income)}`}
          />
          <div
            className="bar expense-bar"
            style={{ height: `${(d.expense / max) * 100}%`, width: 12 }}
            title={`Expense: ${fmt(d.expense)}`}
          />
          <span className="bar-month">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function RecentTransactions({ onSeeAll }) {
  const { transactions, setPage } = useExpense();
  const recent = transactions.slice(0, 5);

  return (
    <div className="table-card">
      <div className="card-head">
        <span className="card-title">Recent transactions</span>
        <button className="see-all" onClick={() => setPage("transactions")}>See all →</button>
      </div>
      {recent.length === 0 ? (
        <div className="empty-state">No transactions yet. Add one below!</div>
      ) : (
        <table className="tx-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>PAYMENT NAME</th>
              <th>METHOD</th>
              <th>CATEGORY</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((t) => {
              const d = new Date(t.date);
              const dateStr = `${d.getDate()} ${d.toLocaleString("en", { month: "short" })} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
              return (
                <tr key={t.id}>
                  <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>{dateStr}</td>
                  <td className={t.type === "income" ? "amount-income" : "amount-expense"}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </td>
                  <td>{t.description || t.category}</td>
                  <td><span className="method-badge">{t.method || "Cash"}</span></td>
                  <td><span className="cat-badge">{t.category}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function SavingGoals() {
  const { goals, setPage } = useExpense();
  const top = goals.slice(0, 3);
  return (
    <div className="goals-card">
      <div className="card-head">
        <span className="card-title">Saving goals</span>
        <button className="see-all" onClick={() => setPage("goals")}>See all →</button>
      </div>
      {top.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        return (
          <div className="goal-item" key={g.id}>
            <div className="goal-top">
              <span className="goal-name">{g.name}</span>
              <span className="goal-target">{fmt(g.saved)}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }}>{pct}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { income, expenses, balance, totalSavings, monthlyData } = useExpense();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Hi, here's the summary of your finances.</p>
        <span className="badge-pill">📅 This Month</span>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Total Balance" amount={balance} change={13.1} />
        <SummaryCard label="Income" amount={income} change={3.1} down />
        <SummaryCard label="Expense" amount={expenses} change={2.5} down />
        <SummaryCard label="Total Savings" amount={totalSavings} change={2.8} />
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <span className="chart-card-title">Yearly Overview</span>
          <div className="chart-legend">
            <span><span className="legend-dot" style={{ background: "var(--green)" }} />Income</span>
            <span><span className="legend-dot" style={{ background: "var(--green-mid)", opacity: .6 }} />Expense</span>
          </div>
        </div>
        <BarChart data={monthlyData} />
      </div>

      <div className="bottom-grid">
        <RecentTransactions />
        <SavingGoals />
      </div>

      <button className="fab" onClick={() => setShowAdd(true)} title="Add transaction">+</button>
      {showAdd && <AddTransactionForm onClose={() => setShowAdd(false)} />}
    </>
  );
}
