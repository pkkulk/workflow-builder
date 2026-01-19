import React from 'react';

/**
 * Node Component
 * Recursively renders the workflow tree.
 * Handles:
 * - Rendering different node shapes based on type
 * - Inline editing of labels
 * - Adding child nodes (popover menu)
 * - Deleting nodes
 */
const Node = ({ id, nodes, onAdd, onDelete, onUpdate }) => {
    const node = nodes[id];
    if (!node) return null;

    const handleLabelChange = (e) => {
        // Only update if changes were made
        if (node.label !== e.target.innerText) {
            onUpdate(id, { label: e.target.innerText });
        }
    };

    const renderAddButton = (slot = null) => (
        <div className="add-button-group">
            <button className="add-btn" title="Add Node">+</button>
            <div className="dropdown">
                <button title="Action" onClick={() => onAdd(id, 'action', slot)}>Action</button>
                <button title="Branch" onClick={() => onAdd(id, 'branch', slot)}>Branch</button>
                <button title="End" onClick={() => onAdd(id, 'end', slot)}>End</button>
            </div>
        </div>
    );

    return (
        <div className={`node-wrapper ${node.type}`}>
            <div className="node-content">
                <div
                    className="node-box"
                    contentEditable={node.type !== 'start' && node.type !== 'end'}
                    suppressContentEditableWarning={true}
                    onBlur={handleLabelChange}
                    title="Click to edit label"
                >
                    {node.label}
                </div>

                {node.type !== 'start' && node.type !== 'end' && (
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(id)}
                        title="Delete Node"
                    >×</button>
                )}
            </div>

            {/* Recursive Children Rendering */}
            {node.type === 'branch' ? (
                <div className="branch-children">
                    <div className="branch-path">
                        <div className="branch-label">True</div>
                        {node.trueId ? (
                            <Node
                                id={node.trueId}
                                nodes={nodes}
                                onAdd={onAdd}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        ) : renderAddButton('true')}
                    </div>
                    <div className="branch-path">
                        <div className="branch-label">False</div>
                        {node.falseId ? (
                            <Node
                                id={node.falseId}
                                nodes={nodes}
                                onAdd={onAdd}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        ) : renderAddButton('false')}
                    </div>
                </div>
            ) : (
                <div className="single-child">
                    {node.childId ? (
                        <Node
                            id={node.childId}
                            nodes={nodes}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                    ) : node.type !== 'end' ? (
                        renderAddButton()
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Node;
