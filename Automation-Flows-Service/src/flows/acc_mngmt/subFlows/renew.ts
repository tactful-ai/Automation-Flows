


import flow ,{ Triggers,IExecuteParam,  FacebookFlow, Card, WebchatFlow, FlowButton}from 'automation-sdk';


export function renew() {
    
    const Flow = new flow.WebchatFlow("renew_flow", "renew_category", "1.0");
    Flow
        
        .api(
            "https://localhost:4000/getBalance",
            "POST",
            {},
            { userId:"{{params.userId}}"}
        )
        
            .action(($: IExecuteParam)=>{
                
                $.context.params['userBalance'] = JSON.stringify($.context.api.response.json.data)
                
                
            })
          
            

            .if(($: IExecuteParam) => $.context.params['userBalance'] >= "{{payload.price}}")
            .text([
                ['Congrats, Your Subscribtion is renewed.']
            ])

            .jump("list_category.list_flow.webchat@1.0")
        .else()
            .text([
                ["You don't have enough credit>"]
            ])
            .jump("list_category.list_flow.webchat@1.0")
        .endIf()
    
           
    
    
     

    return Flow
}


