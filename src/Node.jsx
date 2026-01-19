import React from 'react';

const Node = ({ id, nodes, onAdd, onDelete, onUpdate }) => {
    const node = nodes[id];
    if (!node) return null;

    const handleLabelChange = (e) => {
        onUpdate(id, { label: e.target.innerText });
    };

    const renderAddButton = (slot = null) => (
        <div className="add-button-group">
            <button className="add-btn" title="Add Node">+</button>
            <div className="dropdown">
                <button onClick={() => onAdd(id, 'action', slot)}>Action</button>
                <button onClick={() => onAdd(id, 'branch', slot)}>Branch</button>
                <button onClick={() => onAdd(id, 'end', slot)}>End</button>
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
                >
                    {node.label}
                </div>

                {node.type !== 'start' && node.type !== 'end' && (
                    <button className="delete-btn" onClick={() => onDelete(id)}>×</button>
                )}
            </div>

            {/* Children Rendering */}
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
