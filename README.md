# 🚀 Workflow Builder UI — Frontend Intern Assignment

A visual workflow builder built using **React (Functional Components + Hooks)** that allows users to create, edit, and manage branching workflows using Action, Branch, and End nodes.

This project was developed as part of a **Frontend Intern Take-Home Assignment** to demonstrate skills in:

* Data modeling of complex trees
* Component architecture
* State management
* Interactive UI design

---

## 🌐 Live Demo

🔗 **Deployed on Vercel**
[https://workflow-builder-one-self.vercel.app/](https://workflow-builder-one-self.vercel.app/)

---

## 📦 GitHub Repository

🔗 [https://github.com/pkkulk/workflow-builder](https://github.com/pkkulk/workflow-builder)

---

## ✨ Features

### 🧩 Workflow Canvas

* Starts with a single **Start** root node
* Nodes are displayed in a vertical flow layout
* Visual connectors show parent → child relationships

---

### 🧱 Node Types

| Node Type | Description    | Children         |
| --------- | -------------- | ---------------- |
| Start     | Entry point    | 1                |
| Action    | Task step      | 1                |
| Branch    | Decision point | 2 (True / False) |
| End       | Terminal node  | 0                |

---

### 🛠 Workflow Editing

* ➕ Add nodes using contextual "+" buttons
* 🔀 Insert nodes between existing connections
* ❌ Delete any node (except Start)
* 🔁 Automatic reconnection of children when deleting
* ✏️ Editable node labels

---

### 💾 Bonus Features

* ✅ Save Workflow (logs full JSON to console)
* ✅ Load Example workflow
* ✅ Undo / Redo support

---

## 🧠 Data Modeling Strategy

Workflow is stored as a normalized object map:

```js
{
  id: "node-1",
  type: "action" | "branch" | "end",
  label: "Validate Data",
  childId: "node-2",
  trueId: "node-3",
  falseId: "node-4"
}
```

### Benefits:

* Fast lookups
* Easy rewiring
* Supports insertion & deletion cleanly
* Scales for deep workflows

---

## 🧩 Component Architecture

Main components:

* `App.jsx` — global workflow state & handlers
* `Node.jsx` — renders nodes and connection UI
* Contextual menus for add/insert
* Reusable connectors and slots

All components are functional and use React Hooks.

---

## 🔄 State Management

State handled using:

* `useState` for nodes map
* Parent-child references instead of arrays
* Structural operations:

  * Insert node
  * Delete node
  * Reconnect children
  * Branch slot assignment

Undo / Redo implemented using state history stack.

---

## 🎨 Styling & UX

* Pure CSS (no UI frameworks)
* Hover-based insertion controls
* Minimal clean layout
* Visual clarity between node types

No animation libraries or diagram libraries were used.

---

## ⚙️ Tech Stack

* ⚛️ React (Vite)
* 🧠 JavaScript (ES6+)
* 🎨 CSS
* ❌ No UI libraries
* ❌ No diagram libraries

As per assignment rules.

---

## ▶️ Run Locally

```bash
git clone https://github.com/pkkulk/workflow-builder.git
cd workflow-builder
npm install
npm run dev
```

Open in browser:
👉 [http://localhost:5173](http://localhost:5173)

---

## 📌 Assignment Requirements — Status

| Requirement           | Status |
| --------------------- | ------ |
| Root Start Node       | ✅      |
| Multiple Node Types   | ✅      |
| Visual Tree Layout    | ✅      |
| Add After Any Node    | ✅      |
| Branch True / False   | ✅      |
| Delete With Reconnect | ✅      |
| Editable Labels       | ✅      |
| Save Workflow         | ✅      |
| Undo / Redo           | ✅      |
| No External Libraries | ✅      |

---

## 🧠 Learning Outcomes

This project strengthened skills in:

* Tree data structures in UI
* Recursive rendering
* Dynamic state updates
* UX for complex flows
* Handling structural edge cases

---

## 🤖 AI Assistance Disclosure

AI tools were used for:

* Planning logic
* UI improvement ideas

All core logic, state handling, and integration were reviewed and adjusted manually to meet assignment constraints and correctness.

---

## 👤 Author

**Prathamesh Kulkarni**
Final Year B.E. — Artificial Intelligence & Data Science
Frontend / Full Stack Developer

---
