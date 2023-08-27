import flow ,{IExecuteParam}from 'automation-sdk';


export function unsubscribe(){
    const Flow = new flow.WebchatFlow("unsubscribe_flow", "intern_category", "1.0");
       Flow 
        .api("https://localhost:4000/unsubscribe","POST",{},{
            userId:"{{config.userId}}",
            title:"{{payload.shoppingType}}"
        })
        .if(($: IExecuteParam) => {
            const bool = $.context.api.response.json.bool
            return bool ;
          })
              .text([
                  ['Loading',3]
                    ])
              .text(["{{api.response.json.msg}}",1])
            //   .jump("choice_category.choice_flow.webchat@1.0") list sservices 

          .else()
              .text(['{{api.response.json.msg}}',1])
            //   .jump("choice_category.choice_flow.webchat@1.0") list services
          .endIf();

    return Flow;

}