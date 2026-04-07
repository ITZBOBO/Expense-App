<div align="center">

# 💰 SpendTrack

**A personal finance dashboard built with React — track income, expenses, and savings goals in real time.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Design-1572B6?style=flat-square&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Balance, income, expense & savings summary with monthly bar chart |
| 🔄 **Live Transactions** | Add, filter, search and delete transactions instantly |
| 📁 **CSV Export** | One-click export of all transactions to `.csv` |
| 🍩 **Statistics** | SVG donut chart, KPI cards, savings rate, monthly breakdown table |
| 🎯 **Savings Goals** | Create, edit and track financial goals with animated progress bars |
| 🌙 **Dark Mode** | Full dark theme with persistent preference |
| 🔔 **Toast Notifications** | Contextual success/error toasts after every action |
| 📦 **Persistent Storage** | All data stored in `localStorage` — survives page refresh |
| 📱 **Responsive** | Adapts cleanly to tablet and mobile screens |

---

## 🛠 Tech Stack

- **React 18** — functional components, hooks only
- **useReducer + Context API** — global state without Redux
- **Vite** — lightning-fast HMR dev server
- **Vanilla CSS** — custom design system with CSS variables, dark mode via `data-theme`
- **SVG** — hand-crafted donut chart (zero chart libraries)
- **localStorage** — client-side data persistence

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/spendtrack.git
cd spendtrack
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Main dashboard with cards, chart, transactions, goals
│   ├── Transactions.jsx    # Full transaction list with search + CSV export
│   ├── Statistics.jsx      # SVG donut chart + monthly breakdown
│   ├── Goals.jsx           # Savings goals CRUD
│   ├── Sidebar.jsx         # Navigation + dark mode toggle
│   ├── AddTransactionForm.jsx  # Modal form for new transactions
│   └── Toast.jsx           # Notification toasts
├── context/
│   └── ExpenseContext.jsx  # Global state (useReducer), business logic, seed data
├── App.jsx                 # Root layout + page router
├── App.css                 # Full design system (tokens, components, dark mode)
└── main.jsx
```

---

## 🎨 Design Highlights

- **CSS custom properties** for theming — single source of truth
- **Dark mode** toggled via `data-theme` attribute on `<html>`
- **Micro-animations**: card hover lift, FAB spin, page slide-in, toast pop
- **Gradient progress bars** with smooth cubic-bezier transitions
- **Responsive grid** — adapts from 4-column to single-column layout

---

## 📄 License

MIT
