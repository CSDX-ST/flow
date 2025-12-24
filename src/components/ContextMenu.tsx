import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddNode: () => void


}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onDuplicate,
  onDelete,
  onAddNode,

}) => (
    <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}

    >
      {/*<button onClick={onDuplicate}>复制节点</button>*/}
      <button onClick={onAddNode}>添加节点</button>
      {/*<button onClick={onDelete}>删除节点</button>*/}
      {/*<button onClick={onClose}>关闭</button>*/}
    </div>
);

export default ContextMenu;