import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";


const CamerasUIContext = createContext();

export function useCameraUIContext() {
  return useContext(CamerasUIContext);
}

export function CamerasUIProvider({ cameraUIEvents, children }) {
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
    openNewCameraDialog: cameraUIEvents.newCameraBtnClick,
    openNewCameraImport: cameraUIEvents.newCameraImportBtnClick,
  };

  return (
    <CamerasUIContext.Provider value={value}>
      {children}
    </CamerasUIContext.Provider>
  );
}
