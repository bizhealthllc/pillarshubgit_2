import React, { useState } from 'react';
import Chart from "react-apexcharts";
import PropTypes from 'prop-types';
import CurrentAndNextButtons from './currentAndNextButtons';
import CurrentAndNextArrows from './currentAndNextArrows';

const Donut = ({ 
    currentRank, 
    ranks, 
    compensationPlans, 
    handleDateChange, 
    customer, 
    summaryFields = [], 
    dataFields = [], 
    segments = 0, 
    
    centerField = [], showPreviousAndNext = true, showCurrentAndLast = true }) => {
    const [selectedOption, setSelectedOption] = useState('current');
    const populatedDataFields = [];
    const populatedSummaryFields = [];
    const populatedCenterField = [];
    

    var plan = compensationPlans?.find(item => item?.period?.bonuses?.length > 0) || null;
    let bonuses = [];
    if (plan?.period?.bonuses) {
        bonuses = [...plan.period.bonuses];
        bonuses.sort((a, b) => (a.bonusId > b.bonusId) ? 1 : -1);
    }

    dataFields.forEach(field => {
        if (field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedDataFields.push({ ...field, Value: newValue });
        } else {
            const bonus = bonuses.find(x => x.bonusId === field.Value) || null;
            const newValue = bonus ? { ...field, Title: bonus.bonusTitle, Value: bonus.amount } : field;
            populatedDataFields.push({ ...newValue });
        }
    });

    summaryFields.forEach(field => {
        if (field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedSummaryFields.push({ ...field, Value: newValue });
        } else {
            const bonus = bonuses.find(x => x.bonusId === field.Value) || null;
            const newValue = bonus ? { ...field, Title: bonus.bonusTitle, Value: bonus.amount } : field;
            populatedSummaryFields.push({ ...newValue });
        }
    });

    centerField.forEach(field => {
        if (field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedCenterField.push({ ...field, Value: newValue });
        } else {
            const bonus = bonuses.find(x => x.bonusId === field.Value) || null;
            const newValue = bonus ? { ...field, Title: bonus.bonusTitle, Value: bonus.amount } : field;
            populatedCenterField.push({ ...newValue });
        }
    });

    const chartData = {
        series: [100],
        links: [],
        labels: [],
        totalValue:0
    };

    if (populatedDataFields.length > 0) {
        if (segments === 0) {
            chartData.series = populatedDataFields.map(x => parseInt(x.Value) || 0);
            chartData.links = populatedDataFields.map(x => x.Link);
            chartData.labels = populatedDataFields.map(x => x.Title);
        } else {
            chartData.series = [50,50,50];
            chartData.links = populatedDataFields.map(x => x.Link).slice(0, 3);
            chartData.labels = populatedDataFields.map(x => `${x.Title} : ${x.Value}`).slice(0, 3);
        }
        
    }


   const totalValue = chartData.series.reduce((acc, val) => acc + val, 0);

    const chartConfig = {
        colors:['#f2af4d', '#5285a4', '#3d9265'],
        chart: {
            type: 'donut',
            events: {
                dataPointSelection: (event, chartContext, { dataPointIndex }) => {
                    const link = chartData.links[dataPointIndex];
                    if (link) {
                        window.open(link);
                    }
                },
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show:false,
                        // name: {
                        //     show: true,
                        //     formatter: function (val) {
                        //       return val
                        //     }
                        //   },
                        total: {
                            show: true,
                            showAlways:false,
                            // label: populatedCenterField.length > 0
                            // ? `${populatedCenterField[0].Title}: ${(populatedCenterField[0].Value / totalValue * 100).toFixed(2)}%`
                            // : '100%', 
                            color: 'black',
                            formatter: function () {
                                console.log(totalValue)
                                return '';
                                // w.globals.seriesTotals.reduce((a, b) => {
                                //   return ``
                                // }, 0)
                              }
                            // custom: function({ series, seriesIndex, dataPointIndex, w}) {
                            //     console.log(series, dataPointIndex, w ,totalValue);
                            //     return "<div class='card'><div class='card-body text-dark'>" + chartData.labels[seriesIndex] + "</div></div>";
                            // },
                        }    
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                const title = chartData.labels[opts.seriesIndex];
                return `${title}`;
            },
            style: {
                fontSize: '14px',
                colors: ['#FFF'],
            },
        },
        tooltip: {
            enabled: true,
            // y: {
            //     formatter: function (val) {
            //         return val + "sdddf";
            //     },
            //     title: {
            //         formatter: function (seriesName) {
            //           return 'sdssd' +seriesName
            //         }
            //       }

            // },
            custom: function({ series, seriesIndex, dataPointIndex, w}) {
                console.log(series, dataPointIndex, w);
                return "<div class='card'><div class='card-body text-dark'>" + chartData.labels[seriesIndex] + "</div></div>";
            },
            shared: false,
            intersect: false,
        },
        labels: chartData.labels,
        // fill: {
        //     type: 'gradient',
        //     gradient: {
        //         shade: 'light',
        //         shadeIntensity: 0.4,
        //         inverseColors: false,
        //         opacityFrom: 1,
        //         opacityTo: 1,
        //         stops: [0, 50, 53, 91]
        //     },
        // },
    };

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    };

    return (
        <div id="carousel-rankAdvance" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
            <div className="carousel-inner">
                <CurrentAndNextArrows currentRank={currentRank} ranks={ranks} customer={customer} handleDateChange={handleDateChange} showPreviousAndNext={showPreviousAndNext} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption} />
                <div className="chart mb-3">
                    {chartData.series.length > 0 && chartData.series.some(x => x > 0) ?
                        <Chart
                            options={chartConfig}
                            series={chartData.series}
                            type={chartConfig.chart.type}
                            height={chartConfig.chart.height}
                        /> :
                        <div className="text-center">No data found</div>
                    }
                </div>
                <hr style={{ borderTop: '1px solid #ccc', margin: '10px 0' }} />
                <div className="mb-3 text-center">
                    {populatedSummaryFields && populatedSummaryFields.map((x, i) => (
                        <p key={i}><span className='text-uppercase'>{x.Title}</span>: {x.Value}</p>
                    ))}
                </div>
                <CurrentAndNextButtons handleDateChange={handleDateChange} showCurrentAndNextButtons={showCurrentAndLast} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption} />
            </div>
        </div>
    );
};

export default Donut;

Donut.propTypes = {
    summaryFields: PropTypes.object.isRequired,
    centerField: PropTypes.object.isRequired,
    dataFields: PropTypes.array.isRequired,
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,
    customer: PropTypes.object,
    segments: PropTypes.number,
    handleDateChange: PropTypes.object,
    compensationPlans: PropTypes.object.isRequired,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
};
