"use client"



import type React from "react"
import { useCallback, useRef, useState, useEffect} from "react"
import "./App.css"
import HeaderMenu from "./components/Header/HeaderMenu";
// import SidebarMenu from "../src/components/Sidebar/SidebarMenu";
import ReactFlowApp from "./components/Reactflow/ReactFlowApp";

import { ToolbarProvider } from './components/ToolbarContext';

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
      <ToolbarProvider>
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
      </ToolbarProvider>
  )
}
