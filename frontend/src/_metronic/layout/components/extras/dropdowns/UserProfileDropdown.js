/* eslint-disable */
import React, {useMemo} from "react";
import {Link, useNavigate} from "react-router-dom"; // Import useHistory hook
import Dropdown from "react-bootstrap/Dropdown";
import {shallowEqual, useSelector} from "react-redux";
import objectPath from "object-path";
import {useHtmlClassService} from "../../../_core/MetronicLayout";
import {DropdownTopbarItemToggler} from "../../../../_partials/dropdowns";
import {ExitToApp} from "@mui/icons-material";

export function UserProfileDropdown() {
  const {user} = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const navigate = useNavigate();

  const layoutProps = useMemo(() => {
    return {
      light:
          objectPath.get(uiService.config, "extras.user.dropdown.style") !==
          "light",
    };
  }, [uiService]);

  const {userRole} = useSelector(
      ({auth}) => ({
        userRole: auth.user?.roles?.length && auth.user.roles[0]?.role,
      }),
      shallowEqual
  );

  // Use the history hook

  // Handle sign-out functionality
  const handleSignOut = () => {
    // Redirect to the logout route
    navigate("/logout");
  };
  const handleExitClick = (e) => {
    e.stopPropagation();
    navigate('/admin/dashboard') // Navigate to the desired route
  };

  const hideExitRoutes = [
    "#/admin/investingforensic/dashboard",
    "#/admin/investingforensic/case",
    "#/admin/crowd/result",
    "#/admin/crowd/dashboard",
    "#/admin/occupancy/result",
    "#/admin/occupancy/dashboard",
    "#/admin/objectleftbehind/result",
    "#/admin/objectleftbehind/dashboard",
  ];

  // Check if current route matches any route in hideExitRoutes
  const isExitHidden = hideExitRoutes.includes(window.location.hash);
  return (
      <Dropdown drop="down" alignRight>
        <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="dropdown-toggle-user-profile"
        >
          {userRole !== "superadmin" && userRole !== "resultmanager" ? (
              <div>
                {isExitHidden && (
                    <span onClick={handleExitClick} style={{cursor: 'pointer'}} className={'mr-2'}>
                   <ExitToApp/> Exit
              </span>)}
                <span className="symbol symbol-35">

              <span
                  className="text-white symbol-label font-size-h5 font-weight-bold cursor-pointer"
                  style={{backgroundColor: "#147b82"}}
              >
                {user?.user_email[0]}
              </span>
            </span>
              </div>
          ) : (
              <div className="navi-footer px-8 py-5 text-right">
                <button
                    className="btn btn-light-primary font-weight-bold"
                    onClick={handleSignOut} // Call the handleSignOut function on click
                >
                  Sign Out
                </button>
              </div>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
            className="dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-md">
          <>
            {layoutProps.light && (
                <div className="d-flex align-items-center rounded-top">
                  <div className={"ml-5"}>
                    <div>
                      {userRole !== "superadmin" &&
                          userRole !== "resultmanager" &&
                          user.user_email}
                    </div>
                  </div>
                </div>
            )}
          </>

          <hr/>
          <div className="navi navi-spacer-x-0 ">
            <Link to="/licence" className="navi-item px-8 cursor-pointer">
              <div className="navi-link">
                <div className="navi-icon mr-2">
                  <i className="flaticon2-speaker text-danger"/>
                </div>
                <div className="navi-text">
                  <div className="font-weight-bold cursor-pointer">
                    Licence Details
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="navi-footer px-8 py-5 text-right">
            {/* Sign out button */}
            <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold"
                onClick={handleSignOut} // Sign out on button click
            >
              Sign Out
            </button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
  );
}
