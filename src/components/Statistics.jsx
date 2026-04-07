import { useExpense } from "../context/ExpenseContext";

const fmt = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const COLORS = [
  "#22c55e","#16a34a","#4ade80","#86efac","#f59e0b",
  "#f87171","#38bdf8","#a78bfa","#fb7185","#34d399",
];

function DonutChart({ data, total }) {
  const size = 200;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const slices = data.map(([cat, amount], i) => {
    const pct = amount / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const rotation = cumulative * 360 - 90;
    cumulative += pct;
    return { cat, amount, dash, gap, rotation, color: COLORS[i % COLORS.length] };
  });

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="36"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={0}
            transform={`rotate(${s.rotation} ${cx} ${cy})`}
            className="donut-slice"
          />
        ))}
        <circle cx={cx} cy={cy} r={r - 18} fill="var(--card)" />
        <text x={cx} y={cy - 8} textAnchor="middle" className="donut-center-label">Total</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="donut-center-amount">{fmt(total)}</text>
      </svg>
    </div>
  );
}

export default function Statistics() {
  const { categoryBreakdown, monthlyData, income, expenses, transactions } = useExpense();
  const totalExpenses = categoryBreakdown.reduce((s, [, v]) => s + v, 0);

  const topMonth = [...monthlyData].sort((a, b) => b.expense - a.expense)[0];
  const avgMonthly = monthlyData.reduce((s, m) => s + m.expense, 0) / 12;
  const savingsRate = income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0;

  return (
    <>
      <div className="page-header">
        <h1>Statistics</h1>
        <p>Deep insights into your financial patterns.</p>
      </div>

      {/* KPI row */}
      <div className="stats-kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total Transactions</div>
          <div className="kpi-value">{transactions.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Savings Rate</div>
          <div className="kpi-value" style={{ color: "var(--green-dark)" }}>{savingsRate}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg. Monthly Expense</div>
          <div className="kpi-value">{fmt(Math.round(avgMonthly))}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Highest Spend Month</div>
          <div className="kpi-value">{topMonth?.label || "—"}</div>
        </div>
      </div>

      <div className="stats-main-grid">
        {/* Donut */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">Spending by Category</span>
          </div>
          {categoryBreakdown.length === 0 ? (
            <div className="empty-state">No expenses yet.</div>
          ) : (
            <div className="donut-layout">
              <DonutChart data={categoryBreakdown} total={totalExpenses} />
              <div className="donut-legend">
                {categoryBreakdown.map(([cat, amount], i) => (
                  <div key={cat} className="donut-legend-row">
                    <span className="donut-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="donut-legend-cat">{cat}</span>
                    <span className="donut-legend-amt">{fmt(amount)}</span>
                    <span className="donut-legend-pct">
                      {((amount / totalExpenses) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly table */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">Monthly Breakdown</span>
          </div>
          <table className="tx-table">
            <thead>
              <tr>
                <th>MONTH</th>
                <th>INCOME</th>
                <th>EXPENSE</th>
                <th>NET</th>
              </tr>
            </thead>
            <tbody>
              {[...monthlyData].reverse().map((m) => {
                const net = m.income - m.expense;
                return (
                  <tr key={m.label}>
                    <td style={{ fontWeight: 600 }}>{m.label}</td>
                    <td className="amount-income">+{fmt(m.income)}</td>
                    <td className="amount-expense">-{fmt(m.expense)}</td>
                    <td className={net >= 0 ? "amount-income" : "amount-expense"}>
                      {net >= 0 ? "+" : ""}{fmt(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Budgets */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-card-header">
            <span className="chart-card-title">Monthly Budgets</span>
          </div>
          <div className="goals-grid" style={{ gap: "16px" }}>
            {Object.entries(useExpense().budgets)
              .filter(([, limit]) => limit > 0)
              .map(([cat, limit]) => {
                const spent = categoryBreakdown.find(([c]) => c === cat)?.[1] || 0;
                const pct = Math.min(100, Math.round((spent / limit) * 100));
                
                // Color coding for budgets
                let colorClass = "bg-green";
                if (pct > 75) colorClass = "bg-amber";
                if (pct > 90) colorClass = "bg-red";

                return (
                  <div key={cat} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: ".85rem" }}>{cat}</span>
                      <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>
                        <strong style={{ color: "var(--text)" }}>{fmt(spent)}</strong> / {fmt(limit)}
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: "10px" }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${pct}%`, 
                          minWidth: 0,
                          background: pct > 90 ? "var(--red)" : pct > 75 ? "#f59e0b" : "var(--green)"
                        }} 
                      />
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
