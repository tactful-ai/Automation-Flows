import flow ,{ Triggers,IExecuteParam}from 'automation-sdk';


export function planMmgtFlow(){
    const mainFlow = new flow.WebchatFlow("plan_mngmt_flow", "intern_greeting", "1.0");
    
    mainFlow
        .text(["Plan Managment Is Still In Development",1])
        .jump("intern_greeting.main_flow.webchat@1.0");
        
    return mainFlow;
  }
