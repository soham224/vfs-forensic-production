/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

import {
  ADMIN_ROLE,
  ADMIN_URL,
  RESULT_MANAGER_ROLE,
  SUPER_ADMIN_ROLE,
  SUPERVISOR_ROLE
} from "../../../../../enums/constant";
import Cookies from "universal-cookie";

export function BreadCrumbs({ items }) {
  const subscriptions = useSelector(state => {
    return state.subscription.subscriptions;
  });
  const modelname = useSelector(state => {
    return state.subscription.modelname;
  });

  const { user } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user?.id && new Cookies().get("access_token"),
      user: auth.user
    }),
    shallowEqual
  );

  if (!items || !items.length) {
    return "";
  }
  return (
    <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2">
      <li className="breadcrumb-item">
        {user?.roles[0].role === ADMIN_ROLE ? (
          subscriptions ? (
            <>
              <Link to={ADMIN_URL + "/dashboard"}>
                <i className="flaticon2-shelter text-muted icon-1x" />
              </Link>
            </>
          ) : (
            <>
              <Link to={ADMIN_URL + "/model-categories"}>
                <i className="flaticon2-shelter text-muted icon-1x" />
              </Link>
            </>
          )
        ) : user?.roles[0].role !== SUPER_ADMIN_ROLE &&
          user?.roles[0].role !== RESULT_MANAGER_ROLE ? (
          <>
            <Link to={ADMIN_URL + "/dashboard"}>
              <i className="flaticon2-shelter text-muted icon-1x" />
            </Link>
          </>
        ) : (
          <></>
        )}
      </li>
      {user?.roles[0].role !== SUPER_ADMIN_ROLE &&
        user?.roles[0].role !== RESULT_MANAGER_ROLE &&
        items.map((item, index) => (
          <li key={`bc${index}`} className="breadcrumb-item">
            {item.title === "Dashboard" &&
            user?.roles[0].role === ADMIN_ROLE ? (
              <Link to={ADMIN_URL + "/dashboard"}>{item.title}</Link>
            ) : item.title === "Dashboard" &&
              user?.roles[0].role === SUPERVISOR_ROLE ? (
              <Link to={ADMIN_URL + "/dashboard"}>{item.title}</Link>
            ) : item.title === "Results" ? (
              <Link to={"/my-results"}>{item.title}</Link>
            ) : item.title === "Live Preview" ? (
              <Link to={ADMIN_URL + "/cameras"}>{item.title}</Link>
            ) : item.title === "Locations" ? (
              <Link to={ADMIN_URL + "/locations"}>{item.title}</Link>
            ) : item.title === "Supervisor" ? (
              <Link to={ADMIN_URL + "/addSupervisor"}>{item.title}</Link>
            ) : item.title === "Employees" ? (
              <Link to={ADMIN_URL + "/employee"}>{item.title}</Link>
            ) : item.title === "Attendance" &&
              user?.roles[0].role === "admin" ? (
              <Link to={ADMIN_URL + "/attendance"}>{item.title}</Link>
            ) : item.title === "Attendance" &&
              user?.roles[0].role === "supervisor" ? (
              <Link to={"/attendance"}>{item.title}</Link>
            ) : item.title === "Violation" &&
              user?.roles[0].role === "admin" ? (
              <Link to={ADMIN_URL + "/violation"}>{item.title}</Link>
            ) : item.title === "Violation" &&
              user?.roles[0].role === "supervisor" ? (
              <Link to={"/violation"}>{item.title}</Link>
            ) : item.title === "Marketplace" ? (
              <>
                <Link to={ADMIN_URL + "/model-categories"}>{item.title}</Link>
                {modelname ? (
                  <>
                    <li
                      key={`bc${index}`}
                      className="breadcrumb-item ml-1 mr-1"
                    ></li>
                    <span style={{ color: "#147b82" }}>{modelname}</span>
                  </>
                ) : null}
              </>
            ) : item.title === "Subscriptions" ? (
              <Link to={ADMIN_URL + "/subscriptions"}>{item.title}</Link>
            ) : item.title === "Feedbacks" ? (
              <Link to={"/feedbacks"}>{item.title}</Link>
            ) : item.title === "Feedbacks" ? (
              <Link to={"/feedbacks"}>{item.title}</Link>
            ) : item.title === "Complaints" ? (
              <Link to={"/complaints"}>{item.title}</Link>
            ) : item.title === "Notifications" ? (
              <Link to={"/allNotification"}>{item.title}</Link>
            ) : (
              <Link to={ADMIN_URL + "/dashboard"}>{item.title}</Link>
            )}
          </li>
        ))}
    </ul>
  );
}
