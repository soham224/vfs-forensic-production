// import React, {useEffect, useState} from "react";
// import { Redirect, Switch, Route } from "react-router-dom";
// import {shallowEqual, useDispatch, useSelector} from "react-redux";
// import { Layout } from "../_metronic/layout";
// import BasePage from "./BasePage";
// import { Logout, AuthPage } from "./Admin/modules/Auth";
// import ErrorsPage from "./Admin/modules/ErrorsExamples/ErrorsPage";
// import Cookies from "universal-cookie";
//
// import ResultManagerBasePage from "./ResultManagerBasePage";
// import {
//   ADMIN_ROLE,
//   RESULT_MANAGER_ROLE,
// } from "../enums/constant";
// import AdminBasePage from "./AdminBasePage";
//
// export function Routes() {
//   const { isAuthorized = false, user } = useSelector(
//     ({ auth }) => ({
//       isAuthorized: auth.user?.id && new Cookies().get("access_token"),
//       user: auth.user
//     }),
//     shallowEqual
//   );
//
//   return (
//     <Switch>
//       {!isAuthorized && (
//         <Route>
//           <AuthPage />
//         </Route>
//       )}
//       <Route path="/error" component={ErrorsPage} />
//       <Route path="/logout" component={Logout} />
//       <Route path="/auth/login" component={AuthPage} />
//       <Redirect exact from="/" to="/auth/login" />
//
//       {!isAuthorized ? (
//         user?.company ? (
//           <Redirect to="/auth/user-registration" />
//         ) : (
//           <Redirect to="/auth/login" />
//         )
//       ) : (
//         <Layout>
//           {user?.roles[0].role === ADMIN_ROLE ? (
//             <AdminBasePage />
//           ) : user?.roles[0].role === RESULT_MANAGER_ROLE ? (
//             <ResultManagerBasePage />
//           ) : (
//             <BasePage />
//           )}
//         </Layout>
//       )}
//     </Switch>
//   );
// }



import React from "react";
import {Navigate, useRoutes} from "react-router-dom";
import {shallowEqual, useSelector} from "react-redux";
import {ADMIN_ROLE, RESULT_MANAGER_ROLE, SUPERVISOR_ROLE} from "../enums/constant"; // Adjust roles accordingly
import LoginRoutes from "./LoginRoutes";
import Cookies from "universal-cookie";
import adminBasePage from "./AdminBasePage";

function Router() {
    const {isAuthorized = false, user} = useSelector(
        ({auth}) => ({
            isAuthorized: auth.user?.id && new Cookies().get("access_token"),
            user: auth.user,
        }),
        shallowEqual
    );
    // Get the redirect path based on user role
    const getDashboardRoute = () => {
        if (!user) {
            return "/auth/login";
        }

        const role = user.roles[0]?.role;
        const overviewRoles = [ADMIN_ROLE, SUPERVISOR_ROLE];
        if (overviewRoles.includes(role)) {
            return "/admin/dashboard";
        } else if (role === RESULT_MANAGER_ROLE) {
            return "/violation";
        } else {
            // Fallback route for undefined roles
            return "/auth/login";
        }

    };


    return useRoutes([
        {
            path: "/",
            element: isAuthorized ? (
                <Navigate to={getDashboardRoute()} replace/>
            ) : (
                <Navigate to="/auth" replace/>
            )
        },
        LoginRoutes,
        ...adminBasePage,
    ]);
}

export default Router;
