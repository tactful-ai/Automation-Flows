import flow ,{ Triggers,IExecuteParam}from 'automation-sdk';


export function networkCoverageFlow(){
    const mainFlow = new flow.WebchatFlow("network_coverage_flow", "intern_greeting", "1.0");
    
    mainFlow
        .text(["Network Coverage Is Still In Development",1])
        .jump("intern_greeting.main_flow.webchat@1.0");
        
    return mainFlow;
  }
