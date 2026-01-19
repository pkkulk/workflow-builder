import { useState, useRef, useEffect } from 'react'
import Node from './Node'
import './App.css'

/**
 * Main Application Component
 * Manages workflow state, history (undo/redo), and validation.
 */
function App() {
  // --- State Management ---
  // Using a history object to track past, present, and future states for Undo/Redo
  const [history, setHistory] = useState({
    past: [],
    present: {
      'root': { id: 'root', type: 'start', label: 'Start', childId: null },
    },
    future: []
  });

  const [toast, setToast] = useState(null); // Simple toast notification message

  // Helper to update state with history tracking
  const updateNodes = (newNodes, addToHistory = true) => {
    setHistory(prev => {
      if (addToHistory) {
        return {
          past: [...prev.past, prev.present],
          present: newNodes,
          future: []
        };
      } else {
        return { ...prev, present: newNodes };
      }
    });
  };

  // --- Undo / Redo Logic ---
  const handleUndo = () => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  };

  const handleRedo = () => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  };

  // --- Helpers ---
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Actions ---

  /**
   * Adds a new node to the workflow.
   * @param {string} parentId - ID of the parent node.
   * @param {string} childType - Type of node to add (action, branch, end).
   * @param {string|null} slot - 'true' or 'false' for branch slots, null otherwise.
   */
  const handleAdd = (parentId, childType, slot = null) => {
    const parent = history.present[parentId];

    // Validation: Cannot add to End node (though UI hides it, good to enforce)
    if (parent.type === 'end') {
      showToast("Cannot add children to an End node.");
      return;
    }

    const newId = generateId();
    const newNode = {
      id: newId,
      type: childType,
      label: childType.charAt(0).toUpperCase() + childType.slice(1),
      childId: null,
      trueId: null,
      falseId: null
    };

    const newNodes = { ...history.present, [newId]: newNode };

    // Update parent reference
    if (parent.type === 'branch') {
      if (slot === 'true') newNodes[parentId] = { ...parent, trueId: newId };
      else if (slot === 'false') newNodes[parentId] = { ...parent, falseId: newId };
    } else {
      newNodes[parentId] = { ...parent, childId: newId };
    }

    updateNodes(newNodes);
  };

  /**
   * Deletes a node and reconnects its children.
   * @param {string} id - ID of the node to delete.
   */
  const handleDelete = (id) => {
    if (id === 'root') {
      showToast("Cannot delete the Start node.");
      return;
    }

    const newNodes = { ...history.present };
    const nodeToDelete = newNodes[id];

    // Find parent
    let parentId = Object.keys(newNodes).find(key => {
      const n = newNodes[key];
      return n.childId === id || n.trueId === id || n.falseId === id;
    });

    if (!parentId) return;

    const parent = newNodes[parentId];

    // Determine successor (reconnection logic)
    let successorId = null;
    if (nodeToDelete.type === 'branch') {
      // Logic: Promote True path, discard False path (simple reconnection)
      successorId = nodeToDelete.trueId || nodeToDelete.falseId;
    } else {
      successorId = nodeToDelete.childId;
    }

    // Update parent to point to successor
    if (parent.type === 'branch') {
      if (parent.trueId === id) newNodes[parentId] = { ...parent, trueId: successorId };
      else if (parent.falseId === id) newNodes[parentId] = { ...parent, falseId: successorId };
    } else {
      newNodes[parentId] = { ...parent, childId: successorId };
    }

    delete newNodes[id];
    updateNodes(newNodes);
  };

  /**
   * Updates a node's properties (e.g., label).
   */
  const handleUpdate = (id, newProps) => {
    const newNodes = {
      ...history.present,
      [id]: { ...history.present[id], ...newProps }
    };
    // For text updates, we might want to debounce history or only save on blur. 
    // Here we save on every commit (blur) passed from Node.
    updateNodes(newNodes);
  };

  // --- Save / Load ---

  const handleSave = () => {
    const json = JSON.stringify(history.present, null, 2);
    console.log("Saved Workflow:", json);

    // Download file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast("Workflow saved to console and downloaded.");
  };

  const handleLoadExample = () => {
    // Example: Start -> Action -> Branch -> (True: Action | False: End)
    const exampleNodes = {
      'root': { id: 'root', type: 'start', label: 'Start Request', childId: 'node1' },
      'node1': { id: 'node1', type: 'action', label: 'Validate Data', childId: 'node2' },
      'node2': { id: 'node2', type: 'branch', label: 'Is Valid?', trueId: 'node3', falseId: 'node4' },
      'node3': { id: 'node3', type: 'action', label: 'Process Payment', childId: 'node5' },
      'node4': { id: 'node4', type: 'end', label: 'Reject', childId: null },
      'node5': { id: 'node5', type: 'end', label: 'Complete', childId: null }
    };
    updateNodes(exampleNodes);
    showToast("Example workflow loaded.");
  };

  return (
    <div className="App">
      <h1>Workflow Builder</h1>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="group">
          <button onClick={handleSave}>Save Workflow</button>
          <button onClick={handleLoadExample}>Load Example</button>
        </div>
        <div className="group">
          <button onClick={handleUndo} disabled={history.past.length === 0}>Undo</button>
          <button onClick={handleRedo} disabled={history.future.length === 0}>Redo</button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div className="workflow-container">
        <Node
          id="root"
          nodes={history.present}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}

export default App
