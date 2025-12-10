import React, {Suspense} from "react";
import {LayoutSplashScreen} from "../../../_metronic/layout";
import VfsResult from "../modules/Vfs/components/Result/VFSResult";


export default function VFSResultTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <VfsResult/>
        </Suspense>
    );
}
