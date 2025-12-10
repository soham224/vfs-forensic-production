import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";

export function SuperAdminMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*custom start*/}

        {/*<li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/aiModel",
                        true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                    <NavLink
                        className="menu-link menu-toggle"
                        to="/aiModel"
                    >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
                        <span className="menu-text">AI Model</span>
                        <i className="menu-arrow" />
                    </NavLink>

                    <div className="menu-submenu ">
                        <i className="menu-arrow" />
                        <ul className="menu-subnav">
                            <li
                                className={`menu-item  ${getMenuItemActive(
                                    "/aiModel/add"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink
                                    className="menu-link"
                                    to="/aiModel/add"
                                >
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">Add</span>
                                </NavLink>
                            </li>

                            <li
                                className={`menu-item  ${getMenuItemActive(
                                    "/aiModel/view"
                                )}`}
                                aria-haspopup="true"
                            >
                                <NavLink
                                    className="menu-link"
                                    to="/aiModel/view"
                                >
                                    <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                    </i>
                                    <span className="menu-text">View</span>
                                </NavLink>
                            </li>

                        </ul>
                    </div>
                </li>*/}




        {/*old User page but this page no any filter , backendside paggination not handle */}

        {/*<li*/}
        {/*  className={`menu-item ${getMenuItemActive("/users", false)}`}*/}
        {/*  aria-haspopup="true"*/}
        {/*>*/}
        {/*  <NavLink className="menu-link" to="/users">*/}
        {/*    <span className="svg-icon menu-icon">*/}
        {/*      <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />*/}
        {/*    </span>*/}
        {/*    <span className="menu-text">Users</span>*/}
        {/*  </NavLink>*/}
        {/*</li>*/}


        {/*New User Page*/}

        <li
            className={`menu-item ${getMenuItemActive("/users/userPage", false)}`}
            aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/users/userPage">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">Users</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/device", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/device">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Devices/Display1.svg")}
              />
            </span>
            <span className="menu-text">Device</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/modelType", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/modelType">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Polygon.svg")} />
            </span>
            <span className="menu-text">Model Type</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive(
            "/frameworkDetails",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/frameworkDetails">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Target.svg")} />
            </span>
            <span className="menu-text">Framework Details</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/deploymentType", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/deploymentType">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Server.svg")} />
            </span>
            <span className="menu-text">Deployment Type</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive("/inferJobs", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/inferJobs">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Join-1.svg")} />
            </span>
            <span className="menu-text">Infer Jobs</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive(
            "/deploymentDetails",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/deploymentDetails">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Navigation/Sign-in.svg")}
              />
            </span>
            <span className="menu-text">Deployment Details</span>
          </NavLink>
        </li>

        <li
          className={`menu-item ${getMenuItemActive(
            "/deployedDetails",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/deployedDetails">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Weather/Cloud1.svg")} />
            </span>
            <span className="menu-text">Deployed Details</span>
          </NavLink>
        </li>





        <li
            className={`menu-item ${getMenuItemActive(
                "/NotificationSend",
                false
            )}`}
            aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/NotificationSend">
              <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Notifications1.svg")} />
            </span>
            <span className="menu-text">Notifcaiton Send</span>
          </NavLink>
        </li>

        {/*<li
                    className={`menu-item ${getMenuItemActive("/myResult", false)}`}
                    aria-haspopup="true"
                >
                    <NavLink className="menu-link" to="/myResult">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
            </span>
                        <span className="menu-text">My Result</span>
                    </NavLink>
                </li>*/}
        {/*custom end*/}
      </ul>
    </>
  );
}
