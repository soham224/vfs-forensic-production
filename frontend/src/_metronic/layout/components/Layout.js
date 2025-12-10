import React, {useMemo} from "react";
import objectPath from "object-path";
import {useHtmlClassService} from "../_core/MetronicLayout";
import {Header} from "./header/Header";
import {HeaderMobile} from "./header-mobile/HeaderMobile";
import {Aside} from "./aside/Aside";
import {Footer} from "./footer/Footer";
import {LayoutInit} from "./LayoutInit";
import {SubHeader} from "./subheader/SubHeader";
import {QuickPanel} from "./extras/offcanvas/QuickPanel";
import {QuickUser} from "./extras/offcanvas/QuickUser";
import {ScrollTop} from "./extras/ScrollTop";
import {Outlet} from "react-router-dom";

export function Layout({children}) {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            layoutConfig: uiService.config,
            selfLayout: objectPath.get(uiService.config, "self.layout"),
            asideDisplay: objectPath.get(uiService.config, "aside.self.display"),
            subheaderDisplay: objectPath.get(uiService.config, "subheader.display"),
            desktopHeaderDisplay: objectPath.get(
                uiService.config,
                "header.self.fixed.desktop"
            ),
            contentCssClasses: uiService.getClasses("content", true),
            contentContainerClasses: uiService.getClasses("content_container", true),
            contentExtended: objectPath.get(uiService.config, "content.extended")
        };
    }, [uiService]);

    return layoutProps.selfLayout !== "blank" ? (
        <>
            <HeaderMobile/>
            <div className="d-flex flex-column flex-root">

                <div className="d-flex flex-row flex-column-fluid page">
                    {layoutProps.asideDisplay && (<Aside/>)}
                    <div className="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
                        <Header/>
                        <div
                            id="kt_content"
                            className={`content ${layoutProps.contentCssClasses} d-flex flex-column flex-column-fluid`}
                        >
                            {layoutProps.subheaderDisplay && <SubHeader/>}
                            {!layoutProps.contentExtended && (
                                <div className="d-flex flex-column-fluid">
                                    <div className={layoutProps.contentContainerClasses}>
                                        {children}
                                        <Outlet />
                                    </div>
                                </div>
                            )}

                            {layoutProps.contentExtended && {children}}
                        </div>

                        <Footer/>
                    </div>
                </div>
            </div>
            <QuickUser/>
            <QuickPanel/>
            <ScrollTop/>
            <LayoutInit/>
        </>
    ) : (
        <div className="d-flex flex-column flex-root">{children}</div>
    );
}
