// 声明 SVG 模块类型
declare module "*.svg" {
  import React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}