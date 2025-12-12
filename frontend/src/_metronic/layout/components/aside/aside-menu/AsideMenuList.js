import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";
import { ADMIN_URL } from "../../../../../enums/constant";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();

  const getMenuItemActive = (url) => {
     return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  const getFormattedTitle = () => {
    const path = location?.pathname;
    if (!path) return 'Default Title';

    // Split the path into parts
    const parts = path.split('/').filter(Boolean); // Remove empty parts
    const secondLastPart = parts[parts.length - 2]; // Get second last part
    let pageTitle = '';

    if (secondLastPart === 'crowd') {
      pageTitle = 'crowd';
    } else if (secondLastPart === 'occupancy') {
      pageTitle = 'occupancy';
    } else if (secondLastPart === 'objectleftbehind') {
      pageTitle = 'objectleftbehind';
    } else if (secondLastPart === 'investingforensic') {
      pageTitle = 'investingforensic';
    }else {
      pageTitle = parts[parts.length - 1]
    }

    return pageTitle || 'Default Title';
  };

  return (
    <>
      {/*{getFormattedTitle() === 'crowd' ? (*/}
      {/*    <ul className={`menu-nav ${layoutProps.ulClasses}`}>*/}

      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/crowd/dashboard"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/crowd/dashboard"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Dashboard</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}


      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/crowd/result"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/crowd/result"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/Media/Equalizer.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Result</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}

      {/*    </ul>*/}

      {/*) :getFormattedTitle() === 'occupancy' ? (*/}
      {/*    <ul className={`menu-nav ${layoutProps.ulClasses}`}>*/}

      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/occupancy/dashboard"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/occupancy/dashboard"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Dashboard</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}


      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/occupancy/result"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/occupancy/result"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/Media/Equalizer.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Result</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}

      {/*    </ul>*/}
      {/*):getFormattedTitle() === 'objectleftbehind' ? (*/}
      {/*    <ul className={`menu-nav ${layoutProps.ulClasses}`}>*/}

      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/objectleftbehind/dashboard"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/objectleftbehind/dashboard"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Dashboard</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}


      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/objectleftbehind/result"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/objectleftbehind/result"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/Media/Equalizer.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Result</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}

      {/*    </ul>*/}
      {/*) :getFormattedTitle() === 'investingforensic' ? (*/}
      {/*    <ul className={`menu-nav ${layoutProps.ulClasses}`}>*/}

      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/investingforensic/dashboard"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/investingforensic/dashboard"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Dashboard</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}


      {/*      <li*/}
      {/*          className={`menu-item menu-item-rel ${getMenuItemActive(*/}
      {/*              ADMIN_URL + "/investingforensic/case"*/}
      {/*          )}`}*/}
      {/*      >*/}
      {/*        <NavLink className="menu-link" to={ADMIN_URL + "/investingforensic/case"}>*/}
      {/*      <span className="svg-icon menu-icon">*/}
      {/*        <SVG*/}
      {/*            title="Visa Facilitation Services"*/}
      {/*            src={toAbsoluteUrl("/media/svg/icons/Code/case.svg")}*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*          <span className="menu-text">Case</span>*/}
      {/*        </NavLink>*/}
      {/*      </li>*/}

      {/*    </ul>*/}
      {/*):(*/}
          <ul className={`menu-nav ${layoutProps.ulClasses}`}>

            {/*<li*/}
            {/*    className={`menu-item menu-item-rel ${getMenuItemActive(*/}
            {/*        ADMIN_URL + "/usecase"*/}
            {/*    )}`}*/}
            {/*>*/}
            {/*  <NavLink className="menu-link" to={ADMIN_URL + "/usecase"}>*/}
            {/*<span className="svg-icon menu-icon">*/}
            {/*  <SVG*/}
            {/*      title="Visa Facilitation Services"*/}
            {/*      src={toAbsoluteUrl("/media/svg/icons/Code/case.svg")}*/}
            {/*  />*/}
            {/*</span>*/}
            {/*    <span className="menu-text">Usecase</span>*/}
            {/*  </NavLink>*/}
            {/*</li>*/}


              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/dashboard"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/dashboard"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Visa Facilitation Services"
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
              />
            </span>
                      <span className="menu-text">Dashboard</span>
                  </NavLink>
              </li>

              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/locations"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/locations"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Add Locations"
                  src={toAbsoluteUrl("/media/svg/icons/Home/Building.svg")}
              />
            </span>
                      <span className="menu-text">Locations</span>
                  </NavLink>
              </li>

              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/case"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/case"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Visa Facilitation Services"
                  src={toAbsoluteUrl("/media/svg/icons/Code/case.svg")}
              />
            </span>
                      <span className="menu-text">Case</span>
                  </NavLink>
              </li>



            {/*<li*/}
            {/*    className={`menu-item menu-item-rel ${getMenuItemActive(*/}
            {/*        "/dashboard"*/}
            {/*    )}`}*/}
            {/*>*/}
            {/*  <NavLink className="menu-link" to={"/dashboard"}>*/}
            {/*<span className="svg-icon menu-icon">*/}
            {/*  <SVG*/}
            {/*      title="Visa Facilitation Services"*/}
            {/*      src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}*/}
            {/*  />*/}
            {/*</span>*/}
            {/*    <span className="menu-text">Dashboard</span>*/}
            {/*  </NavLink>*/}
            {/*</li>*/}



            {/*<li*/}
            {/*    className={`menu-item menu-item-rel ${getMenuItemActive(*/}
            {/*        ADMIN_URL + "/camera"*/}
            {/*    )}`}*/}
            {/*>*/}

            {/*  <NavLink className="menu-link" to={ADMIN_URL + "/camera"}>*/}
            {/*<span className="svg-icon menu-icon">*/}
            {/*  <SVG*/}
            {/*      title="Camera"*/}
            {/*      src={toAbsoluteUrl("/media/svg/icons/Devices/Camera.svg")}*/}
            {/*  />*/}
            {/*</span>*/}
            {/*    <span className="menu-text">Camera</span>*/}
            {/*  </NavLink>*/}
            {/*</li>*/}


          </ul>

      {/*// )*/}
      {/*// }*/}


    </>

  );
}
