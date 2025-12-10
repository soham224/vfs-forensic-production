import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment/moment";
import clsx from "clsx";
import './result_card.scss'
import Boundingbox from "image-bounding-box-custom";
import {CameraAlt, LocationOn} from "@mui/icons-material";

const AssignmentCard = ({ assignment, handleCardData, index }) => {
  const [copied, setCopied] = useState(false);

  const values = Object.values(assignment?.label_count);
  const totalCount = values.reduce((acc, curr) => acc + curr, 0);

  const handleClick = e => {
    // Check if the switch is clicked
    if (e.target.closest(".switch-container , .copy-container")) {
      return; // Do nothing if the switch is clicked
    }

    handleCardData(assignment, index);
  };

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
  };

  return (
      <div
          className="tusk_result-assignment-card cursor-pointer"
          onClick={handleClick}
      >
        <div
            className="tusk_result-image-section"
        >
          <Boundingbox
              className="row m-auto col-12 p-0 text-center"
              image={assignment?.file_url}
                  boxes={assignment?.bounding_box.detection.map((item) => ({
                    coord: [
                      item.location[0], // x1
                      item.location[1], // y1
                      item.location[2] - item.location[0], // width
                      item.location[3] - item.location[1]  // height
                    ],
                    // label: item.label
                  })) || []}
              options={{
                colors: {
                  normal: "red", selected: "red", unselected: "red"
                }, style: {
                  maxWidth: "100%",
                  maxHeight: "100vh",
                  margin: "auto",
                  width: 520,
                  color: "red",
                  height: 354
                }
              }}
          />
        </div>
        <div className="tusk_result-info-section">
          <div className="tusk_result-top-info">
            <div>
              <div className={"d-flex align-items-center"}>
                <div className={"tusk_result-count "}>
                  {/*{`#RST-${assignment?.id.split("-")[4].toUpperCase()}`}*/}
                </div>
                <span
                    className={`ms-1 example-copy copy-container ${clsx({
                      "example-copied": copied
                    })}`}
                    onClick={() => copyToClipboard(assignment?.id)}
                >
              </span>
              </div>

              <div className="font-size-lg me-1">
                {moment
                    .utc(assignment?.created_datetime)
                    .local()
                    .format("DD MMMM YYYY, HH:mm:ss")}
              </div>
            </div>
            <OverlayTrigger
                placement="top-start"
                overlay={
                  <Tooltip id="user-notification-tooltip ">
                    {Object.keys(assignment?.label_count).length > 0
                        ? Object.entries(assignment?.label_count)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                        : 0}
                  </Tooltip>
                }
            >
              <div className="tusk_result-count">{totalCount}</div>
            </OverlayTrigger>
          </div>
          <div className={"d-flex justify-content-between"}>
            <OverlayTrigger
                placement="top-start"
                overlay={
                  <Tooltip id="user-notification-tooltip ">
                    <span className={'font-weight-boldest'}>Labels: </span>
                    {assignment?.label?.label || "-"}
                  </Tooltip>
                }
            >
              <div className="tusk_result-labels tusk_result-labels-eclipse">
                {assignment?.label?.label || "-"}
              </div>
            </OverlayTrigger>
          </div>
          <div className={'d-flex justify-content-between'}>
            <div
                className={``}
            >
              <div className="d-flex align-items-center">
                <LocationOn/>
                <OverlayTrigger
                    placement="top-start"
                    overlay={
                      <Tooltip id="user-notification-tooltip ">
                        <span className={'font-weight-boldest'}>Location: </span>
                        {assignment?.cameras_rtsp?.location?.location_name || "-"}
                      </Tooltip>
                    }
                >
                <span
                    className={"tusk_table-description-length"}
                    style={{minWidth: "105px", maxWidth: "105px"}}
                >

                  {assignment?.cameras_rtsp?.location?.location_name || "-"}
                </span>
                </OverlayTrigger>
              </div>
            </div>
            <div
                className={``}
            >
              <div className={"d-flex"}>
                  <CameraAlt />
                <OverlayTrigger
                    placement="top-start"
                    overlay={
                      <Tooltip id="user-notification-tooltip ">
                          {assignment?.cameras_rtsp?.camera_name|| "-"}
                      </Tooltip>
                    }
                >
                <span
                    className={"tusk_result-tabel-description-length"}
                >
                    {assignment?.cameras_rtsp?.camera_name|| "-"}
                </span>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AssignmentCard;
