import {Routes, Route, useNavigate, useLocation} from "react-router-dom";
import React, {useState} from "react";
import {CamerasUIProvider} from "./CameraUIContext";
import {CameraCard} from "./CameraCard";
import CameraDetailsModal from "./camera-details-edit-dialog/CameraDetailsModal";
import ImportCameraModal from "./camera-details-edit-dialog/ImportCamera";
import moment from "moment";

export default function CameraPage() {
    const cameraPageBaseUrl = "/admin/camera";
    const navigate = useNavigate(); // Replace history.push()
    const location = useLocation(); // Hook to acc
    const [caseData, setCaseData] = useState({
        caseId: "",
        caseName: "",
        caseDescription: "",
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        cameras: [],
        uploadedImage: null,
    });
    const [selectedCameras, setSelectedCameras] = useState([]);
    const [suspects, setSuspects] = useState([{image: null, name: ""}]);

    const cameraUIEvents = {
        newCameraBtnClick: () => navigate(`${cameraPageBaseUrl}/new`),
        newCameraImportBtnClick: () => navigate(`${cameraPageBaseUrl}/import`),
        changeStatusCameraBtnClick: (id, status, isDeprecatedStatus) =>
            navigate(`${cameraPageBaseUrl}/${id}/${status}/${isDeprecatedStatus}/changeStatus`),
        editCameraBtnClick: (id) => navigate(`${cameraPageBaseUrl}/${id}/edit`),
    };


    const isModalRoute =
        location.pathname.endsWith("/new") || location.pathname.includes("/import");
    return (
        <CamerasUIProvider cameraUIEvents={cameraUIEvents}>
            {isModalRoute && (
                <Routes>
                    <Route
                        path="import"
                        element={
                            <ImportCameraModal
                                show={true}
                                caseModalOnHide={() => navigate(cameraPageBaseUrl)}
                                caseModalSubmit={() => navigate(cameraPageBaseUrl)}
                                caseData={caseData}
                                setCaseData={setCaseData}
                                suspects={suspects}
                                setSuspects={setSuspects}
                                selectedCameras={selectedCameras}
                                setSelectedCameras={setSelectedCameras}
                            />
                        }
                    />
                    <Route
                        path="new"
                        element={
                            <CameraDetailsModal
                                showCamera={true}
                                setCamera={() => navigate(cameraPageBaseUrl)}
                            />
                        }
                    />
                </Routes>
            )}
            <CameraCard/>
        </CamerasUIProvider>
    );
}
