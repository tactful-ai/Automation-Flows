
import {WebchatFlow} from 'automation-sdk';

export function check_balance() {
    
    const Flow = new WebchatFlow("balance_flow", "intern_greeting", "1.0");
        Flow
            .api("http://localhost:4000/getbalance", 'POST', {} ,{
                userId:"{{params.userId}}",
                })
            .text([["Here Is Your Current Balance:{{api.response.json.data}}",1]])
            .jump("intern_greeting.mainUserChoice@1.0")

            
    return Flow
};

