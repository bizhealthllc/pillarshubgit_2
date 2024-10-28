import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import CurrentAndNextArrows from './currentAndNextArrows';
import CurrentAndNextButtons from './currentAndNextButtons';

const StackedbarChart = ({
    currentRank,
    ranks,
    customer,
    handleDateChange,
    dataFields = [],
    summaryFields = [],
    showPreviousAndNext = false,
    showCurrentAndLast = false
}) => {
    if (!customer || !customer.cards || !Array.isArray(customer.cards) || customer.cards.length === 0) {
        return <div>No data available</div>; 
    }

    const [selectedOption, setSelectedOption] = useState('current');
    const populatedDataFields = [];
    const populatedSummaryFields = [];
    const currValues = [];
    const maxValues = [];
   

    dataFields.forEach(field => {
        if (field.Type === "Sources") {
            const matchingValues = customer.cards[0]?.values.filter(x => x.valueId === field.Value) || [];
            
            const newValue1 = matchingValues.length > 0 ? matchingValues[0].value : 0;
            const newValue2 = matchingValues.length > 1 ? matchingValues[1].value : 0;
    
            populatedDataFields.push({ ...field, Value: [newValue1, newValue2] });
            currValues.push(newValue1); 
            maxValues.push(newValue2);

        } else {
            const value1 = field.Value1 || 0; 
            const value2 = field.Value2 || 0; 
    
            populatedDataFields.push({ ...field, Value: [value1, value2] });
            currValues.push(value1); 
            maxValues.push(value2);

        
        }
    });

    summaryFields.forEach(field => {
        if (field.Type === "Sources") {
            const matchingValues = customer.cards[0]?.values.filter(x => x.valueId === field.Value) || [];
            
            const newValue1 = matchingValues.length > 0 ? matchingValues[0].value : 0;
            const newValue2 = matchingValues.length > 1 ? matchingValues[1].value : 0;
    
            populatedSummaryFields.push({ ...field, Value: [newValue1, newValue2] });
        } else {
            const value1 = field.Value1 || 0; 
            const value2 = field.Value2 || 0; 
    
            populatedSummaryFields.push({ ...field, Value: [value1, value2] });
        }
    });

    const currentValue = currValues[0] || 0;
    const totalValue = maxValues[0] || 0; 
    const ScurrentValue = currValues[1] || 0; 
    const StotalValue = maxValues[1] || 0; 

    const data = {
        current: {
            totalValues: [totalValue || 0, StotalValue || 0],
            currentValues: [currentValue || 0, ScurrentValue || 0],
        },
        last: {
            totalValues: [100, 150] || [0, 0], 
            currentValues: [70, 50] || [0, 0],
        },
    };

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: '70%',
                endingShape: 'rounded',
            },
        },
        xaxis: {
            categories: populatedDataFields.map(field => field.Title), 
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            colors: ['#0084ff', '#87ceeb'], 
        },
        legend: {
            show: true,
            position: 'top',
        },
        tooltip: {
            shared: true,
            intersect: false, 
            formatter: function (series) {
                let tooltipHtml = '<div class="tooltip">'; 
                series.forEach((s) => {
                    tooltipHtml += `<div>${s.seriesName}: ${s.data} (${s.seriesName === 'Current Value' ? 'Used' : 'Remaining'})</div>`;
                });
                tooltipHtml += '</div>';
                return tooltipHtml;
            },
        },
    };
    

    const seriesData = [
        {
            name: 'Actual Value',
            data: (data[selectedOption]?.currentValues || [0, 0]),
        },
        {
            name: 'Remaining Value',
            data: (data[selectedOption]?.totalValues || [0, 0]).map(
                (total, index) => (total - (data[selectedOption]?.currentValues?.[index] || 0)) || 0
            ),
        },
    ];
    

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    }
    return (
        <div className="container my-4">
            <CurrentAndNextArrows currentRank={currentRank} ranks={ranks} customer={customer} handleDateChange={handleDateChange} showPreviousAndNext={showPreviousAndNext} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextArrows>
            
            <div>
                <ReactApexChart
                    options={chartOptions}
                    series={seriesData}
                    type="bar"
                    height={400}
                />
            </div>

            {populatedSummaryFields.map((field, index) => (
                <p key={index} style={{ textAlign: 'center' }}>
                    <span className='text-uppercase'>{field.Title}</span>: 
                    {Array.isArray(field.Value) ? `${field.Value[0]}/${field.Value[1]}` : field.Value}
                </p>
            ))}

            <CurrentAndNextButtons handleDateChange={handleDateChange} showCurrentAndNextButtons={showCurrentAndLast} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextButtons>
        </div>
    );
};

StackedbarChart.propTypes = {
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,    
    handleDateChange: PropTypes.object,
    customer:PropTypes.object.isRequired,
    summaryFields: PropTypes.array,
    dataFields: PropTypes.array,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
};

export default StackedbarChart;
