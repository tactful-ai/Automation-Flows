import flow ,{ IExecuteParam, }from 'automation-sdk';


export function usage_history(){
    const uFlow = new flow.WebchatFlow("usageHistoryScreenFlow", "intern_greeting", "1.0");

    uFlow
        .quickReply("What Would You Like To Do Today,{{params.username}}",[
            new flow.FlowButton("1", "Call History",{shootingType: "callHistory"}, usageHistoryRetrieval()),
            new flow.FlowButton("2", "Message History", { shootingType: "msgHistory" },usageHistoryRetrieval()),
            new flow.FlowButton("3", "Data Usage", { shootingType: "dataHistory" }, usageHistoryRetrieval()),
            new flow.FlowButton("4", "Internation Usage", { shootingType: "internationalHistory" }, usageHistoryRetrieval()),
            new flow.FlowButton("5", "All Details", { shootingType: "allDetails" }, usageHistoryRetrieval()),
            
        ])
    return uFlow;

}


export function usageHistoryRetrieval(){
    const rFlow = new flow.WebchatFlow("usageHistoryRetrieveFlow", "intern_greeting", "1.0");

        rFlow
            .check("{{payload.shootingType}}","=","allDetails")
                .api("http://localhost:4000/usage-history", 'POST', {} ,{
                    type:"allDetails",
                    userId:"{{params.userId}}"
                })

                .action(($: IExecuteParam)=>{
                    $.context.params[`callHistory`]= $.context.api.response.json.plans.callHistory;
                    $.context.params[`msgHistory`]= $.context.api.response.json.plans.msgHistory; 
                    $.context.params[`dataHistory`]= $.context.api.response.json.plans.dataHistory; 
                    $.context.params[`internationalHistory`]= $.context.api.response.json.plans.internationalHistory; 

                })
                .text([["Loading...",3]])
                .text([["Max Is The Last 5 Entries In Each",1]])
                .text([["{{params.callHistory}}",1]])
                .text([["{{params.msgHistory}}",2]])
                .text([["{{params.dataHistory}}",3]])
                .text([["{{params.internationalHistory}}",4]])
                .jump("intern_accChoice.accMgmtChoiceFlow.webchat@1.0")

            
            .elseCheck()
            .api("http://localhost:4000/usage-history", 'POST', {} ,{
                type:"{{payload.shootingType}}",
                userId:"{{params.userId}}"
            })
            .action(($:IExecuteParam)=>{
                let data=''
                $.context.api.response.json.plans.forEach((e:any)=>{
                    const keys = Object.keys(e);
                    const firstKey = keys[0];
                    const secondKey=keys[1]
                    const firstFieldValue = e[firstKey];
                    const secondFieldValue=e[secondKey]
                    data=data.concat(`${firstFieldValue} : ${secondFieldValue}\n`)   
                })
                $.context.params[`data`]=data
            })
            .endCheck()
            .text([["Loading...",3]])
            .text([["Max Is The Last 5 Entries",1]])
            .text([["{{params.data}}",1]])
            .jump("intern_accChoice.accMgmtChoiceFlow.webchat@1.0")

    return rFlow;
}