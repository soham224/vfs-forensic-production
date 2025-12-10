import React from 'react';
import {useSubheader} from "../../../../../../_metronic/layout";
import ResultPage from "./resultPage";

function VfsResult() {
    const subheader = useSubheader();
    subheader.setTitle("Result Personal Details");

    return <ResultPage/>;
}

export default VfsResult;