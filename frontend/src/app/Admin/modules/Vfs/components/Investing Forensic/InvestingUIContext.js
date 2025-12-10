import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import {initialFilter} from "../../../../../../utils/UIHelpers";


const InvestingUIContext = createContext();

export function useInvestingUIContext() {
  return useContext(InvestingUIContext);
}

export function InvestingUIProvider({ investingUIEvents, children }) {
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
    openNewInvestingDialog: investingUIEvents.newInvestingBtnClick,
    openNewInvestingImport: investingUIEvents.newInvestingImportBtnClick,
  };

  return (
    <InvestingUIContext.Provider value={value}>
      {children}
    </InvestingUIContext.Provider>
  );
}
