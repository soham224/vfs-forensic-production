import React, { useRef } from "react";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Table } from "reactstrap";
import Boundingbox from "image-bounding-box-custom";
import {Box, Grid, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";

function DrillDownImagesControl({
                           currentImageIndex,
                           histogram,
                           modalLoading,
                           propertiesToShow,
                           modalData,
                           transformedData,
                       }) {
    const componentRef = useRef(null); // Reference to the component to capture

    const imageUrl = modalData?.[currentImageIndex]?.file_url || modalData?.[0]?.file_url; // Ensure URL is accessed properly
    const boundingBoxes = modalData?.[currentImageIndex]?.bounding_box?.detection || [];

    return (
        <div ref={componentRef}>
            <Grid container spacing={2}>
                {/* Image View and Zoom Controls */}
                <Grid item xl={8} lg={8} md={8} xs={12} mt={1}>
                    {modalLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <span className={"zoom-control-images"}>
                            <TransformWrapper height={100} width={100} style={{ height: "100%" }}>
                                {({ zoomIn, zoomOut }) => (
                                    <>
                                        <div className={'d-flex justify-content-end'} style={{ marginBottom: '10px' }}>
                                            <button onClick={zoomOut} style={styles.button}> -</button>
                                            <button onClick={zoomIn} style={styles.button}> +</button>
                                        </div>
                                        <TransformComponent>
                                            <Boundingbox
                                                className="row m-auto col-12 p-0 text-center"
                                                image={imageUrl}
                                                boxes={boundingBoxes.map((item) => ({
                                                    coord: [
                                                        item?.location[0], // x1
                                                        item?.location[1], // y1
                                                        item?.location[2] - item?.location[0], // width
                                                        item?.location[3] - item?.location[1]  // height
                                                    ],
                                                    label: item.label
                                                })) || []}
                                                options={{
                                                    colors: {
                                                        normal: "red", selected: "red", unselected: "red"
                                                    },
                                                    style: {
                                                        maxWidth: "100%",
                                                        maxHeight: "100vh",
                                                        margin: "auto",
                                                        color: "red",
                                                    }
                                                }}
                                            />
                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                        </span>
                    )}
                </Grid>

                {/* Properties Table */}
                <Grid item xl={4} lg={4} md={4} xs={12} mt={1}>
                    {modalLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {propertiesToShow && propertiesToShow.map((property) => (
                                        <TableRow key={property}>
                                            <TableCell component="th" scope="row" style={{ fontWeight: 600 }}>
                                                {property}
                                            </TableCell>
                                            <TableCell>
                                                {transformedData[property] || "-"} {/* Show default "-" if data is missing */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow></TableRow>
                                </TableBody>
                            </Table>

                            {(histogram && modalData?.[0]?.regions) || modalData?.[currentImageIndex]?.regions?.length > 0 ? (
                                <Box
                                    sx={{
                                        color: "grey.800",
                                        border: "1px solid",
                                        borderColor: "grey.300",
                                        borderRadius: 2,
                                        marginTop: "10px",
                                        background: "#F3F6F9",
                                        overflowX: "auto",
                                        maxHeight: "180px",
                                        height: "180px"
                                    }}
                                >
                                    {/* You can render histogram data or regions here */}
                                </Box>
                            ) : null}
                        </TableContainer>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

const styles = {
    button: {
        margin: '5px',
        padding: '2px 8px',
        fontSize: '15px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: '1px solid #007bff',
        backgroundColor: 'rgba(20,125,130,0.8)',
        color: '#ffffff',
    },
};

export default DrillDownImagesControl;
