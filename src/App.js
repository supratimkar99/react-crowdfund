import React, { Component } from "react";
import spinner from './spinner.gif';

import web3 from './migrations/web3';
import crowdfundInstance from './migrations/crowdfundInstance';
import crowdfundProject from './migrations/crowdfundProjectInstance';

import Container from './Components/Container';
import Projects from './Components/Projects';

//const projectList = [];

class App extends Component{

  constructor(props) {
    super(props);

    //this.onSubmit = this.onSubmit.bind(this);
    //this.loadBlockchainData = this.loadBlockchainData.bind(this);
    //this.getProjects = this.getProjects.bind(this);
    //this.updateValue = this.updateValues.bind(this);
    //this.fundProject = this.fundProject.bind(this);

    this.state = {
      account: '',
      projects: [],
      isCreating: false,
      closeEvent: false,
      fundEvent: false
    }
  }

  async componentDidMount() {
    await this.loadBlockchainData();
    await this.getProjects();
  }

  /*shouldComponentUpdate(nextProps,nextState) {
    console.log(this.state.projects !== nextState.projects,"--Render: ",this.state.closeEvent)
    return (this.state.projects !== nextState.projects || this.state.toClose !== nextState.toClose );
  }*/

  /*componentDidUpdate() {
    closeEvent = false;
  }*/
   
  onSubmit = async(e) => {
    e.preventDefault();
    this.setState ({
      isCreating: true
    })

    //NEW CODE
    await this.loadBlockchainData();

    console.log("Project Title: ",e.target.title.value);
    console.log("Description: ",e.target.desc.value);
    console.log("Amount Goal: ",e.target.amountGoal.value);
    console.log("Duration: ",e.target.duration.value);

    console.log('Start project!');
    crowdfundInstance.methods.startProject(
      e.target.title.value,
      e.target.desc.value,
      e.target.duration.value,
      web3.utils.toWei(e.target.amountGoal.value, 'ether'),
    ).send({
      from: this.state.account,
    }).then((res) => {
      const projectInfo = res.events.ProjectStarted.returnValues;
      console.log("SUCCESS",projectInfo);
      //window.location.reload(false);
      //projectInfo.isLoading = false;
      this.setState ({
        isCreating: false,
        closeEvent: true
      })
      this.setState ({  
        closeEvent: false
      })
      projectInfo.currentAmount = "0";
      projectInfo.currentState = "0";
      projectInfo.contract = crowdfundProject(projectInfo.contractAddress);
      //this.startProjectDialog = false;
      //this.newProject = { isLoading: false };*/
      projectInfo.deadline = projectInfo.deadline * 1000;
      projectInfo.deadline = new Date(projectInfo.deadline).toString();
      this.setState({
        projects: [...this.state.projects, projectInfo]
      })
    }).catch((error) => {
      this.setState ({
        isCreating: false
      })
      console.log("ERROR",error);
    });
  }


  loadBlockchainData = async() => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    this.setState({
      account: accounts[0]
    })
  }

  /*updateValues(projectList) {
    this.setState ({
      projects: projectList
    });
  }*/

  getProjects = () => {

    crowdfundInstance.methods.returnAllProjects().call().then((projects) => {
      projects.forEach((projectAddress) => {
        const projectInst = crowdfundProject(projectAddress);
        projectInst.methods.checkIfFundingCompleteOrExpired().call().then((res) => {
          console.log(res);
          /*if(res) {
            projectInst.methods.updateState().send({from: this.state.account});
          }*/
          projectInst.methods.getDetails().call().then((projectData) => {
            const projectInfo = projectData;
            projectInfo.contract = projectInst;
            projectInfo.deadline = projectInfo.deadline * 1000;
            projectInfo.deadline = new Date(projectInfo.deadline).toString();
            if(res.hasChanged)
              projectInfo.currentState = res.curstate;
            console.log(projectInfo);
            this.setState({
              projects: [...this.state.projects, projectInfo]
            })
            //projectList.push(projectInfo);
          });
        });
      });
      //setTimeout(()=> { this.updateValues(projectList); },1000);
    });  
  }

  toggleFundEvent = () => {
      this.setState({
        fundEvent: !this.state.fundEvent
      })
  }

  fundProject = async(index,amnt) => {
    // Operations for funding an existing crowdfunding project will be here!
    await this.loadBlockchainData();
    if(this.state.account === this.state.projects[index].projectStarter) {
      this.toggleFundEvent();
      alert("You cannot fund your own project!");
    } else if(amnt <= 0) {
      this.toggleFundEvent();
      alert("Amount can't be negative or 0!");
    } else {
    this.state.projects[index].contract.methods.contribute().send({
        from: this.state.account,
        value: web3.utils.toWei(amnt.toString(), 'ether'),
    }).then((res) => {
        console.log("success");
        let projs = [...this.state.projects];
        let proj = {...projs[index]};
        proj.currentAmount = res.events.FundingReceived.returnValues.currentTotal;
        proj.currentState = res.events.FundingReceived.returnValues.state;
        console.log("State After Funding: ",res.events.FundingReceived.returnValues.state);
        projs[index] = proj;
        this.setState({
          projects: projs
        })
        this.toggleFundEvent();
    }).catch((error) => {
        this.toggleFundEvent();
        if(error.code === 4001)
          alert("The transaction was denied my Metamask!")
    });
  }
  }

  render() {
    let show_loading = null;
    if(this.state.isCreating) {
      show_loading = <div><img src={spinner} style={{ width: '50px',height: '50px', margin: 'auto', display: 'block' }} alt="Loading..." /><span className="ld_text">Creating Project...</span></div>;
    }
    return (
      <div className="container">
        <div className="Headingg">
          <h1>CrowdFunding</h1>
          <p>A Decentralized Crowdfunding Platform on Ethereum</p> 
          {show_loading}
          
        </div>
        <div className="StartProject">
          <Container triggerText="Start A Project" onSubmit={this.onSubmit} isLoading={this.state.isCreating} toClose={this.state.closeEvent} />
        </div>
        <Projects Projects={this.state.projects} Fund={this.fundProject} fundEvent={this.state.fundEvent}/>
      </div>
    );
  }
}

export default App;
