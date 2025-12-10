import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";
import { ADMIN_URL } from "../../../../../enums/constant";

export function UserAsideMenuList({ layoutProps }) {
  const location = useLocation();

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${
          !hasSubmenu && "menu-item-active"
        } menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>

          <>
              {/*begin::1 Level*/}
              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/dashboard"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/dashboard"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="View Dashboard"
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
              />
            </span>
                      <span className="menu-text">Dashboard</span>
                  </NavLink>
              </li>


              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      "/my-results"
                  )}`}
              >
                  <NavLink className="menu-link" to={"/my-results"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Add Results"
                  src={toAbsoluteUrl("/media/svg/icons/Files/Folder-check.svg")}
              />
            </span>
                      <span className="menu-text">Results</span>
                  </NavLink>
              </li>

              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/vfs"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/vfs"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Visa Facilitation Services"
                  src={toAbsoluteUrl("/media/svg/icons/Devices/Camera.svg")}
              />
            </span>
                      <span className="menu-text">VFS</span>
                  </NavLink>
              </li>
          </>

      </ul>
    </>
  );
}
