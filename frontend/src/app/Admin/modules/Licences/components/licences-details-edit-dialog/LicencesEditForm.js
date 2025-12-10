import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";

export function LicencesEditForm({ saveLocation, locationData, onHide }) {
  const [formData, setFormData] = useState({
    locationName: "",
    id: ""
  });
  // eslint-disable-next-line

  const isValidate = () => {
    if (!formData.locationName) warningToast("Please Enter Location Name");
    else return true;

    return false;
  };

  const handleChange = e => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  useEffect(() => {
    setFormData({
      locationName: locationData?.location_name || "",
      id: locationData?.id || null
    });
  }, [locationData]);

  const handleSubmit = () => {
    if (isValidate()) {
      saveLocation(formData);
    }
  };

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group controlId="licenceName" as={Row}>
            <Form.Label column sm={4}>
              Licence Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="licenceName"
                placeholder="Licence name"
                value={formData.licenceName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </Button>
        <> </>
        <Button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary btn-elevate"
        >
          Save
        </Button>
      </Modal.Footer>
    </>
  );
}
