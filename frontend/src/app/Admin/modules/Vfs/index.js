import React from "react";
import {useSubheader} from "../../../../_metronic/layout";
import VfsManage from "./components/Investing Forensic/VfsManage";

export function Myvfs(){
    const subheader = useSubheader();
    subheader.setTitle("Visa Facilitation Services");

    return <VfsManage/>;
}