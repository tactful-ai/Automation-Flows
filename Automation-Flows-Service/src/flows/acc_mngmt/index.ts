import flow ,{ WebchatFlow,Triggers}from 'automation-sdk';
import {accMgmtChoiceFlow} from './subFlows/acc_mgmt'
import {planMmgtFlow} from './subFlows/plan_mgmt'
import {networkCoverageFlow} from './subFlows/network_coverage'
import {troubleshootFlow} from './subFlows/troubleshoot'

export function MainFlow(){
    const mainFlow = new WebchatFlow("mainFlow", "intern_greeting", "1.0");
    
    mainFlow
        .on(Triggers.INTENT, "mainFlow")
        .randomText([
            ["Welcome To Our Service", 1],
            ["Hi, How Can We Be Of Service?", 1],
            ["Greetings, How Can We Help?", 1]])
        .userInput({"question":"What Do We Call You?", "contextParam": "username",validation: {
            regex: "^[a-zA-Z]{3,10}$",
            errorMessage: 'Name Must Be Of 3 Or More Letters And Not Contain Any Digits',
            retryCount: 2,
            failureFlow: 'intern_greeting.invalidEntries@1.0'
            }}) 
        .text([["Welcome, {{params.username}}",1]])
        .jump("intern_greeting.mainUserChoice@1.0")


        
    return mainFlow;
  }

  export function mainUserChoices(){
    const Flow = new WebchatFlow("mainUserChoice", "intern_greeting", "1.0");

    Flow
        .quickReply("What Do You Need?",[
            new flow.FlowButton("1", "Account Managment",{}, accMgmtChoiceFlow()),
            new flow.FlowButton("2", "Plan Managment",{}, planMmgtFlow()),
            new flow.FlowButton("3", "Technical Troubleshooting",{} , troubleshootFlow()),
            new flow.FlowButton("4", "Network Coverage",{} ,networkCoverageFlow()) ]);

  }

  export function InvalidData(){
    const invalidData = new WebchatFlow("invalidEntries", "intern_greeting", "1.0");
    invalidData
        .text([['By providing invalid data you are forced to start the flow again.']])
        .jump("intern_greeting.mainFlow@1.0");
    return invalidData;
  }