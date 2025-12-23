// ToolbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义Context类型
interface ToolbarContextType {
  isToolbarEnabled: boolean;
  setIsToolbarEnabled: (value: boolean) => void;
}

// 创建Context（默认值需满足类型，实际使用时由Provider提供）
const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

// 自定义Provider组件，包裹需要共享状态的组件
export const ToolbarProvider = ({ children }: { children: ReactNode }) => {
  const [isToolbarEnabled, setIsToolbarEnabled] = useState(false);

  return (
    <ToolbarContext.Provider value={{ isToolbarEnabled, setIsToolbarEnabled }}>
      {children}
    </ToolbarContext.Provider>
  );
};

// 自定义Hook，简化Context获取（避免重复编写useContext和类型判断）
export const useToolbarContext = () => {
  const context = useContext(ToolbarContext);
  if (!context) {
      console.log('some error')
    throw new Error('useToolbarContext must be used within a ToolbarProvider');
  }
  return context;
};