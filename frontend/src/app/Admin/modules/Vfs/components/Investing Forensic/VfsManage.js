import React, {useEffect, useMemo, useRef, useState} from 'react';
import VfsModal from "./VfsWizardModal";
import moment from "moment";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import * as actions from "../../_redux/VFSAction";
import {
    Card,
    CardHeader,
    CardBody,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    CardFooter,
} from "reactstrap";
import {SearchText} from "../../../../../../utils/SearchText";
import {fetchCase} from "../../_redux/VFSAction";
import {headerSortingClasses, sortCaret, toAbsoluteUrl} from "../../../../../../_metronic/_helpers";
import {FaDownload} from "react-icons/fa";
import SVG from "react-inlinesvg";
import CaseDetailsModal from "./CaseDetailsModal";
import ReportModal from "./ReportDetailsModal";
import BootstrapTable from "react-bootstrap-table-next";
import CaseStatusModal from "./CaseStatusModal";
import {Visibility} from "@mui/icons-material";


function VfsManage() {
    const dispatch = useDispatch();
    const [caseModalShow, setCaseModalShow] = useState(false);
    const searchInput = useRef("");
    const [caseData, setCaseData] = useState({
        caseId: '',
        caseName: '',
        caseDescription: '',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        cameras: [],
        uploadedImage: null,
    });
    const [selectedCameras, setSelectedCameras] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [suspects, setSuspects] = useState([{image: null, name: ''}]);
    const [filterEntities, setFilterEntities] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [caseStatusShowModal, setCaseStatusShowModal] = useState(false);
    const [selectedCaseStatus, setSelectedCaseStatus] = useState(null);
    const [reportModalDetails, setReportModalDetails] = useState([]);
    const [reportModalName, setReportModalName] = useState('');
    const [downloadingRowId, setDownloadingRowId] = useState(null);

    useEffect(() => {
        const data = {
            "page_number": 1,
            "page_size": pageSize,
            "case_name": searchInput.current.value
        }
        dispatch(fetchCase(data));
    }, [dispatch, pageSize]);

    const {vfsAlldatashow} = useSelector(
        state => ({
            vfsAlldatashow: state.vfs?.entities || [],
        }),
        shallowEqual
    );

    const closeModal = () => {
        setShowModal(false);
        setSelectedCase(null);
    };


    const handleCaseReport = (row) => {
        setShowReportModal(true);
        dispatch(actions.getSuspectJourneyByCaseIds(row?.id)).then(response => {
            if (response) {
                setReportModalDetails(response);
                setReportModalName(`CASE-${row.case_id.split('-').pop()}`);
            }
        })


    };

    const formatCreatedDate = (dateString) => {
        if (!dateString) return "-";
        return moment(dateString).format("DD-MM-YYYY HH:mm:ss");
    };

    const closeReportModal = () => {
        setShowReportModal(false);
    };

    const getRowKey = (row) => row?.id ?? row?.case_id ?? row?.caseId;

    const handleCaseReportDownload = (row) => {
        console.log("handleCaseReportDownload row", row);
        // setDownloading(true); // start loader
        const rowKey = getRowKey(row);
        setDownloadingRowId(rowKey);

        dispatch(actions.getGenerateCaseReportByCaseIds(row?.id))
            .then((response) => {
                if (response) {
                    // If backend returns Base64 PDF string:
                    // const byteCharacters = atob(response.pdfData);
                    // const byteNumbers = new Array(byteCharacters.length);
                    // for (let i = 0; i < byteCharacters.length; i++) {
                    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
                    // }
                    // const byteArray = new Uint8Array(byteNumbers);
                    // const blob = new Blob([byteArray], { type: 'application/pdf' });

                    // If backend directly returns Blob:
                    const blob = new Blob([response], {type: 'application/pdf'});

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `case_report_${row?.id || 'report'}.pdf`;
                    link.click();

                    // Cleanup
                    window.URL.revokeObjectURL(url);

                }
            })
            .catch((error) => {
                console.error("Error generating PDF:", error);
            }).finally(() => {
            setDownloadingRowId(null);
        });
    };

    const tableData = useMemo(() => (
        filterEntities.map(entity => ({
            ...entity,
            __isDownloading: downloadingRowId !== null && getRowKey(entity) === downloadingRowId
        }))
    ), [filterEntities, downloadingRowId]);


    const handleCaseModalShow = () => {
        setCaseModalShow(true);
    };

    const handleCaseModalClose = () => {
        setCaseModalShow(false);
        setSelectedCameras([]);
    };
    const {user} = useSelector(
        ({auth}) => ({
            user: auth.user,
        }),
        shallowEqual
    );
    const convertToIST = (utcDate) => {
        const date = new Date(utcDate);
        // Use toLocaleString to format the date as per India Time (IST)
        return date.toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
    };


    const filterForensic = (e) => {
        const searchTerm = e.target.value;
        setCurrentPage(1)
        const data = {
            page_number: 1,
            page_size: pageSize,
            case_name: searchTerm,  // assuming your API supports a 'search' param
        };
        dispatch(fetchCase(data));
    };


    const handleCaseNameClick = (caseData) => {
        setShowModal(true);
        dispatch(actions.fetchCaseById(caseData.id))
            .then((response) => {
                const uniqueCameraNames = [...new Set(response.cameras_rtsp.map(camera => camera.camera_name))];
                const uniqueVideoNames = [...new Set(response.video_names.map(v => v))];

                const uniqueLocationNames = [
                    ...new Set(response.cameras_rtsp.map(camera => camera.location.location_name))
                ];

                // Convert unique locations into a string with semicolon separator
                const locationNamesString = uniqueLocationNames.join('; ');
                const data = {
                    caseId: response.case_id,
                    caseName: response.case_name,
                    locationName: locationNamesString,
                    createdDate: convertToIST(response.created_date),
                    caseDescription: response.case_description,
                    suspects: response.suspects,
                    cameras: uniqueCameraNames,
                    videos: uniqueVideoNames,
                };

                setSelectedCase(data);
            })
            .catch((error) => {
                console.error("Error fetching case details:", error);
            });
    };


    const handleCaseStatusClick = (caseData) => {
        setCaseStatusShowModal(true);
        setSelectedCaseStatus(caseData);
    }

    const caseModalSubmit = () => {

        setCaseModalShow(false);
        const caseDetails = {
            case_name: caseData.caseName,
            case_description: caseData.caseDescription,
            case_status: "OPEN",
            camera_ids: selectedCameras,
            video_ids: selectedVideos
        };

        // Create the case first
        dispatch(actions.createCase(caseDetails, user.id)).then(response => {
            if (response) {
                // Filter out suspects where the name or image is null/empty
                const validSuspects = suspects.filter(suspect => suspect.name && suspect.image);

                // If there are valid suspects, send them via multipart/form-data
                if (validSuspects.length > 0) {
                    const suspectPromises = validSuspects.map(suspect => {
                        const formData = new FormData();

                        // Append suspect name and camera_id
                        formData.append("suspect_name", suspect.name);
                        const caseId = response?.id; // Assuming the camera ID is related to the case
                        formData.append("case_id", caseId);

                        // Fetch the Blob from the blob URL
                        return fetch(suspect.image)
                            .then(res => res.blob())
                            .then(imageBlob => {
                                // Create a File from the Blob
                                const imageFile = new File([imageBlob], "image.jpg", {type: imageBlob.type});
                                formData.append("file", imageFile);
                                // Dispatch API call for the suspect
                                return dispatch(actions.addSuspects(formData));
                            })
                            .catch(error => {
                                console.error(`Error processing suspect "${suspect.name}":`, error);
                                throw error; // Ensure the error propagates for Promise.all to catch
                            });
                    });

                    // Wait for all suspect API calls to complete
                    Promise.allSettled(suspectPromises).then(results => {
                        const allSucceeded = results.every(result => result.status === "fulfilled");
                        const failedResults = results.filter(result => result.status === "rejected");

                        if (!allSucceeded) {
                            console.error("Some suspect calls failed:", failedResults);
                        }

                        // Fetch case data after all calls finish
                        const data = {
                            "page_number": 1,
                            "page_size": pageSize,
                            "case_name": searchInput.current.value
                        }
                        dispatch(fetchCase(data));
                    });
                } else {
                    // If no valid suspects, directly fetch case data
                    const data = {
                        "page_number": 1,
                        "page_size": pageSize,
                        "case_name": searchInput.current.value
                    }
                    dispatch(fetchCase(data));
                }
            }
        }).catch(error => {
            console.error("Error creating case:", error);
            const data = {
                "page_number": 1,
                "page_size": pageSize,
                "case_name": searchInput.current.value
            }
            dispatch(fetchCase(data));
        });
    };


    const columns = [
        {
            dataField: "index",
            text: "#",
            formatter: (cell, row, rowIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + (rowIndex + 1);

                // Format logic: min length = 4
                const numberStr =
                    globalIndex.toString().length >= 4
                        ? globalIndex.toString()
                        : globalIndex.toString().padStart(4, "0");

                return `CASE-${numberStr}`;
            },
            headerStyle: {width: "140px"}
        },
        {
            dataField: "case_id",
            text: "Case Id/File No.",
            sortCaret: (column, order) => {
                if (!order) return <span>&#x2195;</span>;
                return order === 'asc' ? <span>&#x2191;</span> : <span>&#x2193;</span>;
            },
            headerSortingClasses,
            style: {minWidth: "55px"},
            formatter: (cellContent, row) => {
                return `CASE-${row.case_id.split('-').pop()}`;
            },
        },
        {
            dataField: "created_date",
            text: "Created Date",
            sortCaret,
            headerSortingClasses,
            style: {minWidth: "140px"},
            formatter: (cellContent, row) => formatCreatedDate(row.created_date),
        },
        {
            dataField: "case_name",
            text: "Case Name",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {minWidth: "55px"},
        },
        {
            dataField: "case_status",
            text: "Case Status",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {minWidth: "55px"},
            formatter: (cellContent, row) => (
                <span className={CaseStatusClasses[row.case_status]}>
                    {formatStatus(row.case_status)}
                </span>
            ),
        },
        {
            dataField: "case_report",
            text: "Case Report",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {minWidth: "55px"},
            formatter: (cellContent, row) => {
                return (
                    <>
                        {row.case_report === "COMPLETED" ? (
                            <>
                                <a
                                    title="View Report"
                                    className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
                                    onClick={() => handleCaseReport(row)}
                                >
                                <span className="svg-icon svg-icon-md svg-icon-light-inverse">
                                    <Visibility style={{fontSize: "2rem"}}/>
                                </span>
                                </a>
                                <a
                                    title="Download Report"
                                    className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
                                    onClick={() => handleCaseReportDownload(row)}
                                    style={row.__isDownloading ? { pointerEvents: "none", opacity: 0.6 } : undefined}
                                >
                                  <span className="svg-icon svg-icon-md svg-icon-light-inverse">
                                    {row.__isDownloading ? (
                                        <span className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </span>
                                    ) : (
                                        <FaDownload style={{fontSize: "2rem"}}/>
                                    )}
                                  </span>
                                </a>

                            </>
                        ) : (
                            <span className={CaseStatusClasses['IN_PROGRESS']}>In Progress</span>
                        )}
                    </>
                );
            },
        },
        {
            dataField: "action",
            text: "Action",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {minWidth: "55px"},
            formatter: (cellContent, row) => (
                <UncontrolledDropdown direction="left">
                    <DropdownToggle className="dropdown-toggle-btn">
                        <span className="svg-icon">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Other1.svg")}/>
                        </span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-color">
                        <DropdownItem className="dropdown-item-custom" onClick={() => handleCaseNameClick(row)}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
                                 style={{width: '16px', height: '16px'}}
                                 className="svg-icon"/>
                            <span className={'ml-2'}>Details</span>
                        </DropdownItem>
                        <DropdownItem className="dropdown-item-custom" onClick={() => handleCaseStatusClick(row)}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
                                 style={{width: '16px', height: '16px'}}
                                 className="svg-icon"/>
                            <span className={'ml-2'}>Change Status</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
        },
    ];

    useEffect(() => {
        if (vfsAlldatashow.results) {
            setFilterEntities(vfsAlldatashow.results);
            // setTotalCount(vfsAlldatashow.pagination.total_count);
            setTotalPages(vfsAlldatashow.pagination.total_page);
        }
    }, [vfsAlldatashow]);

    const handlePageChange = (page) => {
        const data = {
            "page_number": page,
            "page_size": pageSize,
            "case_name": searchInput.current.value
        }
        setCurrentPage(page);
        dispatch(fetchCase(data));
    };

    const handlePageSizeChange = (e) => {
        const newPageSize = Number(e.target.value);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page on page size change
    };

    const closeStatusShowModal = () => {
        setCaseStatusShowModal(false)
    }

    return (
        <>
            <Card style={{
                width: "100%",
                margin: "auto",
                height: "750px",
                display: "flex",
                flexDirection: "column",
            }}>
                <CardHeader style={{
                    fontSize: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 20px",
                }}>
                    Investing Forensic
                    <div className="d-flex justify-content-between align-items-center">
                        {/*{filterEntities.length > 0 && (*/}
                        <SearchText reference={searchInput} onChangeHandler={filterForensic}/>
                        {/*)}*/}
                        <button
                            type="button"
                            className="btn btn-primary ml-5"
                            onClick={handleCaseModalShow}
                        >
                            New Case
                        </button>
                    </div>
                </CardHeader>

                <CardBody style={{
                    flex: 1,
                    maxHeight: "600px",
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    justifyContent: filterEntities.length > 0 ? "flex-start" : "center",
                    alignItems: filterEntities.length > 0 ? "flex-start" : "center",
                    flexDirection: "column",
                }}>
                    {filterEntities.length > 0 ? (
                        <BootstrapTable
                            wrapperClasses="table-responsive"
                            bordered={false}
                            bootstrap4
                            keyField="id"
                            data={tableData}
                            columns={columns}
                            remote
                        />
                    ) : (
                        <div className="text-center" style={{fontSize: " 1.5rem", color: "#6c757d"}}>
                            No data Found
                        </div>
                    )}
                </CardBody>

                <CardFooter style={{
                    height: "80px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 20px",
                }}>
                    {filterEntities.length > 0 && (
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
                                                className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
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
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>

                            <div className="d-flex align-items-center">
                                <span className="mr-2">Items per page:</span>
                                <select
                                    className="form-control"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    style={{width: "80px"}}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={75}>75</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </>
                    )}
                </CardFooter>
            </Card>

            <VfsModal
                caseData={caseData}
                setCaseData={setCaseData}
                caseModalShow={caseModalShow}
                caseModalOnHide={handleCaseModalClose}
                caseModalSubmit={caseModalSubmit}
                suspects={suspects}
                setSuspects={setSuspects}
                selectedCameras={selectedCameras}
                setSelectedCameras={setSelectedCameras}
                selectedVideos={selectedVideos}
                setSelectedVideos={setSelectedVideos}
                filterEntities={filterEntities}
            />


            <CaseDetailsModal
                show={showModal}
                onHide={closeModal}
                selectedCase={selectedCase}
            />

            <ReportModal
                show={showReportModal}
                onHide={closeReportModal}
                onDownload={handleCaseReportDownload}
                reportModalDetails={reportModalDetails}
                reportModalName={reportModalName}
            />

            <CaseStatusModal
                show={caseStatusShowModal}
                onHide={closeStatusShowModal}
                selectedCaseStatusDetails={selectedCaseStatus}
                pageNo={1}
                pageSize={pageSize}
            />

        </>
    );
}

export default VfsManage;

export const CaseStatusClasses = {
    RESOLVED: "label label-lg label-light-success label-inline",
    REOPENED: "label label-lg label-light-danger label-inline",
    OPEN: "label label-lg label-light-danger label-inline",
    IN_PROGRESS: "label label-lg label-light-info label-inline",
    ON_HOLD: "label label-lg label-light-primary label-inline",
    CLOSED: "label label-lg label-light-warning label-inline",
    PROCESSING: "label label-lg label-light-warning label-inline",
    PENDING: "label label-lg label-light-warning label-inline",
    COMPLETED: "label label-lg label-light-success label-inline",
};

export const formatStatus = (status) => {
    switch (status) {
        case 'RESOLVED':
            return 'Resolved';
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'PENDING':
            return 'Pending';
        case 'OPEN':
            return 'Open';
        case 'ON_HOLD':
            return 'On Hold';
        case 'CLOSED':
            return 'Closed';
        case 'PROCESSING':
            return 'Processing';
        case 'COMPLETED':
            return 'Completed';
        default:
            return 'Unknown';
    }
};