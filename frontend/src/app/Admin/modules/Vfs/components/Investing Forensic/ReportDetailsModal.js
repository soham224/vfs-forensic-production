import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Row, Col } from 'reactstrap';
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
// import 'jspdf-autotable';
import moment from "moment/moment";

function ReportDetailsModal({ show, onHide  ,reportModalDetails ,reportModalName, className, backdropClassName }) {

    return (
        <Modal size="xl" centered scrollable={true} show={show} onHide={onHide} className={className} backdropClassName={backdropClassName}>
            <Modal.Header closeButton>
                <Modal.Title>{reportModalName} : Suspect Journey</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="lead font-weight-bold mb-5">
                    Based on the provided camera footage and analyzed data, the system has evaluated
                    and detailed the suspect's movements as follows:
                </div>
                <Row>
                    {reportModalDetails.map((step, index) => {
                        const updatedDescription = step.description.replace(
                            /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // Match the ISO timestamp
                            (utcTime) => moment.utc(utcTime).local().format("DD MMMM YYYY, HH:mm:ss") // Convert to local time
                        );
                        return (
                            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
                                <div className="card h-100 shadow-sm">

                                    <img
                                        src={toAbsoluteUrl(step.file_url)}
                                        alt={`Step ${step.camera_name}`}
                                        className="card-img-top img-fluid"
                                        style={{height: '200px', objectFit: 'cover'}}
                                    />
                                    <div className="card-body" style={{padding: '1rem'}}>
                                        <p><strong>Suspect
                                            Name:</strong> {step.suspects.map(suspect => suspect.suspect_name).join(", ")}
                                        </p>
                                        <p>
                                            <strong>Time:</strong> {moment.utc(step.frame_time).local().format("DD MMMM YYYY, HH:mm:ss")}
                                        </p>
                                        <p>
                                            <strong>{step?.camera_name ? "Camera:" : "Video:"}</strong>{" "}
                                            {step?.camera_name || step?.video_name}
                                        </p>

                                        <p><strong>Description:</strong> {updatedDescription}</p>
                                    </div>
                                </div>
                            </Col>
                        )
                    })}
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReportDetailsModal;
