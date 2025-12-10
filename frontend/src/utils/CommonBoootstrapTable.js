import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
export const CommonBoootstrapTable = ({
  columns,
  data,
  sizePerPage,
  onTableChange,
  page,
  totalSize,
  sizePerPageChange,
  hideSizePerPage,
  alwaysShowAllBtns,
  hidePageListOnlyOnePage,
  sizePerPageList,
  showTotal
}) => {
  return (
    <BootstrapTable
      keyField="_id"
      remote
      classes="table table-head-custom table-vertical-center table-horizontal-center overflow-hidden"
      bootstrap4
      bordered={false}
      wrapperClasses="table-responsive"
      data={data}
      hideSizePerPage
      columns={columns}
      pagination={paginationFactory({
        sizePerPag: sizePerPage,
        page: page,
        totalSize: totalSize,
        showTotal: showTotal ? showTotal : true,
        sizePerPageList: sizePerPageList,
        hideSizePerPage: hideSizePerPage ? hideSizePerPage : false,
        alwaysShowAllBtns: alwaysShowAllBtns ? alwaysShowAllBtns : true,
        hidePageListOnlyOnePage: hidePageListOnlyOnePage
          ? hidePageListOnlyOnePage
          : true,
        onPageChange: onTableChange,
        onSizePerPageChange: sizePerPageChange
      })}
    />
  );
};
