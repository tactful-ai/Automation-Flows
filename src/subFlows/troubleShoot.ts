import { Triggers, IExecuteParam, FacebookFlow, Flow } from 'automation-sdk';
import flow from 'automation-sdk';

export function troubleshootFlow():Flow {
    const subFlow = new FacebookFlow("subflow1", "troubleshooting", "1.0");
        subFlow
            .check("{{payload.shootingType}}", "=", "troubleshoot1")
            //perform troubleshooting 1
                .userInput({"question":"is the issue resolved?", "contextParam": "res"})
                .if(($: IExecuteParam) => {
                    
                    return $.context.params['res']
                })
                    .fire(Triggers.INTENT, "AFFIRMATION")
                .else()
                    .jump("choice_category.choice_flow@1.0")
                .endIf()
            .endCheck()
            .check("{{payload.shootingType}}", "=", "troubleshoot2") 
            //perform troubleshooting 2
                .userInput({"question":"is the issue resolved?", "contextParam": "res"})
                .if(($: IExecuteParam) => {
                    return false
                })
                   .fire(Triggers.INTENT, "AFFIRMATION")
                .else()
                    .jump("choice_category.choice_flow@1.0")
                .endIf()
            .endCheck()    
            .check("{{payload.shootingType}}", "=", "escalation") 
            .setVariable("ticket","1989")
            .text([["We will escalate this to our support team and will get back to you on email"]])
            .text([["You will be able to keep track on this ticket {{params.ticket}}"]])
            
            .endCheck()

    return subFlow;
}

export function gratitude():Flow {
    const subFlow = new FacebookFlow("AFFIRMATION", "troubleshooting", "1.0");
    subFlow
        .on(flow.Triggers.INTENT,'AFFIRMATION')
        .text(['we are happy to have helped'])

    return subFlow
}