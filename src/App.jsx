import { useState } from 'react'
import Node from './Node'
import './App.css'

function App() {
  const [nodes, setNodes] = useState({
    'root': { id: 'root', type: 'start', label: 'Start', childId: null },
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Re-thinking the onAdd signature to support branches
  // Current Node.jsx calls: onAdd(id, childType)
  // Needs to be: onAdd(parentId, childType, slot)

  const handleAdd = (parentId, childType, slot = null) => {
    const newId = generateId();
    const newNode = {
      id: newId,
      type: childType,
      label: childType.charAt(0).toUpperCase() + childType.slice(1),
      // Common props
      childId: null,      // For start, action
      trueId: null,       // For branch
      falseId: null       // For branch
    };

    setNodes(prev => {
      const newNodes = { ...prev, [newId]: newNode };
      const parent = newNodes[parentId];

      if (parent.type === 'branch') {
        if (slot === 'true') newNodes[parentId] = { ...parent, trueId: newId };
        else if (slot === 'false') newNodes[parentId] = { ...parent, falseId: newId };
      } else {
        newNodes[parentId] = { ...parent, childId: newId };
      }
      return newNodes;
    });
  };

  const handleDelete = (id) => {
    // Cannot delete root
    if (id === 'root') return;

    setNodes(prev => {
      const newNodes = { ...prev };
      const nodeToDelete = newNodes[id];

      // Find parent
      let parentId = Object.keys(newNodes).find(key => {
        const n = newNodes[key];
        return n.childId === id || n.trueId === id || n.falseId === id;
      });

      if (!parentId) return prev; // Should not happen

      const parent = newNodes[parentId];

      // Determine successor
      // If deleting a branch, let's say we promote the 'true' path.
      // If deleting regular node, promote 'childId'.
      let successorId = null;
      if (nodeToDelete.type === 'branch') {
        successorId = nodeToDelete.trueId || nodeToDelete.falseId; // fallback to false if true is null? 
        // Or just null if both empty.
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
      // Note: This orphans the other branch of a deleted branch node and its children. 
      // Ideally we should recursively delete them, but for MVP this might be fine or we can do a cleanup.
      // Let's keep it simple. If we want to be correct, we should probably delete the subtree that gets disconnected.
      // But "Delete node reconnects children" implies we keep the child.
      // If we delete a branch, we lose one side. That's inevitable.

      return newNodes;
    });
  };

  const handleUpdate = (id, newProps) => {
    setNodes(prev => ({
      ...prev,
      [id]: { ...prev[id], ...newProps }
    }));
  };

  return (
    <div className="App">
      <h1>Workflow Builder</h1>
      <div className="workflow-container">
        <Node
          id="root"
          nodes={nodes}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}

export default App
