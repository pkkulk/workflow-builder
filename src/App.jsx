import { useState, useRef, useEffect } from 'react'
import Node from './Node'
import './App.css'

function App() {
  const [history, setHistory] = useState({
    past: [],
    present: {
      'root': { id: 'root', type: 'start', label: 'Start', childId: null },
    },
    future: []
  });

  const [toast, setToast] = useState(null);

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

  const generateId = () => Math.random().toString(36).substr(2, 9);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (parentId, childType, slot = null, insert = false) => {
    const parent = history.present[parentId];

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

    // Insertion Logic
    // Insertion Logic
    if (insert) {
      if (childType === 'end') {
        showToast("Cannot insert End node in the middle.");
        return;
      }

      let oldChild = null;
      if (parent.type === 'branch') {
        if (slot === 'true') oldChild = parent.trueId;
        else if (slot === 'false') oldChild = parent.falseId;
      } else {
        oldChild = parent.childId;
      }

      // Attach old child to new node
      if (childType === 'branch') {
        newNode.trueId = oldChild;
      } else {
        newNode.childId = oldChild;
      }

      // Update parent to point to new node
      if (parent.type === 'branch') {
        if (slot === 'true') newNodes[parentId] = { ...parent, trueId: newId };
        else if (slot === 'false') newNodes[parentId] = { ...parent, falseId: newId };
      } else {
        newNodes[parentId] = { ...parent, childId: newId };
      }
    } else {
      // Standard Add (Append)
      if (parent.type === 'branch') {
        if (slot === 'true') newNodes[parentId] = { ...parent, trueId: newId };
        else if (slot === 'false') newNodes[parentId] = { ...parent, falseId: newId };
      } else {
        newNodes[parentId] = { ...parent, childId: newId };
      }
    }

    updateNodes(newNodes);
  };

  const handleDelete = (id) => {
    if (id === 'root') {
      showToast("Cannot delete the Start node.");
      return;
    }

    const newNodes = { ...history.present };
    const nodeToDelete = newNodes[id];

    let parentId = Object.keys(newNodes).find(key => {
      const n = newNodes[key];
      return n.childId === id || n.trueId === id || n.falseId === id;
    });

    if (!parentId) return;

    const parent = newNodes[parentId];

    let successorId = null;
    if (nodeToDelete.type === 'branch') {
      successorId = nodeToDelete.trueId || nodeToDelete.falseId;
    } else {
      successorId = nodeToDelete.childId;
    }

    if (parent.type === 'branch') {
      if (parent.trueId === id) newNodes[parentId] = { ...parent, trueId: successorId };
      else if (parent.falseId === id) newNodes[parentId] = { ...parent, falseId: successorId };
    } else {
      newNodes[parentId] = { ...parent, childId: successorId };
    }

    delete newNodes[id];
    updateNodes(newNodes);
  };

  const handleUpdate = (id, newProps) => {
    const newNodes = {
      ...history.present,
      [id]: { ...history.present[id], ...newProps }
    };
    updateNodes(newNodes);
  };

  const handleSave = () => {
    const json = JSON.stringify(history.present, null, 2);
    console.log("Saved Workflow:", json);

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
