import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Col, Row } from 'reactstrap';
import {toAbsoluteUrl} from "../../../../../../_metronic/_helpers";


function CaseDetailsModal({ show, onHide ,selectedCase ,className, backdropClassName }) {

    return (
        <Modal
            size="xl"
            centered
            scrollable={true}
            show={show}
            onHide={onHide}
            aria-labelledby="case-details-modal-title"
            className={className}
            backdropClassName={backdropClassName}
        >
            <Modal.Header closeButton>
                <Modal.Title id="case-details-modal-title">Case Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Case Id / File Id and Case Name */}
                <Row className="modal-section">
                    <Col md={6}>
                        <div className={'lead font-weight-bold'}>
                            Case Id/File Id
                        </div>
                        <p>
                            {selectedCase?.caseId}
                        </p>
                    </Col>
                    <Col md={6}>
                        <div className={'lead font-weight-bold'}>
                            Case Name
                        </div>
                        <p>
                            {selectedCase?.caseName}
                        </p>
                    </Col>

                    {selectedCase?.locationName &&
                    <Col md={6} className={'mt-3'} >
                        <div className={'lead font-weight-bold'}>
                            Location Name
                        </div>
                        <p> {selectedCase?.locationName}</p>
                    </Col>}

                    <Col md={6} className={'mt-3'}>
                        <div className={'lead font-weight-bold'}>
                            Date & Time
                        </div>
                        <p>
                            {selectedCase?.createdDate}
                        </p>
                    </Col>
                    {selectedCase?.videos && selectedCase?.videos.length > 0 && (
                        <Col md={12} className={'mt-3'}>
                            <div className={'lead font-weight-bold'}>Selected Videos</div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    gap: '5px',
                                    marginBottom: '20px',
                                    flexWrap: 'wrap', // ✅ helps if many chips overflow
                                }}
                            >
                                {selectedCase.videos.map((video, index) => (
                                    <span
                                        key={index}
                                        className="label label-lg label-inline"
                                        style={{ padding: '6px 10px', borderRadius: '15px' }}
                                    >
                                      {video}
                                    </span>
                                ))}
                            </div>
                        </Col>
                    )}


                    {selectedCase?.cameras && selectedCase?.cameras.length > 0 &&
                    <Col md={12} className={'mt-3'} >
                        <div className={'lead font-weight-bold'}>Selected Camera</div>

                        {/* Wrap the Chips inside a div instead of p */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start', // Centers the chips horizontally
                            gap: '5px', // Adds space between each chip
                            marginBottom: '20px',
                        }}>
                            {selectedCase?.cameras.map((camera, index) => (
                                <span className={'label label-lg  label-inline'}>
                                  <span key={index}>{camera}</span>
                             </span>
                            ))}
                        </div>
                    </Col>}

                    <Col md={12} className={'mt-3'}>
                        <div className={'lead font-weight-bold'}>Case Description</div>
                        <p>
                            {selectedCase?.caseDescription}
                        </p>
                    </Col>

                    <Col md={12} className={'mt-3'} >
                        <div className={'lead font-weight-bold'}>
                            Suspects
                        </div>
                    </Col>
                </Row>

                {/* Render each suspect in a single row */}
                <Row className="suspects">

                    {selectedCase?.suspects.map((suspect, index) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4">
                            {/* Each card adjusts to take more/less space based on screen size */}
                            <div className="suspect-card text-center">
                                <div className="profile-pic" style={{ position: 'relative' }}>
                                    <img
                                        // src={suspect.image}
                                        src={toAbsoluteUrl(
                                            suspect.suspect_image_url
                                        )}
                                        alt="Profile"
                                        style={{
                                            width: '100%',       // Responsive width
                                            height: '200px',      // Fixed height for consistency
                                            objectFit: 'cover',   // Crop image properly
                                            borderRadius: '8px',
                                        }}
                                    />
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '10px' }}>
                                    {suspect.suspect_name}
                                </p>
                            </div>
                        </Col>
                    ))}
                </Row>

            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onHide} variant="secondary" size={'sm'}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CaseDetailsModal;
