import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const LicencesUIContext = createContext();

export function useLicencesUIContext() {
  return useContext(LicencesUIContext);
}

export function LicencesUIProvider({ licencesUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const setQueryParams = useCallback(nextQueryParams => {
    setQueryParamsBase(prevQueryParams => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParams,
    openNewLicencesDialog: licencesUIEvents.newLicencesBtnClick,
    openEditLicencesDialog: licencesUIEvents.editLicencesBtnClick,
    openChangeStatusLicencesDialog:
      licencesUIEvents.changeStatusLicencesBtnClick
  };

  return (
    <LicencesUIContext.Provider value={value}>
      {children}
    </LicencesUIContext.Provider>
  );
}
