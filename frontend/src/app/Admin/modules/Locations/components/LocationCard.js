import React, {useEffect, useMemo, useRef, useState} from "react";
import {useLocationUIContext} from "./LocationUIContext";
import {SearchText} from "../../../../../utils/SearchText";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../_redux/LocationAction";
import {entityFilter} from "../../../../../_metronic/_helpers";
import * as columnFormatters from "./location-details-table/column-formatters";

export default function LocationCard() {
    const locationUIContext = useLocationUIContext();
    const dispatch = useDispatch();

    const locationUIProps = useMemo(
        () => ({
            ...locationUIContext, // Include all context properties
            newLocationButtonClick: locationUIContext.openNewLocationDialog,
        }),
        [locationUIContext]
    );

    const {currentState} = useSelector(
        (state) => ({currentState: state.location}),
        shallowEqual
    );

    useEffect(() => {
        dispatch(actions.fetchLocation());
    }, [locationUIProps.queryParams, dispatch]);

    const searchInput = useRef("");

    const {entities} = currentState;
    const [filterEntities, setFilterEntities] = useState(entities);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    useEffect(() => {
        setFilterEntities(entities); // Update filtered entities whenever `entities` changes
    }, [entities]);

    const filterLocation = (e) => {
        const searchStr = e?.target?.value || searchInput.current.value;
        const keys = ["id", "location_name"];
        entityFilter(
            entities || [],
            searchStr,
            keys,
            locationUIProps.queryParams,
            setFilterEntities
        );
        setCurrentPage(1); // Reset to first page after filtering
    };

    const totalPages = Math.ceil((filterEntities?.length || 0) / pageSize);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to first page after changing page size
    };

    // Paginate current items
    const paginatedItems = useMemo(() => {
        const startIdx = (currentPage - 1) * pageSize;
        return filterEntities?.slice(startIdx, startIdx + pageSize) || [];
    }, [filterEntities, currentPage, pageSize]);

    return (
        <Card
            className=""
            style={{
                width: "100%", // Full width by default
                // maxWidth: "1200px", // Optional: Set max width for larger screens
                margin: "auto", // Center the card horizontally
                height: "750px", // Fixed height
                display: "flex", // Flexbox to manage layout
                flexDirection: "column", // Ensure header, body, and footer are stacked
            }}
        >
            <CardHeader
                style={{
                    fontSize: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 20px", // Add padding for better spacing
                }}
            >
                Location Details
                <div className="d-flex justify-content-between align-items-center">
                    {entities.length > 0 && (
                        <SearchText reference={searchInput} onChangeHandler={filterLocation}/>)}
                    <button
                        type="button"
                        className="btn btn-primary ml-5"
                        onClick={locationUIProps.newLocationButtonClick}
                    >
                        Add Location
                    </button>
                </div>
            </CardHeader>

            <CardBody
                style={{
                    flex: 1, // Let the body grow to fill available space
                    maxHeight: "600px", // Limit the height of the body
                    overflowY: "auto", // Enable scrolling for overflowing content
                    padding: "20px", // Optional: Add padding for spacing
                    display: "flex", // Use flexbox for alignment
                    justifyContent: paginatedItems.length > 0 ? "flex-start" : "center", // Align items horizontally
                    alignItems: paginatedItems.length > 0 ? "flex-start" : "center", // Align items vertically
                    flexDirection: "column", // Ensure children are stacked
                }}
            >
                {paginatedItems.length > 0 ? (
                    <BootstrapTable
                        wrapperClasses="table-responsive"
                        bordered={false}
                        bootstrap4
                        keyField="id"
                        data={paginatedItems}
                        columns={[
                            {dataField: "location_name", text: "Location Name"},
                            {
                                dataField: "created_date", text: "Created Date",
                                formatter: (cell) => new Date(cell).toLocaleDateString() // Format the date
                            },
                            {
                                dataField: "updated_date", text: "Updated Date",
                                formatter: (cell) => new Date(cell).toLocaleDateString() // Format the date
                            }, {
                                dataField: "updated_date", text: "Updated Date",
                                formatter: (cell) => new Date(cell).toLocaleDateString() // Format the date
                            },
                            {
                                dataField: "action",
                                text: "Actions",
                                style: {
                                    minWidth: "150px"
                                },
                                formatter: columnFormatters.ActionsColumnFormatter,
                                formatExtraData: {
                                    openEditLocationDialog: locationUIProps.openEditLocationDialog
                                }
                            }
                        ]}
                        remote
                    />
                ) : <div className="text-center" style={{fontSize: "1.5rem", color: "#6c757d"}}>
                    No data Found
                </div>}

            </CardBody>

            <CardFooter
                style={{
                    height: "80px", // Fix footer height
                    display: "flex", // Flexbox for layout
                    justifyContent: "space-between", // Space items evenly
                    alignItems: "center", // Align items vertically
                    padding: "10px 20px", // Add spacing
                }}
            >
                {paginatedItems.length > 0 && (
                    <>
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {Array.from({length: totalPages}, (_, index) => index + 1).map(
                                    (pageNumber) => (
                                        <li
                                            key={pageNumber}
                                            className={`page-item ${
                                                currentPage === pageNumber ? "active" : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    )
                                )}
                                <li
                                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {/* Page Size Selector */}
                        <div className="d-flex align-items-center">
                            <span className="mr-2">Items per page:</span>
                            <select
                                className="form-control"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                style={{width: "80px"}}
                            >
                                <option value={15}>15</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>

    );
}
