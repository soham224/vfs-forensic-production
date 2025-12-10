/* eslint-disable */
import React, {useMemo} from "react";
import objectPath from "object-path";
import {useHtmlClassService} from "../../_core/MetronicLayout"

export function SubHeader() {
  const uiService = useHtmlClassService();


  const layoutProps = useMemo(() => {
    return {
      config: uiService.config,
      subheaderMobileToggle: objectPath.get(
          uiService.config,
          "subheader.mobile-toggle"
      ),
      subheaderCssClasses: uiService.getClasses("subheader", true),
      subheaderContainerCssClasses: uiService.getClasses(
          "subheader_container",
          true
      )
    };
  }, [uiService]);
/*

  useLayoutEffect(() => {
    // eslint-disable-next-line
  }, [location.pathname]);

  // Do not remove this useEffect, need from update title/breadcrumbs outside (from the page)
  useEffect(() => {
  }, [subheader]);
*/

  return (
      <></>
      /*<div
          id="kt_subheader"
          className={`subheader py-2 py-lg-4   ${layoutProps.subheaderCssClasses}`}
      >
        <div
            className={`${layoutProps.subheaderContainerCssClasses} d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap`}
        >
          {/!* Info *!/}
          <div className="d-flex align-items-center flex-wrap mr-1">
            {layoutProps.subheaderMobileToggle && (
                <button
                    className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none"
                    id="kt_subheader_mobile_toggle"
                >
                  <span/>
                </button>
            )}

            <div className="d-flex align-items-baseline mr-5">
              <h5 className="text-dark font-weight-bold my-2 mr-5">
                <>
                  {subheader.title}
                </>
                {/!*<small></small>*!/}
              </h5>

            </div>


            <BreadCrumbs items={subheader.breadcrumbs}/>
          </div>

          {/!* Toolbar *!/}
          <div className="d-flex align-items-center">
            <span className="btn btn-light btn-sm font-weight-bold" id="kt_dashboard_daterangepicker"
               data-toggle="tooltip" title="Select dashboard daterange" data-placement="left">
              <span className="text-muted font-weight-bold mr-2" id="kt_dashboard_daterangepicker_title">Today</span>
              <span className="text-primary font-weight-bold"
                    id="kt_dashboard_daterangepicker_date">{new Date().toLocaleString('default', {
                month: 'short',
                day: 'numeric'
              })}</span>
            </span>
            <QuickActions/>
          </div>
        </div>
      </div>*/
  );
}
