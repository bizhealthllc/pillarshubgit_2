import React, {useState} from 'react';
import PropTypes from 'prop-types';

const CurrentAndNextArrows = ({ currentRank, ranks, showPreviousAndNext=true }) => {
    const initialRank = ranks ? ranks.slice().sort((a, b) => a.rankId - b.rankId).find(r => r.rankId > currentRank) || ranks.find(r => r.rankId === currentRank) || null : null;
    const [rank, setRank] = useState(initialRank);
    const showRankId = true;

    var handleNextRank = () => {
        if(ranks!==null){
            var nextRankId = Math.min(...ranks.filter((r) => r.rankId > rank.rankId).map((r) => r.rankId));
            if (nextRankId >= Infinity) {
            nextRankId = Math.min(...ranks.map((r) => r.rankId));
            }
            var nextRank = ranks.find((r) => r.rankId == nextRankId);
            setRank(nextRank);
        }
      }
    
      var handlePrevRank = () => {
        if(ranks!=null){
            var lastRankId = Math.max(...ranks.filter((r) => r.rankId < rank.rankId).map((r) => r.rankId));
            if (lastRankId < 0) {
            lastRankId = Math.max(...ranks.map((r) => r.rankId));
            }
            var lastRank = ranks.find((r) => r.rankId == lastRankId);
            setRank(lastRank);
        }
      }

    return (
        <>
            {showPreviousAndNext && 
            <div className="card-header rank-advance-header">
                <ul className="pagination m-0">
                    <li className="page-item">
                    <button className="page-link tab-link" onClick={handlePrevRank}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="15 6 9 12 15 18" /></svg>
                    </button>
                    </li>
                </ul>
                <h3 className="card-title ms-auto text-uppercase">{rank?.rankName}{showRankId ? ` (${rank?.rankId})` : ''}</h3>
                <ul className="pagination m-0 ms-auto">
                    <li className="page-item">
                    <button className="page-link tab-link" onClick={handleNextRank}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="9 6 15 12 9 18" /></svg>
                    </button>
                    </li>
                </ul>
            </div>
                    
            }
            <hr style={{ borderTop: '2px solid #ccc', margin: '20px 0', marginTop: 0 }} />
        </>            
    );
};

export default CurrentAndNextArrows;

CurrentAndNextArrows.propTypes = {
    handleDateChange: PropTypes.func.isRequired,
    showPreviousAndNext: PropTypes.bool.isRequired,
    selectedOption: PropTypes.string,
    handleSelectedOption: PropTypes.func.isRequired,
    customer: PropTypes.object.isRequired,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
}