// components/Header/HeaderMenu.tsx
import { Menu } from "tdesign-react";
import { SearchIcon, NotificationFilledIcon, HomeIcon } from "tdesign-icons-react";
import Logo from "../../assets/flow.svg";

const { HeadMenu, MenuItem } = Menu;

const HeaderMenu = () => {
  return (
    <HeadMenu
      value="item1"
      logo={<img width="136" src={Logo} alt="logo" />}
      operations={
        <div className="t-menu__operations">
          <SearchIcon className="t-menu__operations-icon" />
          <NotificationFilledIcon className="t-menu__operations-icon" />
          <HomeIcon className="t-menu__operations-icon" />
        </div>
      }
    >
      <MenuItem value="item1">Flow画布</MenuItem>
      <MenuItem value="item2">图框编辑</MenuItem>
      <MenuItem value="item3">模板库</MenuItem>
      <MenuItem value="item4" disabled>
        关于我们
      </MenuItem>
    </HeadMenu>
  );
};

export default HeaderMenu;