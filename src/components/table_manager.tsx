"use client"


import React,{ useState,useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, Checkbox, Radio, Space, Tag ,Input, TagInput, InputAdornment} from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import type { TableProps } from 'tdesign-react';
import type {Node} from "@xyflow/react";

interface CollapsibleSidebarProps {

  children?: React.ReactNode
  defaultCollapsed?: boolean
  width?: string

  nodes: Node[]
  onAddNode: (type: string, position: { x: number; y: number }) => void
  onDeleteNode: (nodeId: string) => void
  onRenameNode: (nodeId: string, newLabel: string) => void

}

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


type SizeEnum = 'small' | 'medium' | 'large';


const classStyles = `
<style>
.t-demo__style .t-table .custom-third-class-name > td {
  color: green;
  font-weight: bold;
}

.t-demo__style .t-table td.last-column-class-name {
  color: orange;
  /*font-weight: bold;*/
}

.custom-header-classcustom-cell-class-name {
  color: blue;
  font-size: 18px;
  font-weight: bold;
}
.custom-header-class.custom-header-class {
  background-color: #f1f9ff !important;
  font-weight: bold !important;
  font-family: "DengXian", "等线", sans-serif!important;
  color: #000000 !important;
}



</style>
`;

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

export function CollapsibleTabler({ children, defaultCollapsed = true, width = "w-128",nodes, onAddNode, onDeleteNode, onRenameNode }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const [stripe, setStripe] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [hover, setHover] = useState(true);
  const [tableLayout, setTableLayout] = useState(true);
  const [size, setSize] = useState<SizeEnum>('small');
  const [showHeader, setShowHeader] = useState(true);

  // 管理当前正在编辑的节点ID
  const [editingNode, setEditingNode] = useState<string | null>(null)
  // 管理编辑框中的节点标签文本
  const [editLabel, setEditLabel] = useState("")
  // 管理节点列表是否折叠的状态

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  // <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
  const table = (
      <div style={{margin: '0px 0',height: '80vh',}}>
        <Table
            style={{ height: '100%' ,width:'485px'}}
          data={nodes}

            columns={[
            {colKey: 'id', title: 'id', width: '50',thClassName:"custom-header-class"},
            {colKey: 'type', title: '类型',className: () => 'classcustom-cell-class-name',thClassName:"custom-header-class"},
            {colKey: 'position.x', title: 'position.x', ellipsis: true,thClassName:"custom-header-class"},
            {colKey: 'position.y', title: 'position.y' ,thClassName:"custom-header-class"},
            {colKey: 'data.label', title: '权值' ,thClassName:"custom-header-class"},
          ]}

          // columns={[
          //   { colKey: 'applicant', title: '申请人', width: '100' },
          //   {
          //     colKey: 'status',
          //     title: '申请状态',
          //     // cell: ({ row }) => (
          //     //   <Tag
          //     //     shape="round"
          //     //     theme={statusNameListMap[row.status].theme}
          //     //     variant="light-outline"
          //     //     icon={statusNameListMap[row.status].icon}
          //     //   >
          //     //     {statusNameListMap[row.status].label}
          //     //   </Tag>
          //     // ),
          //   },
          //   { colKey: 'channel', title: '签署方式',     cell: ({ row }) => (
          //         <span style={{color: '#0c7eec', }}>{row.channel}</span>
          //     ),
          //   },
          //   {colKey: 'detail.email', title: '邮箱地址', ellipsis: true},
          //   { colKey: 'createTime', title: '申请时间' },
          // ]}
          rowKey="index"
          verticalAlign="top"
          size={size}
          bordered={bordered}
          hover={hover}
          stripe={stripe}
          showHeader={showHeader}
          tableLayout={tableLayout ? 'auto' : 'fixed'}
          rowClassName={({ rowIndex }) => `${rowIndex}-class`}
          cellEmptyContent={'-'}
          resizable
          table-layout: fixed
          maxHeight="100%"

          // 有手柄列的行拖拽
          // dragSort='row-handler'

          // 分页配置
          // 与pagination对齐
          // pagination={{
          //   defaultCurrent: 2,
          //   defaultPageSize: 10,
          //   total,
          //   showJumper: true,
          //   onChange(pageInfo) {
          //     console.log(pageInfo, 'onChange pageInfo');
          //   },
          //   onCurrentChange(current, pageInfo) {
          //     console.log(current, pageInfo, 'onCurrentChange current');
          //   },
          //   onPageSizeChange(size, pageInfo) {
          //     console.log(size, pageInfo, 'onPageSizeChange size');
          //   },
          // }}
          onPageChange={(pageInfo) => {
            console.log(pageInfo, 'onPageChange');
          }}
          onRowClick={({ row, index, e }) => {
            console.log('onRowClick', { row, index, e });
          }}
        />
      </div>

  );

  return (
    <div
      className={`relative h-full bg-background border-r border-border border-gray-300 transition-all duration-300 z-10 ${
        isCollapsed ? "w-0" : width
      }`}
    >
      {/* Toggle Button */}
      {isCollapsed ?
        <Button
            variant="default"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-14 top-4 z-10 p-0 shadow-sm hover:bg-gray-100 rounded-md w-10 h-10 bg-gray-50"
          >
            {isCollapsed ? <ChevronRight className="w-10 h-10" /> : <ChevronLeft className="w-10 h-10" />}
          </Button>
          :null
        }


      {/* Sidebar Content */}
      <div
        className={`h-full p-4 transition-opacity duration-300 z-100 bg-white ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {isCollapsed ?
          null:<Button
            variant="default"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-2 top-4 z-10 p-0 shadow-sm hover:shadow-md hover:bg-gray-100 rounded-md w-10 h-10 bg-white"
          >
            {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="h-6 w-6" />}
          </Button>
          }

        {children || <div className="text-sm text-muted-foreground z-10">
            <Space direction="vertical">

              <InputAdornment prepend="项目名称" style={{ color: '#e51f1f', fontSize: '15px',width:'400px'}}>
                <Input />
              </InputAdornment>

            {/*<RadioGroup value={size} variant="default-filled" onChange={(size: SizeEnum) => setSize(size)}>*/}
            {/*  <RadioButton value="small">小尺寸</RadioButton>*/}
            {/*  <RadioButton value="medium">中尺寸</RadioButton>*/}
            {/*  <RadioButton value="large">大尺寸</RadioButton>*/}
            {/*</RadioGroup>*/}

            {/*<Space>*/}
            {/*  <Checkbox checked={stripe} value={stripe} onChange={setStripe}>*/}
            {/*    显示斑马纹*/}
            {/*  </Checkbox>*/}
            {/*  <Checkbox checked={bordered} value={bordered} onChange={setBordered}>*/}
            {/*    显示表格边框*/}
            {/*  </Checkbox>*/}
            {/*  <Checkbox checked={hover} value={hover} onChange={setHover}>*/}
            {/*    显示悬浮效果*/}
            {/*  </Checkbox>*/}
            {/*  <Checkbox checked={tableLayout} value={tableLayout} onChange={setTableLayout}>*/}
            {/*    宽度自适应*/}
            {/*  </Checkbox>*/}
            {/*  <Checkbox checked={showHeader} value={showHeader} onChange={setShowHeader}>*/}
            {/*    显示表头*/}
            {/*  </Checkbox>*/}
            {/*</Space>*/}

            <div className={`transition-opacity duration-10000 `}>
              {isCollapsed ? null : table }
            </div>

          </Space>
          <a> Sidebar content goes here</a>
        </div>}
      </div>

      {/* Collapsed State Indicator */}
      {isCollapsed && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 rotate-90 text-xs text-muted-foreground whitespace-nowrap">

        </div>
      )}
    </div>
  )
}
