import React from 'react';
import PropTypes from 'prop-types';

const CurrentAndNextButtons = ({ handleDateChange, showCurrentAndNextButtons=true, selectedOption="current", handleSelectedOption }) => {
    const handleNext = () => {
        handleSelectedOption(prev => (prev === 'current' ? 'next' : 'current'));
        var date = new Date();
        date.setDate(15);
        date.setMonth(date.getMonth()-1);
        handleDateChange("next", date); 
    };

    const handleCurrent = () => {
        handleSelectedOption(prev => (prev === 'next' ? 'current' : 'next'));
        var date = new Date();
        handleDateChange("current", date); 
    };

    return (
        <>
            <hr style={{ borderTop: '1px solid #ccc', margin: '10px 0' }} />
            {showCurrentAndNextButtons && 
            <div className="text-center mb-3"> 
                <div className="btn-group" role="group" aria-label="Select Option">
                    <button 
                        onClick={handleCurrent}
                        className={`btn ${selectedOption === 'current' ? 'btn-primary' : 'btn-light'}`}
                        style={selectedOption === 'current' ? {backgroundColor:"#8c8c8a"} : {backgroundColor:'#dfdfd7'}}
                    >
                        Current
                    </button>
                    <button 
                        onClick={handleNext}
                        className={`btn ${selectedOption === 'next' ? 'btn-primary' : 'btn-light'}`}
                    >
                        Last
                    </button>
                </div>
            </div>
            }
        </>            
    );
};

export default CurrentAndNextButtons;

CurrentAndNextButtons.propTypes = {
    handleDateChange: PropTypes.func.isRequired,
    showCurrentAndNextButtons: PropTypes.bool.isRequired,
    selectedOption: PropTypes.string,
    handleSelectedOption: PropTypes.func.isRequired,
}