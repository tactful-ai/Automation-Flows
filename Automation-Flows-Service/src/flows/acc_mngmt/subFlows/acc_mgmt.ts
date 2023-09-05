import bcrypt from 'bcrypt';
import flow ,{ Triggers,IExecuteParam}from 'automation-sdk';
import { check_balance } from './check_balance'
import { recharge_balance } from './recharge';
import { usage_history } from './usage_history';

export function accMgmtScreenFlow() {
    
    const screenFlow = new flow.WebchatFlow("screenFlow", "intern_greeting", "1.0");

    screenFlow
        .check("{{config.isLogged}}", "=", "true")
        .jump("intern_greeting.accMgmtChoiceFlow.webchat@1.0")

        .elseCheck()
        .userInput({"question":"Please Enter Your Number", "contextParam": "userNumber"}) 
        .userInput({"question":"Please Enter Your  Password", "contextParam": "userPass"})
        .jump("intern_category.authenticateFlow.webchat@1.0")

        .endCheck()
       

    return screenFlow
}

export function accMgmtChoiceFlow() {
    
    const choiceFlow = new flow.WebchatFlow("accMgmtChoiceFlow", "intern_greeting", "1.0");

    choiceFlow
        .quickReply("What Would You Like To Do Today,{{params.username}}",[
            new flow.FlowButton("1", "Check Balance",{shootingType: "balance"}, check_balance()),
            new flow.FlowButton("2", "Recharge", { shootingType: "recharge" }, recharge_balance()),
            new flow.FlowButton("3", "Usage History", { shootingType: "usage_history" }, usage_history()),
            // new flow.FlowButton("3", "Back", { shootingType: "exit" }, recharge_balance()),
                ])
    return choiceFlow
}


export function authenticate(){
    const Flow = new flow.WebchatFlow("authenticatFlow", "intern_greeting", "1.0");
    Flow
        .action(($: IExecuteParam) => {

            
            $.context.params[`hashUserPass`]=bcrypter($.context.params[`userPass`] )

        })
        .api("http://localhost:4000/signin", 'POST',{}, {
            number:"{{params.userNumber}}",
            password:"{{params.hashUserPass}}"
        })
        .if(($: IExecuteParam) => {
            const bool = $.context.api.response.json.signin
            return !bool ;
          })
          .text([["{{api.response.json.msg}}",1]])
          .jump("intern_greeting.screenflow.webchat@1.0")
        
        .else()
          .text([['Loading...',3]])
          .config("isLogged","true")
          .setVariable("userId","{{api.response.json.userId}}")
          .jump("intern_greeting.accMgmtChoiceFlow.webchat@1.0")
  
          .endIf();

    return Flow;
}

 async function bcrypter(password:string):Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, 12); 
        return hashedPassword ;
        
    } catch (err) {
        console.log(err)
        return ''
    }


}