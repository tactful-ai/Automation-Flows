
import flow ,{ Triggers,IExecuteParam,  FacebookFlow, Card, WebchatFlow, FlowButton}from 'automation-sdk';
import { renew } from './renew';
import { unsubscribe } from './unsubscribe';



export function list_Userservices() {
    
    const Flow = new flow.WebchatFlow("listUserServiceFlow", "list_category", "1.0");
    Flow
        .text([["Here Are Your Subscriptions , {{params.username}}"]])
        .api(
            "https://localhost:4000/list-user-services",
            "POST",
            {},{})
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
                        "Renew",
                        { renew:"{{title}}" },
                        renew()
                        ), 
                    new FlowButton(
                        "2",
                        "Unsubscribe",
                        { unsub:"{{title}}" },
                        unsubscribe()
                    ), 
                    new FlowButton(
                        "3",
                        "Return",
                        { shootingType:"return" },
                       new WebchatFlow("sublistFlow", "intern_greeting", "1.0").jump("intern_planChoices.planMngmtChoice.webchat@1.0")
                    )
                ],
                id: ''
            }
            );
    return Flow
}


