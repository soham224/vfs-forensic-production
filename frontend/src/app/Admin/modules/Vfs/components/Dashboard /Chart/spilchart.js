import React, { useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TrendChart = ({ title,link,details, salesData = {}, color = 'rgba(20,125,130,0.8)' }) => {
    const [chartType, setChartType] = useState('column'); // Default chart type

    // Map salesData into Highcharts series format
    const formattedSeries = salesData && Object.keys(salesData).map((key) => ({
        name: key, // Use the key as the series name (e.g., "crowd_detection" or "object_left_behind")
        data: salesData[key].map(item => ({ name: item.name, y: item.y })), // Map each item's name and value
        color: color, // Apply dynamic color to series
    }));

    // Chart configuration
    const options = {
        chart: {
            type: chartType,
            scrollablePlotArea: {
                minWidth: formattedSeries && formattedSeries.length > 10 ? 1000 : null,
                scrollPositionX: 1
            }
        },
        title: {
            text: "" // Dynamic chart title
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: salesData && Object.values(salesData)[0]?.map(item => item.name) || [], // Use "name" values as X-axis categories
            labels: { rotation: -45 } // Rotate labels for better visibility
        },
        yAxis: {
            title: { text: 'Values' },
            min: 0,
            gridLineWidth: 1
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            },
            column: {
                pointWidth: 25
            }
        },
        series: formattedSeries, // Use formatted series
        scrollbar: {
            enabled: formattedSeries && formattedSeries[0]?.data.length > 10,
            barBackgroundColor: 'rgba(20,125,130,0.8)',
            barBorderRadius: 7,
            barBorderWidth: 0,
            buttonBackgroundColor: '#1BC5BD',
            buttonBorderWidth: 0,
            buttonArrowColor: '#FFFFFF',
            rifleColor: '#FFFFFF',
            trackBackgroundColor: '#E4E6EF',
            trackBorderWidth: 1,
            trackBorderColor: '#E4E6EF',
            trackBorderRadius: 7
        },
        // navigator: {
        //     enabled: true
        // }
    };

    return (
        // <div className="card">
        //     <div className="card-header d-flex justify-content-between">
        //         <h3>{title}</h3>
        //         <select
        //             className="form-select"
        //             value={chartType}
        //             onChange={(e) => setChartType(e.target.value)}
        //             style={{width: '150px'}}
        //         >
        //             <option value="column">Column Chart</option>
        //             <option value="line">Line Chart</option>
        //         </select>
        //     </div>
        //     <div className="card-body d-flex justify-content-center align-items-center" style={{minHeight: '470px'}}>
        //         {formattedSeries.length > 0 ? (
        //             <div className="chart-container" style={{width: '100%'}}>
        //                 <HighchartsReact highcharts={Highcharts} options={options}/>
        //             </div>
        //         ) : (
        //             <h3>No data found</h3>
        //         )}
        //     </div>
        // </div>

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
                     <select
                        className="form-select"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        style={{width: '150px'}}
                    >
                        <option value="column">Column Chart</option>
                        <option value="line">Line Chart</option>
                    </select>
        </div>

        <div className="card-body">
            <div className={`${formattedSeries && formattedSeries.length > 0 ? 'chart-container' : 'chart-container d-flex justify-content-center align-items-center'}`}
                 style={{minHeight: '400px'}}> {/* Fixed height */}
                {formattedSeries && !formattedSeries ? (
                    <div className="d-flex justify-content-center align-items-center mt-5" style={{minHeight: '386px'}}>
                        <h3>Loading...</h3>
                    </div>
                ) : formattedSeries && formattedSeries.length > 0 ? (
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
)
    ;
};

export default TrendChart;
