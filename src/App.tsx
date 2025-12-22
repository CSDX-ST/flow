"use client"

/**
 * ReactFlow 应用主组件
 * Main ReactFlow Application Component
 *
 * Features:
 * - 响应式侧边栏导航 Responsive sidebar navigation
 * - 自定义圆形节点 Custom circle nodes
 * - 智能边连接系统 Smart edge connection system
 * - XY轴精确控制 Precise XY-axis control
 * - 三角形背景图案 Triangle background pattern
 * - 拖拽创建新节点 Drag to create new nodes
 */

import type React from "react"
import { useCallback, useRef, useState, useEffect} from "react"
import "./App.css"
import HeaderMenu from "./components/Header/HeaderMenu";
// import SidebarMenu from "../src/components/Sidebar/SidebarMenu";
import ReactFlowApp from "./components/Reactflow/ReactFlowApp";

// ReactFlow imports
import "@xyflow/react/dist/style.css"
import {
  ReactFlowProvider,
} from "@xyflow/react"

// TDesign UI imports
import { Layout,  } from "tdesign-react"

import { CollapsibleTabler } from "@/components/table_manager"

/**
 * 主布局组件
 * Main Layout Component
 */

export default function MainLayout() {
  const { Header, Content, Footer, Aside } = Layout
  return (
    <div >
      <Layout>
        <Header>
          <HeaderMenu />
        </Header>

        <Layout>

          {/*<Aside style={{ borderTop: "1px solid var(--component-border)" }}>*/}
          {/*  <SidebarMenu />*/}
          {/*</Aside>*/}

          <Layout>
            <Content style={{height: "calc(100vh - 58px)", overflow: "auto"}}>


              <div className="w-full h-full flex">
                {/*<CollapsibleTabler/>*/}
                <div className="flex-1 relative">
                  <ReactFlowProvider><ReactFlowApp/></ReactFlowProvider>
                </div>
              </div>


            </Content>

            <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
