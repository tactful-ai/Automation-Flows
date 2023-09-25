import flow ,{ Triggers,IExecuteParam, WebchatFlow, FlowButton}from 'automation-sdk';
import { subscribe } from './subscribe';


export function list_services() {
    
    const Flow = new flow.WebchatFlow("listFlow", "intern_greeting", "1.0");
    Flow
        .text([["Here Is Our Available Subscriptions , {{params.username}}"]])
        .api(
            "https://localhost:4000/list-services",
            "POST", {},{})
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
                    { title:"{{title}}",price:"{{price}}" },
                    subscribe() 
                )
            ],
            id: ''
        }
        );

    return Flow
}


