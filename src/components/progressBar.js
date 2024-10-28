import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CurrentAndNextArrows from './currentAndNextArrows';
import CurrentAndNextButtons from './currentAndNextButtons';

const Progressbar = ({
    currentRank,
    ranks, 
    customer,
    handleDateChange,
    dataFields = [],
    showPreviousAndNext = false, 
    showCurrentAndLast = false
}) => {
    if (!customer || !customer.cards || !Array.isArray(customer.cards) || customer.cards.length === 0) {
        return <div>No data available</div>; 
    }

    const [selectedOption, setSelectedOption] = useState('current');
    const populatedDataFields = [];
    const currValues = [];
    const maxValues = [];
    const lastValues = [];

    dataFields.forEach(field => {
        if (field.Type === "Sources") {
            const newValue1 = customer.cards[0]?.values.find(x => x.valueId === field.Value1);
            //const newValue2 = customer.cards[0]?.values.find(x => x.valueId === field.Value2);
            const newValue2 = {value:0, valueName:"blah", valueId:"blah123"};
            populatedDataFields.push({ ...field, Value: [parseInt(newValue1?.value), parseInt(newValue2?.value)] });
            currValues.push(newValue1); 
            maxValues.push(newValue2);
        } else {
            const value1 = field.Value1 || 0; 
            const value2 = field.Value2 || 0;
    
            populatedDataFields.push({ ...field, Value: [value1, value2] });
            currValues.push(value1); 
            maxValues.push(value2);
           
            const randomLastValue = Math.floor(Math.random() * value2); 
            lastValues.push(randomLastValue); 
        }
    });

    const calculateProgressPercentage = (actual, desired) => {
        if(desired===0) return 100;
        return (actual-desired)>0? 100:actual*100/desired;
    };

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    }

    return (
        <>
        <CurrentAndNextArrows currentRank={currentRank} ranks={ranks} customer={customer}  handleDateChange={handleDateChange} showPreviousAndNext={showPreviousAndNext} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextArrows>
        
        <div className="container px-4">
            <div className="text-center mb-3">
                ELIGIBLE BONUS: 
            </div>
            {
                populatedDataFields.map((field, index) => {
                    const progressPercentage = calculateProgressPercentage(
                        selectedOption === 'current' ? currValues[index]?.value : lastValues[index]?.value, 
                        maxValues[index]?.value
                    );
                    return <>
                        <div className="text-center mt-4">
                            <span><b>{field?.Title} ({field?.Title.toLowerCase().endsWith("sales") ? `$${new Intl.NumberFormat().format(field.Value[0])}` : field.Value[0]})</b></span>
                        </div>
                
                        <div className="progress" style={{ width: '70%', height: '40px', margin: '5px auto' }}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${progressPercentage}%`, backgroundColor: "#178f5a" }}
                                aria-valuenow={progressPercentage}
                                aria-valuemin="0"
                                aria-valuemax={maxValues[index]}
                            >
                                {/* {Math.round(progressPercentage)}% */}
                            </div>
                        </div>
                    </>
                    
                })
            }
            
            {/* {populatedSummaryFields.map((field, index) => (
                <p key={index} style={{ textAlign: 'center' }}>
                    <span className='text-uppercase'>{field.Title}</span>: 
                    {Array.isArray(field.Value) ? `${field.Value[0]}/${field.Value[1]}` : field.Value}
                </p>
            ))} */}

            
        </div>
        <CurrentAndNextButtons handleDateChange={handleDateChange} showCurrentAndNextButtons={showCurrentAndLast} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextButtons>
        </>
    );
};

Progressbar.propTypes = {
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,
    customer: PropTypes.object.isRequired,
    summaryFields: PropTypes.array,
    dataFields: PropTypes.array,
    handleDateChange: PropTypes.func.isRequired,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
};

export default Progressbar;
