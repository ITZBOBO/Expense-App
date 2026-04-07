import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "spendtrack_v3";

const DEFAULT_BUDGETS = {
  Food: 30000,
  Transport: 15000,
  Shopping: 40000,
  Housing: 50000,
  Utilities: 15000,
  Health: 20000,
  Entertainment: 20000,
  Subscription: 20000,
  Freelance: 0,
  Salary: 0,
  Other: 10000,
};


// ── Seed Data ──────────────────────────────────────────────────
function makeTx(id, type, amount, description, category, method, daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { id, type, amount, description, category, method, date: d.toISOString() };
}

const SEED_TRANSACTIONS = [
  makeTx("s01","income",350000,"Monthly Salary","Salary","Bank Transfer",2),
  makeTx("s02","income",85000,"Freelance Design","Freelance","Bank Transfer",5),
  makeTx("s03","expense",18500,"Rent","Housing","Bank Transfer",3),
  makeTx("s04","expense",7200,"Electricity Bill","Utilities","Bank Transfer",4),
  makeTx("s05","expense",3500,"McDonald's","Food","Visa **1234",1),
  makeTx("s06","expense",4200,"Shoprite Groceries","Food","Visa **1234",6),
  makeTx("s07","expense",12990,"Netflix","Subscription","PayPal",7),
  makeTx("s08","expense",7500,"Uber","Transport","PayPal",8),
  makeTx("s09","expense",22000,"Amazon","Shopping","Visa **1234",10),
  makeTx("s10","expense",9800,"Pharmacy","Health","Cash",11),
  makeTx("s11","income",45000,"Side Project","Freelance","Bank Transfer",15),
  makeTx("s12","expense",5600,"Spotify","Subscription","PayPal",16),
  makeTx("s13","expense",3100,"KFC","Food","Cash",17),
  makeTx("s14","expense",8900,"Bolt Ride","Transport","PayPal",18),
  makeTx("s15","expense",15000,"Cinema + Dinner","Entertainment","Visa **1234",20),
  makeTx("s16","income",120000,"Consulting","Freelance","Bank Transfer",32),
  makeTx("s17","expense",7700,"Grocery Store","Food","Cash",33),
  makeTx("s18","expense",31000,"New Shoes","Shopping","Visa **1234",35),
  makeTx("s19","expense",4400,"Data Plan","Utilities","Visa **1234",38),
  makeTx("s20","expense",6200,"Doctor Visit","Health","Cash",40),
  makeTx("s21","income",350000,"Monthly Salary","Salary","Bank Transfer",33),
  makeTx("s22","expense",19000,"House Rent","Housing","Bank Transfer",34),
  makeTx("s23","expense",2800,"Pizza","Food","Cash",45),
  makeTx("s24","expense",11200,"Jumia Shopping","Shopping","Visa **1234",50),
  makeTx("s25","expense",5000,"Fuel","Transport","Cash",55),
];

const defaultGoals = [
  { id: "g1", name: "MacBook Pro", target: 2500000, saved: 750000 },
  { id: "g2", name: "New Car", target: 8000000, saved: 5840000 },
  { id: "g3", name: "iPhone 16 Pro Max", target: 1200000, saved: 1080000 },
  { id: "g4", name: "Emergency Fund", target: 500000, saved: 210000 },
];

const defaultState = {
  transactions: SEED_TRANSACTIONS,
  filter: "all",
  goals: defaultGoals,
  activePage: "dashboard",
  darkMode: false,
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        transactions: parsed.transactions?.length ? parsed.transactions : SEED_TRANSACTIONS,
        goals: Array.isArray(parsed.goals) && parsed.goals.length > 0 ? parsed.goals : defaultGoals,
      };
    }
    return defaultState;
  } catch {
    return defaultState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "CLEAR_ALL":
      return { ...state, transactions: [] };
    case "SET_PAGE":
      return { ...state, activePage: action.payload };
    case "ADD_GOAL":
      return { ...state, goals: [...state.goals, action.payload] };
    case "UPDATE_GOAL":
      return { ...state, goals: state.goals.map((g) => (g.id === action.payload.id ? action.payload : g)) };
    case "DELETE_GOAL":
      return { ...state, goals: state.goals.filter((g) => g.id !== action.payload) };
    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [toasts, setToasts] = useState([]);

  // Persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions: state.transactions, goals: state.goals, darkMode: state.darkMode })
    );
  }, [state.transactions, state.goals, state.darkMode]);

  // Dark mode on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.darkMode ? "dark" : "light");
  }, [state.darkMode]);

  // Toast helper
  const addToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  // Derived values
  const income = state.transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = state.transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const totalSavings = state.goals.reduce((s, g) => s + g.saved, 0);

  const filtered =
    state.filter === "all"
      ? state.transactions
      : state.transactions.filter((t) => t.type === state.filter);

  // Monthly breakdown (last 12 months)
  const monthlyData = (() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const label = d.toLocaleString("en", { month: "short" });
      const [year, month] = [d.getFullYear(), d.getMonth()];
      const txs = state.transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === year && td.getMonth() === month;
      });
      return {
        label,
        income: txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      };
    });
  })();

  // Category breakdown for stats
  const categoryBreakdown = (() => {
    const map = {};
    state.transactions.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  })();

  // Actions
  const addTransaction = (data) => {
    dispatch({ type: "ADD_TRANSACTION", payload: { ...data, id: crypto.randomUUID(), date: new Date().toISOString() } });
    addToast(`${data.type === "income" ? "Income" : "Expense"} added successfully ✓`);
  };
  const deleteTransaction = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    addToast("Transaction deleted", "error");
  };
  const setFilter = (f) => dispatch({ type: "SET_FILTER", payload: f });
  const clearAll = () => { dispatch({ type: "CLEAR_ALL" }); addToast("All transactions cleared", "error"); };
  const setPage = (p) => dispatch({ type: "SET_PAGE", payload: p });
  const addGoal = (g) => { dispatch({ type: "ADD_GOAL", payload: { ...g, id: crypto.randomUUID() } }); addToast("Goal added ✓"); };
  const updateGoal = (g) => { dispatch({ type: "UPDATE_GOAL", payload: g }); addToast("Goal updated ✓"); };
  const deleteGoal = (id) => { dispatch({ type: "DELETE_GOAL", payload: id }); addToast("Goal deleted", "error"); };
  const toggleDark = () => dispatch({ type: "TOGGLE_DARK" });

  return (
    <ExpenseContext.Provider value={{
      transactions: state.transactions, filtered, filter: state.filter,
      income, expenses, balance, totalSavings, goals: state.goals,
      activePage: state.activePage, darkMode: state.darkMode,
      monthlyData, categoryBreakdown, toasts,
      budgets: state.budgets || DEFAULT_BUDGETS,
      addTransaction, deleteTransaction, setFilter, clearAll,
      setPage, addGoal, updateGoal, deleteGoal, toggleDark,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  return useContext(ExpenseContext);
}
