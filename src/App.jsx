import { useEffect, useState } from "react";
import { ExpenseProvider } from "./context/ExpenseContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Statistics from "./components/Statistics";
import Goals from "./components/Goals";
import AddTransactionForm from "./components/AddTransactionForm";
import { useExpense } from "./context/ExpenseContext";

function AppContent() {
  const { activePage, setPage } = useExpense();
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      // Ignore if typing in input
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "SELECT") return;
      
      const key = e.key.toLowerCase();
      if (key === "n") { e.preventDefault(); setShowAdd(true); }
      if (key === "d") setPage("dashboard");
      if (key === "t") setPage("transactions");
      if (key === "s") setPage("statistics");
      if (key === "g") setPage("goals");
      if (key === "escape") setShowAdd(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setPage]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="page-transition" key={activePage}>
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "transactions" && <Transactions />}
          {activePage === "statistics" && <Statistics />}
          {activePage === "goals" && <Goals />}
        </div>
      </main>
      {showAdd && <AddTransactionForm onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
