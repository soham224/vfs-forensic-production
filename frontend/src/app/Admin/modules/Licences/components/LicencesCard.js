import React, { useEffect } from "react";
import { Card, CardHeader, CardBody, Col, Row, Table } from "reactstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as action from "../../Vfs/_redux/VFSAction";

export function LicencesCard() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(action.getLicenseDetails());
    }, [dispatch]);

    const { licencesData } = useSelector(
        (state) => ({
            licencesData: state.vfs?.licenseDetail?.licenses || [], // Ensure default value is an empty array
        }),
        shallowEqual
    );

    return (
        <Card className="example example-compact" style={{ minHeight: "400px" }}>
            {/* Card Header */}
            <CardHeader style={{ fontSize: "1.5rem" }}>License Details</CardHeader>

            {/* Card Body */}
            <CardBody
                style={{
                    maxHeight: "400px", // Set the fixed height
                    overflowY: "auto", // Enable scrolling when content overflows
                    padding: "20px",
                }}
            >
                {/* License Details Table */}
                <Row>
                    <Col xl={12} style={{ padding: "10px 20px", minWidth: "300px" }}>
                        <Table bordered hover responsive>
                            <thead>
                            <tr>
                                <th>License Key</th>
                                <th>Total Cameras Used</th>
                                <th>Start Date</th>
                                <th>Expire Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {licencesData.length > 0 ? (
                                licencesData.map((license, index) => (
                                    <tr key={index}>
                                        <td>{license.license_key}</td>
                                        <td>{license.limits?.current_limit || 0}</td>
                                        <td>{new Date(license.limits?.created_date).toLocaleDateString()}</td>
                                        <td>{new Date(license.expiry_date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No License Data Available
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}
