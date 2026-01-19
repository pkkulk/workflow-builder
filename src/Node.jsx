import React from 'react';

const Node = ({ id, nodes, onAdd, onDelete, onUpdate }) => {
    const node = nodes[id];
    if (!node) return null;

    const handleLabelChange = (e) => {
        if (node.label !== e.target.innerText) {
            onUpdate(id, { label: e.target.innerText });
        }
    };

    const renderAddButton = (slot = null, isInsert = false) => (
        <div className={`add-button-group ${isInsert ? 'insert-mode' : ''}`}>
            {isInsert ? (
                <button className="add-btn insert-btn" title="Insert Node">+</button>
            ) : (
                <button className="add-btn" title="Add Node">+</button>
            )}
            <div className="dropdown">
                <button title="Action" onClick={() => onAdd(id, 'action', slot, isInsert)}>Action</button>
                <button title="Branch" onClick={() => onAdd(id, 'branch', slot, isInsert)}>Branch</button>
                <button title="End" onClick={() => onAdd(id, 'end', slot, isInsert)}>End</button>
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

            {node.type === 'branch' ? (
                <div className="branch-children">
                    <div className="branch-path">
                        <div className="branch-label">True</div>
                        {node.trueId ? (
                            <>
                                <div className="insert-trigger-container">
                                    {renderAddButton('true', true)}
                                </div>
                                <Node
                                    id={node.trueId}
                                    nodes={nodes}
                                    onAdd={onAdd}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                />
                            </>
                        ) : renderAddButton('true')}
                    </div>
                    <div className="branch-path">
                        <div className="branch-label">False</div>
                        {node.falseId ? (
                            <>
                                <div className="insert-trigger-container">
                                    {renderAddButton('false', true)}
                                </div>
                                <Node
                                    id={node.falseId}
                                    nodes={nodes}
                                    onAdd={onAdd}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                />
                            </>
                        ) : renderAddButton('false')}
                    </div>
                </div>
            ) : (
                <div className="single-child">
                    {node.childId ? (
                        <>
                            <div className="insert-trigger-container">
                                {renderAddButton(null, true)}
                            </div>
                            <Node
                                id={node.childId}
                                nodes={nodes}
                                onAdd={onAdd}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        </>
                    ) : node.type !== 'end' ? (
                        renderAddButton()
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Node;
