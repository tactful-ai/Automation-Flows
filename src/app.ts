import flow from 'automation-sdk';
import { troubleshootFlow } from './subFlows/troubleShoot'


function MainFlow(){
    const mainFlow = new flow.FacebookFlow("main_flow", "category", "1.0");
    mainFlow
        .on(flow.Triggers.INTENT, "RESTART")
        .randomText([
            ["Welcome to our troubleshooting section", 1],
            ["Hi, how can we be of service?", 1],
            ["Hello,What seems to trouble your experience?", 1]])
        .userInput("Enter Your Name", "Customer_name") //error occures when giving more than 1 arg
        .userInput("Enter Your Number", "Customer_number") //error occures when giving more than 1 arg
        .userInput("Inform Us Of Your Problem", "entry") //error occures when giving more than 1 arg
        .if(($) => { //IEexecuteParam error occures
            //check for Outages or any issues on our side 
            return true;
          })
              .text([
                  ['We apologize for the inconvenience we have an outage']
              ])
          .else()
          .quickReply("Here is our options for quick troubleshooting?",[
            new flow.FlowButton("1", "troubleshoot1", { shootingType: "troubleshoot1" }, troubleshootFlow()),
            new flow.FlowButton("2", "troubleshoot1", { shootingType: "troubleshoot2" }, troubleshootFlow()),
            new flow.FlowButton("3", "escalation", { shootingType: "escalation" }, troubleshootFlow()),

        ])
              
          .endIf()
        
    return mainFlow;
  }

