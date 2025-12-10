import React from "react";
import {NoRecordsFoundMessage, PleaseWaitMessage,} from "../../../../../../_metronic/_helpers";
import BootstrapTable from "react-bootstrap-table-next";
import SweetAlert from "react-bootstrap-sweetalert";
import {warningToast} from "../../../../../../utils/ToastMessage";
import {DeleteForever} from "@mui/icons-material";


export function CameraDetailsTable({removeCameraData,cameraDetails, setCameraDetails, job}) {

    const [selectedCamera, setSelectedCamera] = React.useState({});
    const [alert, setAlert] = React.useState({
        success: false,
        danger: false,
        warning: false,
        show: false,
        showConfirm: true,
        showCancel: true,
        cancelText: 'Cancel'
    });

    const showAlert = (camera) => {
        setAlert({
            ...alert,
            show: true,
            danger: true,
            success: false,
            showConfirm: true,
            showCancel: true,
            cancelText: 'Cancel'
        });
        setSelectedCamera(camera);
    }

    const deleteSelectedCamera = async () => {
        try {

            removeCameraData(selectedCamera);
            setAlert({...alert, show: false});

        } catch (e) {
            setAlert({...alert, show: false});
            warningToast(e.message);
        }
    }

    const columns = [
        {
            dataField: "rtsp_url",
            text: "RTSP URL",
            style: {
                maxWidth: 250,
                wordBreak: 'break-all'
            }
        },
        {
            dataField: "camera_ip",
            text: "Camera IP",
        },
        {
            dataField: "camera_name",
            text: "Camera ",
        },
        {
            dataField: "process_fps",
            text: "Process FPS",
        },
        {
            dataField: "Actions",
            text: "Actions",
            formatter: (_, camera) => <DeleteForever id="deleteCameraBtn" onClick={() => showAlert(camera)}/>,
        }
    ]
    return cameraDetails?.length ?
        <div className="row">
            <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center table-horizontal-center overflow-hidden"
                bootstrap4
                remote
                keyField="id"
                data={cameraDetails || []}
                columns={columns}
                hideSelectColumn
            >
                <PleaseWaitMessage entities={cameraDetails}/>
                <NoRecordsFoundMessage entities={cameraDetails}/>
            </BootstrapTable>
            <SweetAlert
                success={alert.success}
                danger={alert.danger}
                warning={alert.warning}
                showCancel={alert.showCancel}
                showConfirm={alert.showConfirm}
                confirmBtnText="Delete Camera"
                cancelBtnText={alert.cancelText}
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="light"
                cancelBtnStyle={{color: "black"}}
                title={`${alert.success ? 'Camera Deleted Successfully' : 'Are you sure ? to delete camera'}`}
                onConfirm={deleteSelectedCamera}
                onCancel={() => setAlert({...alert, show: false})}
                show={alert.show}
                focusCancelBtn
            />
        </div> : null

}