import flow ,{ Triggers,IExecuteParam}from 'automation-sdk';


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
            .text([["Loading...",3]])
            .api("http://localhost:4000/history", 'POST',{}, {
                    type:"{{payload.shootingType}}",
                    userId:"{{params.userId}}"
            })
            

    return rFlow;
}