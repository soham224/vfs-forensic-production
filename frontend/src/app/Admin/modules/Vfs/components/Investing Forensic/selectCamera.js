import React from 'react';
import { Card, Col, Row, Form } from 'react-bootstrap';

const CameraCardView = ({ cameraNameByLocationID, selectedCameras, setSelectedCameras,searchText }) => {

    const filteredCameras = cameraNameByLocationID.filter((camera) =>
        camera.camera_name.toLowerCase().includes(searchText.toLowerCase()) // Case-insensitive match
    );

    // If no cameras available, show a message
    if (!cameraNameByLocationID.length) {
        return (
            <div className="text-center mt-4">
                <p className="text-muted">
                    No cameras available to display. Please select a location first.
                </p>
            </div>
        );
    }

    return (
        <div>

            <Row className="g-4">

                {filteredCameras.map((camera) => (
                    <Col key={camera.id} md={3} lg={3} xl={3} className={'mt-3'}>
                        <Card style={{ boxShadow: '2px 2px 5px 0px #835d5d' }}>
                            <div className="d-flex justify-content-between align-items-center mx-2 mt-2">
                                <div className={'lead'}>
                                    {camera?.camera_name}
                                </div>
                                <Form.Check
                                    type="checkbox"
                                    id={`camera-check-${camera?.id}`}
                                    checked={selectedCameras.includes(camera?.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCameras([...selectedCameras, camera?.id]);
                                        } else {
                                            setSelectedCameras(selectedCameras.filter(id => id !== camera?.id));
                                        }
                                    }}
                                    aria-label={`Select camera ${camera?.camera_name}`}
                                />
                            </div>

                            <iframe
                                style={{ borderRadius: '5px' }}
                                width="100%"
                                height="200"
                                src={'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={camera?.camera_name}
                                className={'mt-2'}
                            ></iframe>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CameraCardView;
