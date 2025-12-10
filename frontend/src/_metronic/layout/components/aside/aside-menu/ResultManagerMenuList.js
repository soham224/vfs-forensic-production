/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";
import {Event, EventAvailable} from "@mui/icons-material";


export function ResultManagerMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = url => {
    return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
            "/my-results"
          )}`}
        >
          <NavLink className="menu-link" to={"/my-results"}>
            <span className="svg-icon menu-icon">
              <SVG
                title="Add Vioaltions"
                src={toAbsoluteUrl("/media/svg/icons/Code/Warning-2.svg")}
              />
            </span>
            <span className="menu-text">Violation</span>
          </NavLink>
        </li>

        <li
            className={`menu-item menu-item-rel ${getMenuItemActive(
                "/events"
            )}`}
        >
          <NavLink className="menu-link" to={"/events"}>
            <span className="svg-icon menu-icon">
              <Event />
            </span>
            <span className="menu-text">Events</span>
          </NavLink>
        </li>

        <li
            className={`menu-item menu-item-rel ${getMenuItemActive(
                "/eventsList"
            )}`}
        >
          <NavLink className="menu-link" to={"/eventsList"}>
            <span className="svg-icon menu-icon">
              <EventAvailable
                  title="View Events"
              />
            </span>
            <span className="menu-text">View Events</span>
          </NavLink>
        </li>
        <li
            className={`menu-item menu-item-rel ${getMenuItemActive(
                "/notificationAlert"
            )}`}
        >
          <NavLink className="menu-link" to={"/notificationAlert"}>
            <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Notifications1.svg")} />
            </span>
            <span className="menu-text">Notification</span>
          </NavLink>
        </li>

        <li
            className={`menu-item menu-item-rel ${getMenuItemActive(
                "/logo-results"
            )}`}
        >
          <NavLink className="menu-link" to={"/logo-results"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Add Vioaltions"
                  src={toAbsoluteUrl("/media/svg/icons/Code/Warning-1-circle.svg")}
              />
            </span>
            <span className="menu-text">Logo Violation</span>
          </NavLink>
        </li>

        {/*custom end*/}
      </ul>
    </>
  );
}
