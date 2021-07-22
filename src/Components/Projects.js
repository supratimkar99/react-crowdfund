import { ProgressBar } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../FundProject.css';

const Projects = (props) => {

    const [amnt, setAmnt] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [props.fundEvent]);

    const projectData = props.Projects.map((project, index) => {

        let fundBtn = <button type="button" className="btn btn-primary" id="btnx" onClick={() => { props.Fund(index,amnt); setLoading(true);} }>Fund</button>;
        let updatedAmnt = 0;
        if(index === activeIndex) {
            updatedAmnt = amnt;
            if(isLoading)
                fundBtn = <button type="button" className="btn btn-primary" id="btnx" onClick={() => { props.Fund(index,amnt); setLoading(true);} } disabled>Transacting...</button>;
            
        }
        let statusBtn;
        let toDisplay = null;
        let reach = null;
        let deadline = <p>Up until:<b> { project.deadline }</b></p>;
        if(project.currentState === '0') {
            statusBtn = <button className="btn-status-ong" disabled>Ongoing</button>;
            toDisplay = <span>
                <p className="amnt">Amount (in ETH):</p>
                <p><input className="number" type="number" step="any" value={updatedAmnt} onChange={(e) => {setAmnt(e.target.value); setActiveIndex(index);}}></input>
                {fundBtn}</p>
                <ProgressBar className="progressbar"now={parseInt((project.currentAmount / project.goalAmount) * 100)} label={`${parseInt((project.currentAmount / project.goalAmount) * 100)}%`}/>
            </span>;
        } else if(project.currentState === '1') {
            statusBtn = <button className="btn-status-exp" disabled>Expired</button>;
            deadline = <p><b>Deadline Reached</b></p>
        } else {
            statusBtn = <button className="btn-status-cmp" disabled>Completed</button>;
            reach = <span className="small-text">has been achieved</span>
        }
        
        return (
            <li key={index}>
              <div className="card w-75" id="card">
                <div className="card-body">
                    <p className="card-title" id="cardtitle">{project.projectTitle} {statusBtn}</p>
                    <p className="card-text2">{project.projectDesc}</p>
                    {deadline}
                    <p className="card-text">Target of<b> {project.goalAmount/ 10**18 } ETH {reach}</b></p>
                    {toDisplay}
                </div>
              </div>    
            </li>
        )
    })
    return <ul>{projectData}</ul> 
}

export default Projects;


