import React from "react";
import {useSubheader} from "../../../_metronic/layout";
import Cameras from "../modules/Cameras";

const CameraPage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Camera");

  return <Cameras/>;
};

export default CameraPage;