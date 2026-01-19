import { useState } from 'react'
import Node from './Node'
import './App.css'

function App() {
  const [nodes, setNodes] = useState({
    'root': { id: 'root', type: 'start', label: 'Start', childId: null },
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAdd = (parentId, childType, slot = null) => {
    const newId = generateId();
    const newNode = {
      id: newId,
      type: childType,
      label: childType.charAt(0).toUpperCase() + childType.slice(1),
      childId: null,
      trueId: null,
      falseId: null
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
    if (id === 'root') return;

    setNodes(prev => {
      const newNodes = { ...prev };
      const nodeToDelete = newNodes[id];

      let parentId = Object.keys(newNodes).find(key => {
        const n = newNodes[key];
        return n.childId === id || n.trueId === id || n.falseId === id;
      });

      if (!parentId) return prev;

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
