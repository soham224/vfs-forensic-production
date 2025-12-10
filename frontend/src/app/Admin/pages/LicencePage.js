import React from "react";
import {useSubheader} from "../../../_metronic/layout";
import Licences from "../modules/Licences";

 const LicencePage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Licence");

  return <Licences/>;
};
export default LicencePage