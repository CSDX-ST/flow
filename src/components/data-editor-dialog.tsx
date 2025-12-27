"use client"

import React, { useState } from "react"
import type { Node } from "@xyflow/react"
import { Dialog, Button, Input, InputNumber } from 'tdesign-react'; // 补充引入Input（可选，替换原生input更美观）
import type { DialogProps } from 'tdesign-react';

interface EditNodeDialogProps {
  visible: boolean
  node: Node | null
  onSave: (newData: Record<string, any>) => void
  onCancel: () => void

}


const editableFields = [
  { key: "label", label: "标签", type: "text" },
  { key: "name", label: "工作名称", type: "text" },
  { key: "duration", label: "持续时间（天）", type: "number" },
  { key: "es", label: "最早开始时间", type: "number" },
  { key: "ef", label: "最早完成时间", type: "number" },
  { key: "ls", label: "最迟开始时间", type: "number" },
  { key: "lf", label: "最迟完成时间", type: "number" },
  { key: "totalFloat", label: "总时差", type: "number" },
  { key: "freeFloat", label: "自由时差", type: "number" },
]

export default function EditNodeDialog({ visible, node, onSave, onCancel }: EditNodeDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const onKeydownEsc: DialogProps['onEscKeydown'] = (context) => {
    // 如需自定义ESC逻辑，在此补充
  };

  const onClickOverlay: DialogProps['onOverlayClick'] = (context) => {
    // 如需自定义蒙层点击逻辑，在此补充
  };

  const onClickCloseBtn: DialogProps['onCloseBtnClick'] = (context) => {
    // 如需自定义关闭按钮逻辑，在此补充
  };

  // 封装保存逻辑，确保传递正确的表单数据
  const handleConfirm = () => {
    onSave(formData);
  };

  React.useEffect(() => {
    if (node && visible) {
      setFormData({ ...node.data })
    }
  }, [node, visible])


  return (
      <Dialog
          header="编辑节点数据" // 替换原自定义h3，使用Dialog内置头部
          visible={visible}
          confirmOnEnter
          onClose={onCancel}
          onConfirm={handleConfirm} // 绑定封装后的保存逻辑
          onCancel={onCancel}
          onEscKeydown={onKeydownEsc}
          onCloseBtnClick={onClickCloseBtn}
          onOverlayClick={onClickOverlay}
          width="400px" // 自定义弹窗宽度，适配表单内容
      >

          <div style={{
              padding: "0px 0",
              display: "flex", // 核心：使用 flex 替代 grid
              flexWrap: "wrap", // 自动换行，实现多列效果
              gap: "12px", // 可选：设置列之间、行之间的间距（替代单个元素的 margin）
              justifyContent: "space-between" // 可选：让两列均匀分布，左右对齐
          }}>
              {editableFields.map((field) => (
                  // 单个表单项容器：设置固定宽度（两列则约 49%，预留间距）
                  <div
                      key={field.key}
                      style={{
                          marginBottom: "12px",
                          width: "40%", // 核心：两列布局，每列宽度约 49%（避免 50% 因间距溢出）
                          boxSizing: "border-box" // 关键：让 padding/border 不占用额外宽度，防止布局错乱
                      }}
                  >
                      <label style={{
                          display: "block",
                          marginBottom: "4px",
                          fontSize: "14px",
                          color: "#333"
                      }}>
                          {field.label}：
                      </label>

                    {
                      field.type === "number" ? (
                        <InputNumber
                          value={formData[field.key] ?? undefined} // 数字组件推荐使用 undefined 作为空值默认值
                            min={0}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              [field.key]: value, // InputNumber 回调直接返回数字/undefined，无需手动转换
                            });
                          }}
                          placeholder={`请输入${field.label}`}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <Input
                          type={field.type as "text"} // 非 number 类型默认使用 text 类型（可根据实际需求扩展）
                          value={formData[field.key] ?? ""}
                          onChange={(value) => {
                              setFormData({
                                  ...formData,
                                  [field.key]: field.type === "number" ? (Number(value) || "") : value,
                              })
                          }}
                          placeholder={`请输入${field.label}`}
                          style={{width: "100%"}}
                        />
                      )
                    }
                  </div>
              ))}
          </div>

      </Dialog>
  )
}