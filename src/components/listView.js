import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CurrentAndNextButtons from './currentAndNextButtons';
import { useQuery, gql } from "@apollo/client";
import { Link } from 'react-router-dom';

var fieldToHighlight = "Activate";
var GET_PERIOD_DETAILS = gql`query ($customerId: String!, $treeId: String!, $date:Date, $offset: Int, $count: Int) {
    trees(idList: [$treeId]) {
        nodes(nodeIds: [$customerId], date: $date) {
            nodes(levels: 1, offset: $offset, first: $count) {
                customer{
                    id
                    fullName
                    values(idList: ["${fieldToHighlight}"], date: $date) {
                        valueId
                        value
                    }
                }
            }
            totalChildNodes
        }
    }
}`;

var qualifications = [{
    Id:1,
    QA:1,
    ETPLEGS:1,
    Title: "LEADER 1",
    NextTier: 2,
    IsQualified: false
},{
    Id:2,
    QA:1,
    ETPLEGS:2,
    Title: "LEADER 2",
    NextTier: 3,
    IsQualified: false
},{
    Id:3,
    QA:1,
    ETPLEGS:3,
    Title: "LEADER 3",
    NextTier: 4,
    IsQualified: false
},{
    Id:4,
    QA:1,
    ETPLEGS:4,
    Title: "LEADER 4",
    NextTier: 5,
    IsQualified: false
},{
    Id:5,
    QA:1,
    ETPLEGS:5,
    Title: "LEADER 5",
    NextTier: 6,
    IsQualified: false
},{
    Id:6,
    QA:1,
    ETPLEGS:6,
    Title: "LEADER 6",
    NextTier: 6,
    IsQualified: false
}];


const ListView = ({ handleDateChange, treeId, customer, showPreviousAndNext=true, showCurrentAndLast=true }) => {
    const [selectedOption, setSelectedOption] = useState('current');
    const [date, setDate] = useState(new Date());
    const qual = qualifications.map(x=>{
        if(
            x.QA <= parseInt(customer?.cards?.[0].values.find(x=>x.valueId==='QA')?.value) &&
            x.ETPLEGS <= parseInt(customer?.cards?.[0].values.find(x=>x.valueId==='ETPLEGS')?.value)
        ){
            x.IsQualified = true;
        }
        else{
            x.IsQualified = false;
        }
        return x;
    });
    const [currentQualification, setCurrentQualification] = useState(qual.filter(x=>x.IsQualified===true)[qual.filter(x=>x.IsQualified===true).length-1]);   
    const { loading, error, data } = useQuery(GET_PERIOD_DETAILS, { variables: { customerId: customer.id, offset:0, count:10, treeId: treeId, date: date }});

    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    }
    const handlePrevious = () => {
        const q = (currentQualification.Id==1)? 6: currentQualification.Id - 1;
        setCurrentQualification(qualifications.find(x=>x.Id==q));       
    }
    
    const handleNext = () => {
        const q = (currentQualification.Id==6)? 1: currentQualification.Id + 1;
        setCurrentQualification(qualifications.find(x=>x.Id==q));
    }

    const listViewDateChange = (state, date) => {
        const d = new Date();
        if(state!=="current"){
            d.setDate(15);
            d.setMonth(date.getMonth()-1);
            setDate(d);
        }
        else{
            setDate(d);
        }
        handleDateChange(state,d);
    }

    if (loading) return <span>-</span>;
    if (error) return `Error! ${error}`;

    return (
        <>
        <>
            {showPreviousAndNext && 
            <div className="card-header rank-advance-header">
                <ul className="pagination m-0">
                    <li className="page-item">
                    <button className="page-link tab-link" onClick={handlePrevious}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="15 6 9 12 15 18" /></svg>
                    </button>
                    </li>
                </ul>
                <h3 className="card-title ms-auto text-uppercase">{currentQualification?.IsQualified ? `QUALIFIED AS` : "NOT QUALIFIED"} {`${currentQualification?.Title}`}</h3>
                <ul className="pagination m-0 ms-auto">
                    <li className="page-item">
                    <button className="page-link tab-link" onClick={handleNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="9 6 15 12 9 18" /></svg>
                    </button>
                    </li>
                </ul>
            </div>
                    
            }
            <hr style={{ borderTop: '2px solid #ccc', margin: '20px 0', marginTop: 0 }} />
        </>        
        <div className="container px-4">
            <div className="text-center mb-3">
                Premier Teams: {customer?.cards?.[0].values.find(x=>x.valueId==='ETPLEGS')?.value}/5
            </div>
            <div className="text-center mb-3">
                You are qualified to earn commissions through tier {
                (parseInt(customer?.cards?.[0].values.find(x=>x.valueId==='ETPLEGS')?.value)+1>6)
                ?6:
                parseInt(customer?.cards?.[0].values.find(x=>x.valueId==='ETPLEGS')?.value)+1
                }
            </div>
            <div className="chart mb-3">
                <ul className="list-group">
                    {data?.trees?.[0].nodes?.[0].nodes?.map((node, index) =>
                        <li className={node?.customer?.values?.some(x=>x.valueId===fieldToHighlight && x.value)?`list-group-item bg-primary text-white py-2`:`list-group-item bg-light py-2`} key={index}>
                            <Link className={node?.customer?.values?.some(x=>x.valueId===fieldToHighlight && x.value)?`btn-link p-0 m-0 p-md-2 m-md-1 text-white`:`btn-link p-0 m-0 p-md-2 m-md-1 text-dark`} to={`/customers/${node?.customer?.id}/dashboard`}>
                                {node?.customer?.fullName}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
            
            <div className="text-center"> 
                <Link to={`/reports`}>
                    <span className="nav-link-title d-none d-md-block">
                        View all
                    </span>
                </Link>
            </div>
            
            
        </div>
        <CurrentAndNextButtons handleDateChange={listViewDateChange} showCurrentAndNextButtons={showCurrentAndLast} selectedOption={selectedOption} handleSelectedOption={handleSelectedOption}></CurrentAndNextButtons>
        </>
    );
};

export default ListView;

ListView.propTypes = {
    summaryFields: PropTypes.object.isRequired,
    centerField: PropTypes.object.isRequired,
    dataFields: PropTypes.array.isRequired,
    showPreviousAndNext: PropTypes.bool,
    showCurrentAndLast: PropTypes.bool,
    customer: PropTypes.object,
    segments: PropTypes.number,
    handleDateChange: PropTypes.object,
    treeId: PropTypes.number,
    ranks: PropTypes.object.isRequired,
    currentRank: PropTypes.object.isRequired
};
