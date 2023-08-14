import { Triggers } from 'automation-sdk';
import flow from 'automation-sdk';

export function troubleshootFlow():flow.Flow {
    const subFlow = new flow.FacebookFlow("subflow1", "troubleshooting", "1.0");
        subFlow
            .check("{{payload.shootingType}}", "=", "troubleshoot1")
            //perform troubleshooting 1
                .userInput({"question":"is the issue resolved?", "contextParam": "res"})
                .if(($) => {
                    
                    return true
                })
                    .fire(Triggers.INTENT, "AFFIRMATION")
                .else()
                    .jump("choice_category.choice_flow@1.0")
                .endIf()
            .check("{{payload.shootingType}}", "=", "troubleshoot2") 
            //perform troubleshooting 2
                .userInput({"question":"is the issue resolved?", "contextParam": "res"})
                .if(($) => {
                    return true
                })
                   .fire(Triggers.INTENT, "AFFIRMATION")
                .else()
                    .jump("choice_category.choice_flow@1.0")
                .endIf()
            .check("{{payload.shootingType}}", "=", "escalation") 
            .text([["We will escalate this to our support team and will get back to you "]])
            .endCheck()

    return subFlow;
}

function gratitude():flow.Flow {
    const subFlow = new flow.FacebookFlow("AFFIRMATION", "troubleshooting", "1.0");
    subFlow
        .on(flow.Triggers.INTENT,'AFFIRMATION')
        .text(['we are happy to have helped'])

    return subFlow
}