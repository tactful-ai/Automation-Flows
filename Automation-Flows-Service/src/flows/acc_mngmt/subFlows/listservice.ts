import flow ,{ Triggers,IExecuteParam, WebchatFlow, FlowButton}from 'automation-sdk';
import { subscribe } from './subscribe';


export function list_services() {
    
    const Flow = new flow.WebchatFlow("list_flow", "list_category", "1.0");
    Flow
        

       
        .api(
            "https://localhost:4000/list-services",
            "POST",
            {}
        )
            .action(($: IExecuteParam)=>{
                
                $.context.params['elements'] = $.context.api.response.json.elements
                
            })
            .dynamicCarousel("{{{params.elements}}}",{
                title: "{{title}}",
                subTitle: "{{content}}",
                mediaURL: "{{{imgUrl}}}",
                buttons: [
                    new FlowButton(
                        "1",
                        "Subscribe",
                        { title:"{{title}}" },
                        subscribe() // Button Action (Sub-Flow)
                    )
                ],
                id: ''
            }
            )
    
    
     

    return Flow
}


