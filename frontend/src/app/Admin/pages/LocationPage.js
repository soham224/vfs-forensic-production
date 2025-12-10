import React from "react";
import {useSubheader} from "../../../_metronic/layout";
import Locations from "../modules/Locations";

const LocationPage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Location");

  return (<Locations/>);
};
export default LocationPage;
