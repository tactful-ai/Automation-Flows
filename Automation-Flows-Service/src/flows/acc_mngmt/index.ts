import flow ,{ WebchatFlow,Triggers}from 'automation-sdk';
import {accMgmtScreenFlow} from './subFlows/acc_mgmt'
import {planMmgtScreenFlow} from './subFlows/plan_mgmt'
import {troubleshootScreenFlow} from './subFlows/troubleshoot'

  export function MainFlow(){
    const mainFlow = new WebchatFlow("mainFlow", "intern_greeting", "1.0");
    
    mainFlow
        .on(Triggers.INTENT, "mainFlow")
        .on(Triggers.INTENT, "RESTART")
        .config("LoginTime", "900")
        .randomText([
            ["Welcome To Our Service", 1],
            ["Hi, How Can We Be Of Service?", 1],
            ["Greetings, How Can We Help?", 1]])
        .userInput({"question":"What Do We Call You?", "contextParam": "username",
            validation: {
                regex: "^[a-zA-Z]{3,10}$",
                errorMessage: 'Name Must Be Of 3 Or More Letters And Not Contain Any Digits',
                retryCount: 2,
                failureFlow: "intern_greeting.invalidEntries.webchat@1.0"
            }}) 
        // .fire(Triggers.INTENT,"mainUserChoice")
            .jump("intern_greeting.mainUserChoice.webchat@1.0");
                    
            return mainFlow;
          }
          
  export function mainUserChoices(){
      const Flow = new WebchatFlow("mainUserChoice", "intern_greeting", "1.0");
      
      Flow
        .on(Triggers.INTENT,"mainUserChoice")
        .text([["Welcome, {{params.username}}",1]])
        .quickReply("What Do You Need?,{{params.username}}",[
          new flow.FlowButton("1", "Account Managment",{}, accMgmtScreenFlow()),
          new flow.FlowButton("2", "Plan Managment",{}, planMmgtScreenFlow()),
          new flow.FlowButton("3", "Technical Troubleshooting",{} , troubleshootScreenFlow()) ]);
      return Flow
  }

  export function InvalidData(){
    const invalidData = new WebchatFlow("invalidEntries", "intern_greeting", "1.0");
    invalidData
        .on(Triggers.INTENT, "invalid")
        .text([['By providing invalid data you are forced to start the flow again.']])
        .jump("intern_greeting.mainFlow.webchat@1.0");
    return invalidData;
  }

 export function sessionFlow(){
    const flowExample = new WebchatFlow("sessionFlow", "intern_greeting", "1.0");
    flowExample
      .on(Triggers.INTENT, "sessionFlow")
      .text([
          ["Your Session Has Ended, Please Login Again"]
      ])
      .setVariable("userId","")
      .jump("intern_greeting.mainFlow.webchat@1.0");

    return flowExample;
  }