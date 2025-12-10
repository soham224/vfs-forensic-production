import React from "react";
import { LicencesCard } from "./LicencesCard";
import { ADMIN_URL } from "../../../../../enums/constant";
import {LicencesUIProvider} from "./LicencesUIContext";


export function LicencesPage({ history }) {
  const licencesPageBaseUrl = ADMIN_URL + "/licence";

  const licencesUIEvents = {
    newLicencesBtnClick: () => {
      history.push(`${licencesPageBaseUrl}/new`);
    },
    changeStatusLicencesBtnClick: (id, status, isDeprecatedStatus) => {
      history.push(
        `${licencesPageBaseUrl}/${id}/${status}/${isDeprecatedStatus}/changeStatus`
      );
    },
    editLicencesBtnClick: (id) => {
      history.push(`${licencesPageBaseUrl}/${id}/edit`);
    },
  };

  return (
    <LicencesUIProvider licencesUIEvents={licencesUIEvents}>
      <LicencesCard />
    </LicencesUIProvider>
  );
}
