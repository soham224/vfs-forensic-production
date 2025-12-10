import React, {useState} from "react";
import { Button, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {headerSortingClasses, sortCaret, toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";
import {FaDownload} from "react-icons/fa";
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import SVG from "react-inlinesvg";
import {CaseStatusClasses, formatStatus} from "../../Investing Forensic/VfsManage";
import jsPDF from "jspdf";
import * as actions from "../../../_redux/VFSAction";
import {useDispatch} from "react-redux";
import {Visibility} from "@mui/icons-material";
import ReportModal from "../../Investing Forensic/ReportDetailsModal";
import paginationFactory from "react-bootstrap-table2-paginator";
import CaseDetailsModal from "../../Investing Forensic/CaseDetailsModal";

function DrillDownResultCaseModal({
                                      modalShow,
                                      handleClose,
                                      modalData,
                                      currentImageIndex
                                  }) {
    const dispatch = useDispatch();
    const [showReportModal, setShowReportModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);

    const [reportModalDetails, setReportModalDetails] = useState([]);
    const [reportModalName, setReportModalName] = useState('');
    const paginationOptions = {
        sizePerPage: 5, // default
        sizePerPageList: [
            { text: '5', value: 5 },
            { text: '10', value: 10 },
            { text: '20', value: 20 }
        ],
        hideSizePerPage: false,
        alwaysShowAllBtns: true,
        showTotal: true
    };


    const handleCaseReportcChart = (cell , row) => {

        setShowReportModal(true);
        dispatch(actions.getSuspectJourneyByCaseIds(row.id)).then(response => {
            if (response) {
                setReportModalDetails(response);
                setReportModalName(`CASE-${row.case_id.split('-').pop()}`);
            }})


    };

    const closeReportModal = () => {
        setShowReportModal(false);
    };
    const columns = [
        {
            dataField: "case_id",
            text: "Case Id/File No.",
            sortCaret: (column, order) => {
                if (!order) return <span>&#x2195;</span>;
                return order === 'asc' ? <span>&#x2191;</span> : <span>&#x2193;</span>;
            },
            headerSortingClasses,
            style: { minWidth: "55px" },
            formatter: (cellContent, row) => {
                const lastSegment = row?.case_id.split('-').pop();
                return `VFS-CASE-${lastSegment}`;
            },
        },
        {
            dataField: "case_name",
            text: "Case Name",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: { minWidth: "55px" },
        },
        {
            dataField: "case_status",
            text: "Case Status",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: { minWidth: "55px" },
            formatter: (cellContent, row) => (
                <span className={CaseStatusClasses[row.case_status]}>
                    {formatStatus(row.case_status)}
                </span>
            ),
        },
        {
            dataField: "ai_model_details.model_details.model_name",
            text: "Case Report",
            sortCaret: sortCaret,
            headerSortingClasses,
            style: { minWidth: "55px" },
            formatter: (cellContent, row) => {
                return (
                    <>
                        {row?.case_report === "COMPLETED" ? (
                            <>
                                <a
                                    title="View Report"
                                    className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
                                    onClick={() => handleCaseReportcChart(cellContent, row)}
                                >
                                    <span className="svg-icon svg-icon-md svg-icon-light-inverse">
                                        <Visibility style={{ fontSize: "2rem" }} />
                                    </span>
                                </a>
                                <a
                                    title="Download Report"
                                    className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
                                    onClick={handleCaseReportDownload}
                                >
                                    <span className="svg-icon svg-icon-md svg-icon-light-inverse">
                                        <FaDownload style={{ fontSize: "2rem" }} />
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
            style: { minWidth: "55px" },
            formatter: (cellContent, row) => (
                <UncontrolledDropdown direction="left">
                    <DropdownToggle className="dropdown-toggle-btn">
                        <span className="svg-icon">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Other1.svg")} />
                        </span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-color">
                        <DropdownItem className="dropdown-item-custom" onClick={() => handleCaseNameClick(row)}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
                                 style={{ width: '16px', height: '16px' }}
                                 className="svg-icon" />
                            <span className={'ml-2'}>Details</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
        },
    ];

    const closeModal = () => {
        setShowModal(false);
        setSelectedCase(null);
    };

    const handleCaseReportDownload = () => {
        const doc = new jsPDF();
        doc.text("Case Report", 20, 20);
        doc.text("Suspect: Soham", 20, 30);
        doc.text("Event Details: Case 0001", 20, 40);
        doc.text("Status: In Progress", 20, 50);
        doc.save('case_report.pdf');
    };

    const convertToIST = (utcDate) => {
        const date = new Date(utcDate);
        // Use toLocaleString to format the date as per India Time (IST)
        return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    };

    const handleCaseNameClick = (caseData) => {
        setShowModal(true);
        dispatch(actions.fetchCaseById(caseData.id))
            .then((response) => {
                const uniqueCameraNames = [...new Set(response.cameras_rtsp.map(camera => camera.camera_name))];

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
                };

                setSelectedCase(data);
            })
            .catch((error) => {
                console.error("Error fetching case details:", error);
            });
    };

    return (
        <>
            <Modal
                show={modalShow}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="xl"
                centered
                style={{ maxHeight: "-webkit-fill-available" }}
                backdropClassName="custom-modal-backdrop" // Add a custom class
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData.length > 0 ? (
                        <div className={"table-wrapper"}>
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                bordered={false}
                                bootstrap4
                                keyField="id"
                                data={modalData}
                                columns={columns}
                                pagination={paginationFactory(paginationOptions)}
                            />
                        </div>
                    ) : (
                        <div className="text-center" style={{ fontSize: " 1.5rem", color: "#6c757d" }}>
                            No data Found
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose} variant="secondary" size={"sm"}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <ReportModal
                className="nested-modal"
                backdropClassName="nested-backdrop"
                show={showReportModal}
                onHide={closeReportModal}
                onDownload={handleCaseReportDownload}
                reportModalDetails={reportModalDetails}
                reportModalName={reportModalName}
            />
            <CaseDetailsModal
                className="nested-modal"
                backdropClassName="nested-backdrop"
                show={showModal}
                onHide={closeModal}
                selectedCase={selectedCase}
            />

        </>
    );
}

export default DrillDownResultCaseModal;
