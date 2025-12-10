import React, {useEffect, useMemo, useRef, useState} from "react";
import {useCameraUIContext} from "./CameraUIContext";
import {SearchText} from "../../../../../utils/SearchText";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {Card, CardHeader, CardBody, CardFooter} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../_redux/CameraAction";
import {entityFilter, toAbsoluteUrl} from "../../../../../_metronic/_helpers";
import CameraRoiDialog from "./CameraRoiDialog";
import SVG from "react-inlinesvg";
import CameraUseCasemapping from "./CameraUseCasemapping";

export function CameraCard() {
    const cameraUIContext = useCameraUIContext();
    const dispatch = useDispatch();
    const [roiShowModal, setRoiShowModal] = useState(false);
    const [selectedCameraId, setSelectedCameraId] = useState(null);
    const [usecaseShowModal, setUsecaseShowModal] = useState(false);
    const [selectedUsecaseCameraId, setSelectedUsecaseCameraId] = useState(null);
    const [usecaseLoader ,setUsecaseLoader] = useState(false);
    const [usercaseOptions ,setUsercaseOptions] = useState([]);


    const cameraUIProps = useMemo(
        () => ({
            ...cameraUIContext,
            newCameraButtonClick: cameraUIContext.openNewCameraDialog,
            newCameraImportButtonClick: cameraUIContext.openNewCameraImport,
        }),
        [cameraUIContext]
    );

    const {currentState} = useSelector(
        (state) => ({currentState: state.camera}),
        shallowEqual
    );

    useEffect(() => {
        dispatch(actions.fetchCamera());
    }, [cameraUIProps.queryParams, dispatch]);

    const searchInput = useRef("");
    const {entities} = currentState;
    const [filterEntities, setFilterEntities] = useState(entities);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    useEffect(() => {
        setFilterEntities(entities);
    }, [entities]);

    const filterCamera = (e) => {
        const searchStr = e?.target?.value || searchInput.current.value;
        const keys = ["id", "camera_name"];
        entityFilter(entities || [], searchStr, keys, cameraUIProps.queryParams, setFilterEntities);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil((filterEntities?.length || 0) / pageSize);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const paginatedItems = useMemo(() => {
        const startIdx = (currentPage - 1) * pageSize;
        return filterEntities?.slice(startIdx, startIdx + pageSize) || [];
    }, [filterEntities, currentPage, pageSize]);

    const openUsecaseModal = (row) => {
        setSelectedUsecaseCameraId(row);
        setUsecaseShowModal(true);
    };
    const openRoiModal = (row) => {
        setSelectedCameraId(row);
        setRoiShowModal(true);
    };

    const onHide = () => {
        setRoiShowModal(false);
    };

    const onUsecaseHide = () => {
        setUsecaseShowModal(false);
    };

    useEffect(() => {
        setUsecaseLoader(true);
        dispatch(actions.getAllUsecaseTypes())
            .then((response) => {
                const formattedOptions = response.map((item) => ({
                    label: item.result_type, // Usecase name as label
                    value: item.id,         // Usecase ID as value
                }));

                setUsercaseOptions(formattedOptions);
                setUsecaseLoader(false);
            })
            .catch((error) => {
                setUsecaseLoader(false);
                console.error("Error fetching UsecaseTypes:", error);
            });
    },[])
    return (
        <>
            <Card className=""
                  style={{width: "100%", margin: "auto", height: "750px", display: "flex", flexDirection: "column"}}>
                <CardHeader style={{
                    fontSize: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 20px"
                }}>
                    Camera Details
                    <div className="d-flex justify-content-between align-items-center">
                        {entities.length > 0 &&
                            <SearchText reference={searchInput} onChangeHandler={filterCamera}/>}
                        <button type="button" className="btn btn-primary ml-5"
                                onClick={cameraUIProps.newCameraImportButtonClick}>Import Camera
                        </button>
                        <button type="button" className="btn btn-primary ml-2"
                                onClick={cameraUIProps.newCameraButtonClick}>Add Camera
                        </button>
                    </div>
                </CardHeader>

                <CardBody style={{
                    flex: 1,
                    maxHeight: "600px",
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {paginatedItems.length > 0 ? (
                        <BootstrapTable
                            wrapperClasses="table-responsive"
                            bordered={false}
                            bootstrap4
                            keyField="id"
                            data={paginatedItems}
                            columns={[
                                {dataField: "location.location_name", text: "Location Name"},
                                {dataField: "camera_name", text: "Camera Name"},
                                {
                                    dataField: "created_date",
                                    text: "Created Date",
                                    formatter: (cell) => new Date(cell).toLocaleDateString()
                                },
                                {
                                    dataField: "updated_date",
                                    text: "Updated Date",
                                    formatter: (cell) => new Date(cell).toLocaleDateString()
                                },
                                {
                                    dataField: "Usecase",
                                    text: "Usecase",
                                    style: {minWidth: "150px"},
                                    formatter: (cell ,row) => {
                                        return (
                                            <>
                                                <a
                                                    title="Roi For Camera"
                                                    className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                    onClick={() => openUsecaseModal(row)}
                                                >
                                                    <span className="svg-icon svg-icon-md svg-icon-primary">
                                                      <SVG
                                                          title="Edit Roi Camera Details"
                                                          src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
                                                      />
                                                    </span>
                                                </a>
                                            </>
                                        )
                                    }
                                },
                                {
                                    dataField: "roi",
                                    text: "Camera Roi",
                                    style: {minWidth: "150px"},
                                    formatter: (cell ,row) => {
                                        return (
                                            <>
                                                <a
                                                    title="Roi For Camera"
                                                    className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                    onClick={() => openRoiModal(row)}
                                                >
                                                    <span className="svg-icon svg-icon-md svg-icon-primary">
                                                      <SVG
                                                          title="Edit Roi Camera Details"
                                                          src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
                                                      />
                                                    </span>
                                                </a>
                                            </>
                                        )
                                    }
                                },
                            ]}
                            remote
                        />
                    ) : (
                        <div className="text-center" style={{fontSize: "1.5rem", color: "#6c757d"}}>No data Found</div>
                    )}
                </CardBody>

                <CardFooter style={{
                    height: "80px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 20px"
                }}>
                    {paginatedItems.length > 0 && (
                        <>
                            <nav>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button className="page-link"
                                                onClick={() => handlePageChange(currentPage - 1)}>Previous
                                        </button>
                                    </li>
                                    {Array.from({length: totalPages}, (_, index) => index + 1).map((pageNumber) => (
                                        <li key={pageNumber}
                                            className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                                            <button className="page-link"
                                                    onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}>Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </CardFooter>
            </Card>
            <CameraRoiDialog roiShowModal={roiShowModal}

                             onHide={onHide} camera={selectedCameraId}/>
            <CameraUseCasemapping usecaseShowModal={usecaseShowModal}
                                  usecaseLoader={usecaseLoader}
                                  usercaseOptions={usercaseOptions}
                                  onHide={onUsecaseHide} camera={selectedUsecaseCameraId}/>
        </>
    );
}
