import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {colors} from "../../../../../../../utils/UIHelpers";
export const PieChartComponent = ({title, count, salesData,details ,chartType ,colorByPoint,link,name,chartLoading}) => {

    const options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: chartType,
        },title: {
            text: null,
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            pointFormat: "<b>{point.name}</b>: {point.y}",
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            maxHeight: 60,
            navigation: {
                enabled: true
            }
        },
        plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    size: 250,
                    dataLabels: {
                        enabled: true,
                        style:{
                            color: "rgb(51, 51, 51)",
                            cursor: "pointer",
                            fontSize: "0.9em",
                            textDecoration: "none",
                            fill: "rgb(51, 51, 51)",
                        },
                        formatter: function () {
                            // Apply slice color dynamically
                            return `<span style="color:${this.color}; text-decoration: none;">${this.point.name}: ${this.point.y}%</span>`;
                        }
                    },
                    showInLegend: true,
                    colors: colors, // Set the custom colors array here
                },
            },
        series: [{
            name: name,
            colorByPoint: colorByPoint,
            data: salesData && salesData.map((item, index) => ({
                name: item.name,
                y: item.y,
            })),
        }],
    };

    return (
        <>
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="font-size-lg font-weight-boldest-500" style={{fontSize: "1.60rem"}}>
                        <a
                            href={link}
                            className="dashboard-underling-graph-name"
                            style={{color: "#3F4254"}}
                        >
                            {title}
                        </a>
                    </div>
                    <div className="font-size-lg font-weight-boldest-600" style={{fontSize: "1.60rem"}}>
                        {count &&
                            <>
                                Total: {count}
                            </>
                        }

                    </div>
                </div>

                <div className="card-body">
                    <div className="chart-container d-flex justify-content-center align-items-center " style={{minHeight: '400px'}}> {/* Fixed height */}
                        {chartLoading ? (
                                    <div className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '386px' }}>
                                        <h3>Loading...</h3>
                                    </div>
                                ) : salesData && salesData.length > 0 ? (
                            <HighchartsReact highcharts={Highcharts} options={options}/>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <h3>No data found</h3>
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-center">
                        <h3>{details ? details : ""}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};
