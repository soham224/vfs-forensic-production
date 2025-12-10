import React, {Suspense} from "react";
import {LayoutSplashScreen} from "../../../_metronic/layout";
import {Myvfs} from "../modules/Vfs";

export default function VFSTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <Myvfs/>
        </Suspense>
    );
}
