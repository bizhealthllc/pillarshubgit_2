import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import Chart from "react-apexcharts";
import CurrentAndNextArrows from './currentAndNextArrows';
import CurrentAndNextButtons from './currentAndNextButtons';

const Barchart = ({currentRank,ranks,compensationPlans, handleDateChange, customer, summaryFields = [], dataFields = [],showPreviousAndNext = false, showCurrentAndLast =false,toggleOrientation }) => {
    const [selectedOption, setSelectedOption] = useState('current');
    const populatedDataFields = [];
    const populatedSummaryFields = [];

    var plan = compensationPlans?.find(item => item?.period?.bonuses?.length>0 ) || null;
    let bonuses = [];
    if (plan?.period?.bonuses) {
        bonuses = [...plan.period.bonuses];
        bonuses.sort((a, b) => (a.bonusId > b.bonusId) ? 1 : -1);
    }

    dataFields.forEach(field => {
        if(field.Type=="Sources"){
            const newValue = (customer.cards[0]?.values.filter(x=>x.valueId==field.Value)[0])?customer.cards[0]?.values.filter(x=>x.valueId==field.Value)[0].value:0;
            populatedDataFields.push({...field,Value:newValue})
        }
        else{
            const bonus = (bonuses.find(x=>x.bonusId===field.Value)) || null; 
            const newValue = (bonus)? {...field, Title:bonus.bonusTitle, Value:bonus.amount} : field;
            populatedDataFields.push({ ...newValue })
        }
    });

    summaryFields.forEach(field => {
        if(field.Type=="Sources"){
            const newValue = (customer.cards[0]?.values.filter(x=>x.valueId==field.Value)[0])?customer.cards[0]?.values.filter(x=>x.valueId==field.Value)[0].value:0;
            populatedSummaryFields.push({...field,Value:newValue})
        }
        else{
            const bonus = (bonuses.find(x=>x.bonusId===field.Value)) || null; 
            const newValue = (bonus)? {...field, Title:bonus.bonusTitle, Value:bonus.amount} : field;
            populatedSummaryFields.push({ ...newValue })
        }
    });
   
    const currentData = {
        series: [],
        labels: [],
        links:[]
    };

    currentData.series = populatedDataFields.map(x => parseInt(x.Value) || 0);
    currentData.labels = populatedDataFields.map(x => x.Title);
    currentData.links = populatedDataFields.map(x=>x.Link);
    
    const chartConfig = {
        chart: {
            type: 'bar',
            events: {
                dataPointSelection: (event, chartContext, { dataPointIndex }) => {
                    const link = chartData.links[dataPointIndex];
                    if (link) {
                        window.open(link);
                    }
                },
            
            },
            toolbar: {
                show: false,
            },
            offsetY: -20,
        },
        plotOptions: {
            bar: {
                horizontal: toggleOrientation, 
                labels: {
                    show: true,
                }
            }
        },
        colors: ['#1ab7ea', '#0084ff', '#39539E', '#f39c12'],
        xaxis: {
            categories: currentData.labels,
        },
        tooltip: {
            shared: true,
            intersect: false,
            hideEmptySeries: false,
        },
        legend: {
            show: true,
        },
    };

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    }

    const chartData = {
        series: [{ name: selectedOption === 'current' ? 'Current' : 'Last Data', data: currentData.series }],
        labels: currentData.labels,
        links: currentData.links
    };

    return (
        <div id="carousel-rankAdvance" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
            <div className="carousel-inner">
            <CurrentAndNextArrows currentRank={currentRank} ranks={ranks} customer={customer} handleDateChange={handleDateChange} showPreviousAndNext={showPreviousAndNext} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextArrows>
            
            <div className="chart mt-4 mb-2">
                <Chart
                    options={chartConfig}
                    series={chartData.series}
                    type={chartConfig.chart.type}
                    height={350}
                />
            </div>
            <div className="mb-3 text-center"> 
                {populatedSummaryFields.map((x, i) => (
                    <p key={i}><span className='text-uppercase'>{x.Title}</span>: {x.Value}</p>
                ))}
            </div>
            <CurrentAndNextButtons handleDateChange={handleDateChange} showCurrentAndNextButtons={showCurrentAndLast} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextButtons>
        </div></div>
    );
};

Barchart.propTypes = {
    widget: PropTypes.shape({
        settings: PropTypes.shape({
            toggleOrientation: PropTypes.bool,
        }),
    }).isRequired,
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,
    summaryFields: PropTypes.array.isRequired,
    dataFields: PropTypes.array.isRequired,
    customer: PropTypes.object,
    toggleOrientation: PropTypes.bool.isRequired,    
    handleDateChange: PropTypes.object,
    compensationPlans: PropTypes.object,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
};

export default Barchart;
