import React, { Component } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DrillDownResultModal from "./drilldownModal";
import DrillDownResultCaseModal from "./drilldownCaseModal";
import drilldown from "highcharts/modules/drilldown";
import CaseDetailsModal from "../../Investing Forensic/CaseDetailsModal";
import * as actions from "../../../_redux/VFSAction";
import stock from "highcharts/modules/stock";
import {colors} from "../../../../../../../utils/UIHelpers";

// Initialize the drilldown module
drilldown(Highcharts);
stock(Highcharts);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCase:null,
            showModalCaseDetails :false,
            options: {
                chart: {
                    type: props.chartType,
                    events: {
                        drilldown: this.addDrilldownSeries.bind(this),
                        drillup: this.resetScrollBar.bind(this),
                    },
                },
                title: {
                    text: '',
                },
                xAxis: {
                    type: 'category',
                    scrollbar: {
                        enabled: this.props.seriesData.length > 10,
                    },
                    min: 0,
                    max: this.props.seriesData.length > 10 ? 9 : null,
                },
                yAxis: {
                    type: 'logarithmic',
                    title: {
                        text: 'Values',
                    },
                    // minorTickInterval: 0.1,
                },
                credits: {
                    enabled: false,
                },
                legend: {
                    enabled: true
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                        },
                        // cursor: "pointer", // Ensures points are clickable
                    },
                },
                series: this.props.seriesData,
                drilldown: {
                    series: this.props.drilldownData,
                    activeAxisLabelStyle: {
                        textDecoration: "none",
                    },
                },
            },
            key: Date.now(), // Unique key to force re-render
            currentImageIndex: 0,
        };
    }



    resetScrollBar() {
        this.state.chartObj.xAxis[0].update({
            scrollbar: {
                enabled: this.props.seriesData.length > 10,
            },
            min: 0,
            max: this.props.seriesData.length > 10 ? 9 : null,
        });

    }
    componentDidUpdate(prevProps) {
        const { seriesData, chartName } = this.props;
        if (seriesData !== prevProps.seriesData || chartName !== prevProps.chartName) {
            this.updateOptions();
        }
    }

    updateOptions = () => {
        const { seriesData, chartName } = this.props;
        const getColor = (index) => colors[index % colors.length];

        if (chartName === 'crowd_detection' && seriesData?.length > 0) {
            const seriesNewData = seriesData.map(({ name, y },idx) => ({
                name,
                y,
                drilldown: name,
                color: getColor(idx),
            }));

            this.setState((prevState) => ({
                options: {
                    ...prevState.options,
                    series: [{ name: 'Crowd Detection', data: seriesNewData }],
                    xAxis: {
                        type: 'category',
                        scrollbar: {
                            enabled: seriesNewData.length > 10,  // Enable scrollbar only if more than 10 items
                        },
                        min: 0,
                        max: seriesNewData.length > 10 ? 9 : null, // Show only 10 items initially
                    },
                    drilldown: {
                        ...prevState.options.drilldown,
                        series: [], // Default: empty. Dynamically populated by drilldown.
                    },
                },
            }));
        }
        else if (chartName === 'occupancy_detection' && seriesData?.length > 0) {
            const seriesNewData = seriesData.map(({ name, y },idx) => ({
                name,
                y,
                drilldown: name, // `drilldown` links series to drilldown id
                color: getColor(idx),
            }));

            this.setState((prevState) => ({
                options: {
                    ...prevState.options,
                    series: [{ name: 'Occupancy Detection', data: seriesNewData }],
                    xAxis: {
                        type: 'category',
                        scrollbar: {
                            enabled: seriesNewData.length > 10,  // Enable scrollbar only if more than 10 items
                        },
                        min: 0,
                        max: seriesNewData.length > 10 ? 9 : null, // Show only 10 items initially
                    },
                    drilldown: {
                        ...prevState.options.drilldown,
                        series: [], // Default: empty. Dynamically populated by drilldown.
                    },
                },
            }));
        }
        else if (chartName === 'object_left_behind' && seriesData?.length > 0) {
            const seriesNewData = seriesData.map(({ name, y },idx) => ({
                name,
                y,
                drilldown: name, // `drilldown` links series to drilldown id
                color: getColor(idx),
            }));

            this.setState((prevState) => ({
                options: {
                    ...prevState.options,
                    series: [{ name: 'Abandoned Object', data: seriesNewData }],
                    xAxis: {
                        type: 'category',
                        scrollbar: {
                            enabled: seriesNewData.length > 10,  // Enable scrollbar only if more than 10 items
                        },
                        min: 0,
                        max: seriesNewData.length > 10 ? 9 : null, // Show only 10 items initially
                    },
                    drilldown: {
                        ...prevState.options.drilldown,
                        series: [], // Default: empty. Dynamically populated by drilldown.
                    },
                },
            }));
        }
        else if (chartName === 'case_detection' && seriesData?.length > 0) {
            const seriesNewData = seriesData.map(({ name, y ,id },idx) => ({
                name,
                y,
                drilldown: id, // `drilldown` links series to drilldown id
                color: getColor(idx),
            }));

            this.setState((prevState) => ({
                options: {
                    ...prevState.options,
                    series: [{ name: 'Case Object', data: seriesNewData }],
                    xAxis: {
                        type: 'category',
                        scrollbar: {
                            enabled: seriesNewData.length > 10,  // Enable scrollbar only if more than 10 items
                        },
                        min: 0,
                        max: seriesNewData.length > 10 ? 9 : null, // Show only 10 items initially
                    },
                    drilldown: {
                        ...prevState.options.drilldown,
                        series: [], // Default: empty. Dynamically populated by drilldown.
                    },
                },
            }));
        }
    };

    addDrilldownSeries(e) {
        if (!e || !e.point) {
            console.error("Invalid drilldown event or point is null:", e);
            return;
        }

        // `onDrilldown` returns the drilldown series
        this.props
            .onDrilldown(e)
            .then((drilldownData) => {
                if (drilldownData) {
                    try {
                        this.state.chartObj.addSeriesAsDrilldown(e.point, drilldownData);
                        if(drilldownData?.data.length > 10){
                            this.state.chartObj.xAxis[0].update({
                                scrollbar: { enabled: true },
                                min: 0,
                                max: 9,
                            });
                        }
                        else {
                            this.state.chartObj.xAxis[0].update({
                                scrollbar: { enabled: false },
                                min: null,
                                max: null,
                            });
                        }
                        this.state.chartObj.redraw();
                    } catch (err) {
                        console.error("Error adding series as drilldown:", err);
                    }
                }
            })
            .catch((error) => {
                console.error("Drilldown fetch failed:", error);
            });
    }

    handleCloseModal = () => this.props.setShowModal(false)
    handleCloseCaseModal = () => this.props.setShowCaseModal(false)

    handleNextClick = () => {
        const { currentImageIndex } = this.state;
        const { modalData } = this.props;
        if (currentImageIndex < modalData.length - 1) {
            this.setState({ currentImageIndex: currentImageIndex + 1 });
        }
    };

    handlePrevClick = () => {
        const { currentImageIndex } = this.state;
        if (currentImageIndex > 0) {
            this.setState({ currentImageIndex: currentImageIndex - 1 });
        }
    };

    chartCallback = e => {
        this.setState({
            chartObj: e
        });
    };


    handleCaseNameClick(caseData) {
        this.setState({ showModalCaseDetails: true });

        // Dispatch action and fetch case data
        this.props.dispatch(actions.fetchCaseById(caseData.id))
            .then((response) => {
                const uniqueCameraNames = [
                    ...new Set(response.cameras_rtsp.map((camera) => camera.camera_name))
                ];

                const uniqueLocationNames = [
                    ...new Set(response.cameras_rtsp.map((camera) => camera.location.location_name))
                ];

                // Convert unique locations into a string with semicolon separator
                const locationNamesString = uniqueLocationNames.join('; ');

                const data = {
                    caseId: response.case_id,
                    caseName: response.case_name,
                    locationName: locationNamesString,
                    createdDate: this.convertToIST(response.created_date),
                    caseDescription: response.case_description,
                    suspects: response.suspects,
                    cameras: uniqueCameraNames,
                };

                this.setState({ selectedCase: data });
            })
            .catch((error) => {
                console.error("Error fetching case details:", error);
            });
    }

    closeModalCaseDetails = () => {
        this.setState({ showModalCaseDetails: false });
    }

    render() {
        const { link, title, count, chartLoading, noDataMessage,showModal,modalData,showCaseModal } = this.props;
        const { currentImageIndex ,options ,selectedCase ,showModalCaseDetails} = this.state;

        return (
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <a
                        href={link}
                        className="dashboard-underling-graph-name font-size-lg font-weight-bold"
                        style={{ color: "#3F4254", fontSize: "1.6rem" }}
                    >
                        {title}
                    </a>
                    {count && (
                        <div
                            className="font-size-lg font-weight-bold"
                            style={{ fontSize: "1.6rem" }}
                        >
                            Total: {count}
                        </div>
                    )}
                </div>

                <div className="card-body">

                    <div
                        className="chart-container"
                        style={{ minHeight: '400px' }}
                    >
                        {chartLoading ? (
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ minHeight: '400px' }}
                            >
                                <h3>Loading...</h3>
                            </div>
                        ) : options.series.length ? (
                            <HighchartsReact
                                key={this.state.key}
                                highcharts={Highcharts}
                                options={this.state.options}
                                callback={this.chartCallback}
                            />

                        ) : (
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ minHeight: '400px' }}
                            >
                                <h3>{noDataMessage}</h3>
                            </div>
                        )}
                    </div>

                    {showModal && modalData?.length > 0 && (
                        <DrillDownResultModal
                            modalShow={showModal}
                            handleClose={this.handleCloseModal}
                            modalData={modalData}
                            currentImageIndex={currentImageIndex}
                            handleNextClick={this.handleNextClick}
                            handlePrevClick={this.handlePrevClick}
                        />
                    )}

                    {showCaseModal && modalData?.length > 0 && (
                        <DrillDownResultCaseModal
                            modalShow={showCaseModal}
                            handleClose={this.handleCloseCaseModal}
                            modalData={modalData}
                            currentImageIndex={currentImageIndex}
                            handleCaseNameClick={this.handleCaseNameClick}
                        />
                    )}

                    <CaseDetailsModal
                        show={showModalCaseDetails}
                        onHide={this.closeModalCaseDetails}
                        selectedCase={selectedCase}
                    />

                </div>
            </div>
        );
    }
}

export default App;





