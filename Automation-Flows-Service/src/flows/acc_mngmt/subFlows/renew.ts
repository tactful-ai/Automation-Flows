import flow ,{ IExecuteParam,  }from 'automation-sdk';


export function renew() {
    
    const Flow = new flow.WebchatFlow("renew_flow", "intern_greeting", "1.0");
    Flow
        .api("https://localhost:4000/getBalance","POST",{},{
                 userId:"{{params.userId}}",
                 title:"{{payload.renew}}"
        })
            .action(($: IExecuteParam)=>{
                $.context.params['userBalance'] = $.context.api.response.json.data
                
            })
            .if(($: IExecuteParam) => $.context.params['userBalance'] >= "{{payload.price}}")
                .api("https://localhost:4000/getBalance","POST",{},{
                    userId:"{{params.userId}}",
                    title:"{{payload.renew}}",
                    })
                .text([
                    ['Congrats, Your Subscribtion is renewed.']
                ])
                .jump("intern_greeting.planMgmtChoices.webchat@1.0")
        .else()
            .text([
                ["You don't have enough credit"]
            ])
            .jump("intern_greeting.listFlow.webchat@1.0")
        .endIf();

    return Flow
}


