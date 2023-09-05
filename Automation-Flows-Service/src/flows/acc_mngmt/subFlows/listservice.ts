


import flow ,{ Triggers,IExecuteParam,  FacebookFlow, Card, WebchatFlow, FlowButton}from 'automation-sdk';


export function list_services() {
    
    const Flow = new flow.WebchatFlow("list_flow", "list_category", "1.0");
    Flow
        

       
        .api(
            "https://localhost:4000/list-services",
            "POST",
            {}
        )
            .action(($: IExecuteParam)=>{
                
                $.context.params['elements'] = JSON.stringify($.context.api.response.json.elements)
                
            })
            .dynamicCarousel("{{{params.elements}}}",{
                title: "{{tittle}}",
                subTitle: "{{content}}",
                mediaURL: "{{{imgUrl}}}",
                buttons: [
                    new FlowButton(
                        "1",
                        "Renew",
                        { id: 1 },
                        new WebchatFlow("subscribe_flow", "intern_category").text([['Renew']]) // Button Action (Sub-Flow)
                    )
                ],
                id: ''
            }
            )
    
    
     

    return Flow
}


