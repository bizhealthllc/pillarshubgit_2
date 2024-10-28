import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import CurrentAndNextArrows from './currentAndNextArrows';
import CurrentAndNextButtons from './currentAndNextButtons';


const MultiStackChart = ({ 
    currentRank,
    ranks,
    handleDateChange,
    customer, 
    summaryFields = [], 
    dataFields = [], 
    showPreviousAndNext = false, 
    showCurrentAndLast = false }) => {
    const [selectedOption, setSelectedOption] = useState('current');
    const populatedDataFields = [];
    const populatedSummaryFields = [];

 
    dataFields.forEach(field => {
        if (field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedDataFields.push({ ...field, Value: newValue });
        } else {
            populatedDataFields.push({ ...field });
        }
    });

 
    summaryFields.forEach(field => {
        if (field.Type === "Sources") {
            const newValue = (customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0]) ? customer.cards[0]?.values.filter(x => x.valueId === field.Value)[0].value : 0;
            populatedSummaryFields.push({ ...field, Value: newValue });
        } else {
            populatedSummaryFields.push({ ...field });
        }
    });

    const stackData = {
        current: {
            series: populatedDataFields.map((field, index) => ({
                name: field.Title,
                data: [parseInt(field.Value) || 0], 
                color: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'][index], 
                link: field.Link
            })),
        
        },
        last: {
            series: populatedDataFields.map((field, index) => ({
                name: field.Title,
                data: [
                    index === 0 ? 30 || 0: 
                    index === 1 ? 40 || 0: 
                    index === 2 ? 20 || 0: 
                    index === 3 ? 50 || 0: 
                    index === 4 ? 60 : 10, 
                ], 
                color: ['#546E7A', '#26A69A', '#D4AC0D', '#AF7AC5', '#5499C7'][index],
                link: field.Link
            })),
        },
    };
    

   
    const chartConfig = {
        chart: {
            type: 'bar',
            stacked: true,
            events: {
                dataPointSelection: (event, chartContext, { dataPointIndex }) => {
                    const selectedLink = populatedDataFields[dataPointIndex]?.Link;
                    if (selectedLink) {
                        window.open(selectedLink, '_blank');
                    }
                },
            },
            height: 400,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '80%',
            },
        },
        series: stackData[selectedOption].series,
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return stackData[selectedOption].series[opt.seriesIndex].name + ": " + val;
            },
            style: {
                fontSize: '12px',
                colors: ['#fff'],
            },
        },
        xaxis: {
            categories: ['Total'], 
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " units";
                },
            },
        },
        grid: {
            show: false,
        },
        yaxis: {
            reversed: false,
        },
        legend: {
            show: true, 
        },
    };

    
    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    }

    return (

        <div className="container my-4">
        <CurrentAndNextArrows currentRank={currentRank} ranks={ranks} customer={customer} handleDateChange={handleDateChange} showPreviousAndNext={showPreviousAndNext} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextArrows>
        
            <hr style={{ borderTop: '2px solid #ccc', margin: '20px 0', marginTop: 0 }} />
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

MultiStackChart.propTypes = {
    customer: PropTypes.object.isRequired,
    summaryFields: PropTypes.array,
    dataFields: PropTypes.array,
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired,
    handleDateChange: PropTypes.object,
};

export default MultiStackChart;
