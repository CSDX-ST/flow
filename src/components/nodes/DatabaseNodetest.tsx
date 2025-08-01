import { Handle, Position, useUpdateNodeInternals, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { Node, NodeProps } from '@xyflow/react';
export type DatabaseField = {
  name: string;
  type: string;
  text: string;
};

export type DatabaseNodeData = Node<{
  tableName: string;
  fields:  Array<{ name: string; type: string ,text:string}>
}>;

export const DatabaseNode = ({ id, data }: NodeProps<DatabaseNodeData>) => {
  const { updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const addField = useCallback(() => {
    const newField = {
      name: `field_${data.fields.length + 1}`,
      type: 'varchar',
      text: ''
    };

    const updatedFields = [...data.fields, newField];

    updateNodeData(id, { fields: updatedFields });
    updateNodeInternals(id);
  }, [data.fields, id, updateNodeData, updateNodeInternals]);

  const updateFieldType = useCallback((index: number, newText: string) => {
    const updatedFields = data.fields.map((field, i) =>
      i === index ? { ...field, text: newText } : field
    );

    updateNodeData(id, { fields: updatedFields });
  }, [data.fields, id, updateNodeData]);

  return (
    <div className="database-node">
      <div className="table-header">
        <div className="table-name">{data.tableName}</div>
      </div>

      <div className="fields-container">
        {data.fields.map((field, index) => (
          <div key={index} className="field-row">
            <div className="field-name">{field.name}</div>
            <div className="field-type">
              <input
                className="field-input nodrag"
                placeholder={field.type}
                value={field.text || ''}
                onChange={(e) => updateFieldType(index, e.target.value)}
              />
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={`source-${index}`}

              style={{ top: `${15}px` }} // 调整手柄定位逻辑
            />
          </div>
        ))}
      </div>

      <button onClick={addField} className="add-field-btn">
        + Add Field
      </button>
    </div>
  );
};