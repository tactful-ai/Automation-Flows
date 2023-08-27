import bcrypt from 'bcrypt';
import flow ,{ Triggers,IExecuteParam}from 'automation-sdk';
import { check_balance } from './check_balance'
import { recharge_balance } from './recharge';

export function accMgmtChoiceFlow() {
    
    const choiceFlow = new flow.WebchatFlow("choice_flow", "intern_greeting", "1.0");

    choiceFlow
        .check("{{config.isLogged}}", "=", "true")
        .quickReply("What Would You Like To Do Today",[
            new flow.FlowButton("1", "check_balance",{shootingType: "balance"}, check_balance()),
            new flow.FlowButton("2", "recharge", { shootingType: "recharge" }, recharge_balance()),
                ])

        .elseCheck()
        .userInput({"question":"Please Enter Your Number?", "contextParam": "userNumber"}) 
            .userInput({"question":"Please Enter Your  Password?", "contextParam": "userPass"})
            .jump("authenticate_category.authenticate_flow.webchat@1.0")

        .endCheck()
       

    return choiceFlow
}


export function authenticate(){
    const Flow = new flow.WebchatFlow("authenticate_flow", "intern_greeting", "1.0");
    Flow
        .action(($: IExecuteParam) => {

            bcrypt.hash($.context.params['userPass'], 12)
                .then((hash: string) => {
                    $.context.params['hashUserPass']= hash})
                .catch((error: Error) => console.error('Error:', error));

        })
        .api("http://localhost:4000/signin", 'POST',{}, {
            number:"{{params.userNumber}}",
            password:"{{params.hashUserPass}}"
        })
        .if(($: IExecuteParam) => {
            const bool = $.context.api.response.json.signin
            return bool ;
          })
              .text([
                  ['Loading',3]
                    ])
              .config("isLogged","true")
              .config("userId","{{api.response.json.userId}}")
              .quickReply("What Would You Like To Do Today",[
                new flow.FlowButton("1", "check_balance",{shootingType: "balance"}, check_balance()),
                new flow.FlowButton("2", "recharge", { shootingType: "recharge" }, recharge_balance()),
    
                    ])
          .else()
              .text(["{{api.response.json.msg}}",1])
              .jump("choice_category.choice_flow.webchat@1.0")
          .endIf();

    return Flow;
}
