import {accMgmtChoiceFlow} from './acc_mgmt'
import {planMmgtFlow} from './plan_mgmt'
import {networkCoverageFlow} from './network_coverage'
import {troubleshootFlow} from './troubleshoot'

import flow,{WebchatFlow} from 'automation-sdk';

export function check_balance() {
    
    const Flow = new WebchatFlow("balance_flow", "intern_greeting", "1.0");
        Flow
            .api("http://localhost:4000/getbalance", 'POST', {
                userId:"{{config.userId}}",
                })
            .text(["Here Is Your Current Balance:{{api.response.json.data}}",1])
            .quickReply("What Else Do You Need?",[
                    new flow.FlowButton("1", "Account Managment",{}, accMgmtChoiceFlow()),
                    // new flow.FlowButton("2", "Technical Troubleshooting" , troubleshootFlow()),
                    // new flow.FlowButton("3", "Coverage " coverageFlow())
        
        ]);
            
    return Flow
};

