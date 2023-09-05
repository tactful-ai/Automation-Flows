


import flow ,{ Triggers,IExecuteParam,  FacebookFlow, Card, WebchatFlow, FlowButton}from 'automation-sdk';


export function Subscribe() {
    
    const Flow = new flow.WebchatFlow("subscribe_flow", "intern_category", "1.0");
    Flow
        

       
    .api("https://localhost:4000/subscribe","POST",{},{
        userId:"{{params.userId}}",
        title:"{{payload.tittle}}"
        
    })
    .if(($: IExecuteParam) => {
        const bool = $.context.api.response.json.bool
        return bool ;
      })
          .text([['Loading',3]])
          .text([["{{api.response.json.msg}}",1]])
        .jump("choice_category.choice_flow.webchat@1.0")  

      .else()
          .text([['{{api.response.json.msg}}',1]])
         .jump("choice_category.choice_flow.webchat@1.0") 
      .endIf();
            
    
    
     

    return Flow
}


