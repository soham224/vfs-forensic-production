import React, {lazy} from "react";
import {Layout} from "../_metronic/layout";
import {ADMIN_ROLE, SUPERVISOR_ROLE} from "../enums/constant";
import {ErrorPage1} from "./Admin/modules/ErrorsExamples/ErrorPage1";
import ProtectedRoute from "./ProtectedRoute";
import Loadable from "../utils/Loadable";

// const DashboardPage = Loadable(
//     lazy( () =>  import("./Admin/modules/Vfs/components/Dashboard /Dashboard")));
// const InvestingForensicManage = Loadable(
//     lazy( () =>  import("./Admin/modules/Vfs/components/Investing Forensic/InvestingForensicManage")));
// const ResultPage = Loadable(
//     lazy( () =>  import("./Admin/modules/Vfs/components/Result/resultPage")));
// const CrowdDashboard = Loadable(
//     lazy( () =>  import("./Admin/modules/Vfs/components/Dashboard /CrowdDashboard")));
// const OccupancyDashboard = Loadable(
//     lazy( () =>  import("./Admin/modules/Vfs/components/Dashboard /OccupancyDashboard")));
// const ObjectLeftBehindDashboard = Loadable(
//     lazy( () =>  import("./Admin/modules/Vfs/components/Dashboard /ObjectLeftBehindDashboard")));
// const CameraPage = Loadable(
//     lazy( () =>  import("./Admin/pages/CameraPage")));


const VFSTabPage = Loadable(
    lazy( () =>  import("./Admin/pages/VFSTabPage")));
const InvestingForensicDashboard = Loadable(
    lazy( () =>  import("./Admin/modules/Vfs/components/Dashboard /InvestingForensicDashboard")));
const LicencePage = Loadable(
    lazy( () =>  import("./Admin/pages/LicencePage")));
const LocationPage = Loadable(lazy( () =>  import("./Admin/pages/LocationPage")))
const Logout = Loadable(
    lazy( () =>  import("./Admin/modules/Auth/pages/Logout")));



const protectedRoute = (role, component) => (
    <ProtectedRoute routeRole={role}>{component}</ProtectedRoute>
);

const routes = [
  // {
  //   path: "/dashboard",
  //   element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <DashboardPage/>)
  // },
  {
    path: "/admin/case",
    element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <VFSTabPage/>)
  },
  {
    path: "/admin/dashboard",
    element: protectedRoute([ADMIN_ROLE], <InvestingForensicDashboard/>)
  },

    // {
    //     path: "/admin/investingforensic/case",
    //     element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <VFSTabPage/>)
    // },
    // {
    //     path: "/admin/investingforensic/dashboard",
    //     element: protectedRoute([ADMIN_ROLE], <InvestingForensicDashboard/>)
    // },
  // {
  //   path: "/admin/usecase",
  //   element: protectedRoute([ADMIN_ROLE], <InvestingForensicManage/>)
  // },
  // {
  //   path: "/admin/crowd/result",
  //   element: protectedRoute([ADMIN_ROLE], <ResultPage/>)
  // },
  // {
  //   path: "/admin/crowd/dashboard",
  //   element: protectedRoute([ADMIN_ROLE], <CrowdDashboard/>)
  // },
  // {
  //   path: "/admin/occupancy/result",
  //   element: protectedRoute([ADMIN_ROLE], <ResultPage/>)
  // },
  // {
  //   path: "/admin/occupancy/dashboard",
  //   element: protectedRoute([ADMIN_ROLE], <OccupancyDashboard/>)
  // },{
  //   path: "/admin/objectleftbehind/result",
  //   element: protectedRoute([ADMIN_ROLE], <ResultPage/>)
  // },{
  //   path: "/admin/objectleftbehind/dashboard",
  //   element: protectedRoute([ADMIN_ROLE], <ObjectLeftBehindDashboard/>)
  // },

  //   {
  //   path: "/admin/camera/*",
  //   element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <CameraPage/>)
  // },
  {
    path: "/licence",
    element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <LicencePage/>)
  },
  {
    path: "/admin/locations/*",
    element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <LocationPage/>)
  },
  {
    path: "/logout",
    element: protectedRoute([ADMIN_ROLE,SUPERVISOR_ROLE], <Logout/>)
  },
];


const AdminBasePage = [
  {
    path: "/",
    element: <Layout/>,
    children: [
      ...routes.map((route, index) => ({...route, key: index})),
    ]
  },
  {
    path: "/error", // This catches all unmatched routes
    element: <ErrorPage1/>, // Your 404 component
    key: "not-found"
  },
];

export default AdminBasePage;
