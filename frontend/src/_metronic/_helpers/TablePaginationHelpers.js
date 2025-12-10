/* Pagination Helprs */
import React from "react";
import {matchSorter} from "match-sorter";
import {entitiesSorter} from "./TableSortingHelpers";
import * as uiHelpers from "../../utils/UIHelpers";

export const getPagesCount = (totalSize, sizePerPage) => {
  return Math.ceil(totalSize / sizePerPage);
};

export const getPages = (page, pagesCount, paginationSize) => {
  const result = [];
  if (!page) {
    return result;
  }

  if (pagesCount === 1) {
    result.push(1);
    return result;
  }

  if (pagesCount < page) {
    return result;
  }

  if (pagesCount < paginationSize + 1) {
    for (let i = 1; i < pagesCount + 1; i++) {
      result.push(i);
    }
    return result;
  }

  if (page === 1) {
    for (let i = 1; i < paginationSize + 1; i++) {
      if (i < pagesCount) {
        result.push(i);
      }
    }
    return result;
  }

  if (page === pagesCount) {
    for (let i = pagesCount - paginationSize + 1; i <= pagesCount; i++) {
      if (i <= pagesCount) {
        result.push(i);
      }
    }
    return result;
  }

  const shiftCount = Math.floor(paginationSize / 2);
  if (shiftCount < 1) {
    result.push(page);
    return result;
  }

  //
  if (page < shiftCount + 2) {
    for (let i = 1; i < paginationSize + 1; i++) {
      result.push(i);
    }
    return result;
  }

  if (pagesCount - page < shiftCount + 2) {
    for (let i = pagesCount - paginationSize; i < pagesCount + 1; i++) {
      result.push(i);
    }
    return result;
  }

  for (let i = page - shiftCount; i < page; i++) {
    if (i > 0) {
      result.push(i);
    }
  }
  result.push(page);
  for (let i = page + 1; i < page + shiftCount + 1; i++) {
    if (i <= pagesCount) {
      result.push(i);
    }
  }

  return result;
};

export function getHandlerTableChange(setQueryParams) {
  return (type, {page, sizePerPage, sortField, sortOrder, data}) => {
    const pageNumber = page || 1;
    setQueryParams((prev) =>
        type === "sort"
            ? {...prev, sortOrder, sortField}
            : type === "pagination"
            ? {...prev, pageNumber, pageSize: sizePerPage}
            : prev
    );
  };
}

export function PleaseWaitMessage({entities}) {
  return <>{entities === null && <div>Please wait...</div>}</>;
}

export function NoRecordsFoundMessage({entities}) {
  const customersList = entities === null ? [] : entities;
  return (
      <>
        {customersList.length === 0 && entities !== null && (
            <div>No records found</div>
        )}
      </>
  );
}

export function getFilteredAndPaginatedEntities(entities, pageParams) {
  let {pageNumber, pageSize} = pageParams;
  const indexOfLast = pageNumber * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  return (entities || []).slice(indexOfFirst, indexOfLast);
}

export const entityFilter = (entities, searchStr, keys, filterParams, filteredEntitiesSetter) => {
  if (searchStr) {
    filteredEntitiesSetter(matchSorter(entities, searchStr, {keys}).sort(entitiesSorter(filterParams))
    );
  } else {
    if (entities)
      filteredEntitiesSetter(entities.slice().sort(entitiesSorter(filterParams)));
    else
      filteredEntitiesSetter(entities);
  }
  return getFilteredAndPaginatedEntities(entities, filterParams);
}

export const getPaginationOptions = (totalSize, pageParams) => ({
  custom: true,
  totalSize: totalSize || 0,
  sizePerPageList: uiHelpers.sizePerPageList,
  sizePerPage: pageParams.pageSize,
  page: pageParams.pageNumber
});
export const getNewPaginationOptions = (totalSize, pageParams ,pageSize , pageNumber) => (
 {
  custom: true,
  totalSize: totalSize || 0,
  sizePerPageList: pageParams,
  sizePerPage: pageSize,
  page: pageNumber
}
);

