


import flow ,{ IExecuteParam,}from 'automation-sdk';


export function subscribe() {
    
    const Flow = new flow.WebchatFlow("subscribe_flow", "intern_category", "1.0");
    Flow
        
      .api("https://localhost:4000/subscribe","POST",{},{
          userId:"{{params.userId}}",
          title:"{{payload.title}}"
          
      })
      .if(($: IExecuteParam) => {
          const bool = $.context.api.response.json.bool
          return bool ;
        })
            .text([['Loading',3]])
            .text([["{{api.response.json.msg}}",1]])
          .jump("choice_category.planMgmtChoices.webchat@1.0")  

        .else()
            .text([['{{api.response.json.msg}}',1]])
          .jump("choice_category.listFlow.webchat@1.0") 
        .endIf();

    return Flow
}


