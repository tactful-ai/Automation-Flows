import flow ,{IExecuteParam}from 'automation-sdk';


export function unsubscribe(){
    const Flow = new flow.WebchatFlow("unsubscribeFlow", "intern_category", "1.0");
       Flow 
        .api("https://localhost:4000/unsubscribe","POST",{},{
            userId:"{{params.userId}}",
            title:"{{payload.unsub}}"
        })
        .if(($: IExecuteParam) => {
            const bool = $.context.api.response.json.bool
            return bool ;
          })
              .text([['Loading',3]])
              .text([["{{api.response.json.msg}}",1]])
              .jump("intern_planChoices.planMgmtChoices.webchat@1.0")  

          .else()
              .text([['{{api.response.json.msg}}',1]])
              .jump("intern_planChoices.planMgmtChoices.webchat@1.0")  
              .endIf();

    return Flow;

}