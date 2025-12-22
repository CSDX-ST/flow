// components/Sidebar/SidebarMenu.tsx
import { Menu } from "tdesign-react";
import {
  ControlPlatformIcon,
  DashboardIcon,
  Edit1Icon,
  HomeIcon,
  MailIcon,
  PlayCircleIcon,
  PreciseMonitorIcon,
  RootListIcon,
  ServerIcon,
  UserCircleIcon,
} from "tdesign-icons-react";

const { MenuItem } = Menu;

const SidebarMenu = () => {
  const menuItems = [
    { value: "dashboard", icon: <DashboardIcon />, label: "仪表板" },
    { value: "resource", icon: <ServerIcon />, label: "资源" },
    { value: "root", icon: <RootListIcon />, label: "根目录" },
    { value: "control-platform", icon: <ControlPlatformIcon />, label: "控制平台" },
    { value: "precise-monitor", icon: <PreciseMonitorIcon />, label: "精确监控" },
    { value: "mail", icon: <MailIcon />, label: "邮件" },
    { value: "user-circle", icon: <UserCircleIcon />, label: "用户" },
    { value: "play-circle", icon: <PlayCircleIcon />, label: "播放" },
    { value: "edit1", icon: <Edit1Icon />, label: "编辑" },
  ];

  return (
    <Menu theme="light" value="dashboard" style={{ marginRight: 50, height: "100vh" }}>
      {menuItems.map((item) => (
        <MenuItem key={item.value} value={item.value} icon={item.icon}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default SidebarMenu;