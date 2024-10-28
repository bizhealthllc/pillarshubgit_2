import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import CurrentAndNextArrows from './currentAndNextArrows';
import CurrentAndNextButtons from './currentAndNextButtons';

const Funnelchart = ({ currentRank,ranks,handleDateChange, customer, summaryFields = [], dataFields = [], showPreviousAndNext=true, showCurrentAndLast=true }) => {
    const [selectedOption, setSelectedOption] = useState('current');
    const populatedDataFields = [];
    const populatedSummaryFields = [];

    dataFields.forEach(field => {
        if(field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedDataFields.push({ ...field, Value: newValue });
        } else {
            populatedDataFields.push({ ...field });
        }
    });

    summaryFields.forEach(field => {
        if(field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedSummaryFields.push({ ...field, Value: newValue });
        } else {
            populatedSummaryFields.push({ ...field });
        }
    });

    const currentData = {
        series: [],
        labels: [],
        links:[]

    };

    
    currentData.series = populatedDataFields.map(x=>parseInt(x.Value) || 0);
    currentData.links = populatedDataFields.map(x=>x.Link);
    currentData.labels = populatedDataFields.map(x=>x.Title);
        
    const funnelData = {
        series: [{
            name: 'Current',
            data: populatedDataFields.map(field => ({ x: field.Title, y: field.Value })),
        }],
        labels: populatedDataFields.map(field => field.Title),
    };

    const chartConfig = {
        chart: {
            type: 'funnel',
            events: {
                dataPointSelection: (event, chartContext, { dataPointIndex }) => {
                    const selectedLink = currentData.links[dataPointIndex];
                    if (selectedLink) {
                        window.open(selectedLink, '_blank');
                    }
                }
            },
            height: 400,
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                isFunnel: true,
                dynamicSlope: true,
                barHeight: '80%',
            },
        },
        series: funnelData.series,
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return funnelData.labels[opt.dataPointIndex] + ": " + val;
            },
            style: {
                fontSize: '12px',
                colors: ['#fff'],
            },
        },
        xaxis: {
            categories: funnelData.labels,
            show: false,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " units";
                },
            },
        },
        grid: {
            show: true,
        },
        yaxis: {
            reversed: true,
        },
    };
    
    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    }

    return (
        <div className="container my-4">
            <CurrentAndNextArrows currentRank={currentRank} ranks={ranks} customer={customer} handleDateChange={handleDateChange} showPreviousAndNext={showPreviousAndNext} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextArrows>
            
            <div>
                <div id="chart">
                    <ReactApexChart options={chartConfig} series={chartConfig.series} type="bar" height={400} />
                </div>
                <div id="html-dist"></div>
            </div>

            <div className="mb-3 text-center"> 
                {populatedSummaryFields.map((x, i) => (
                    <p key={i}><span className='text-uppercase'>{x.Title}</span>: {x.Value}</p>
                ))}
            </div>
            <CurrentAndNextButtons handleDateChange={handleDateChange} showCurrentAndNextButtons={showCurrentAndLast} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextButtons>
        </div>
    );
};

Funnelchart.propTypes = {
    customer: PropTypes.object.isRequired,
    summaryFields: PropTypes.array,
    dataFields: PropTypes.array,
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,
    handleDateChange: PropTypes.object,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
};

export default Funnelchart;
