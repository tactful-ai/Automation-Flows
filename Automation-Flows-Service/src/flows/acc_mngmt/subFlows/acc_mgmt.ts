import bcrypt from 'bcrypt';
import flow ,{ IExecuteParam}from 'automation-sdk';
import { check_balance } from './check_balance'
import { recharge_balance } from './recharge';
import { usage_history } from './usage_history';

export function accMgmtScreenFlow() {
    
    const screenFlow = new flow.WebchatFlow("screenFlow", "intern_greeting", "1.0");

    screenFlow
        .check("{{config.isLogged}}", "=", "true")
        .jump("intern_accChoice.accMgmtChoiceFlow.webchat@1.0")

        .elseCheck()
        .userInput({"question":"Please Enter Your Number", "contextParam": "userNumber",validation: {
            regex: "^[0-9]{10}$",
            errorMessage: 'Number Must Be Of 10 Digits',
            retryCount: 2,
            failureFlow: "intern_greeting.invalidEntries.webchat@1.0"
        }}) 
        .userInput({"question":"Please Enter Your  Password", "contextParam": "userPass"})
        .jump("intern_authenticateAcc.authenticatAccFlow.webchat@1.0")

        .endCheck();
       

    return screenFlow
}

export function accMgmtChoiceFlow() {
    
    const choiceFlow = new flow.WebchatFlow("accMgmtChoiceFlow", "intern_accChoice", "1.0");

    choiceFlow
        .quickReply("What Would You Like To Do Today,{{params.username}}",[
            new flow.FlowButton("1", "Check Balance",{shootingType:"check_balance"},check_balance()),
            new flow.FlowButton("2", "Recharge", {shootingType:"recharge"}, recharge_balance()),
            new flow.FlowButton("3", "Usage History", {shootingType:"usagehistory"}, usage_history()),
            new flow.FlowButton("4", "Back To Main Screen", {shootingType:"return"},
                 new flow.WebchatFlow("return", "intern_greeting", "1.0").jump("intern_greeting.mainUserChoice.webchat@1.0")
                )
                ]);
    return choiceFlow;
}


export function authenticateAcc(){
    const Flow = new flow.WebchatFlow("authenticatAccFlow", "intern_authenticateAcc", "1.0");
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
          .setReminder('TimerName', "{{config.LoginTime}}", "sessionFlow")
          .jump("intern_accChoice.accMgmtChoiceFlow.webchat@1.0")
  
          .endIf();

    return Flow;
}

  function bcrypter(password:string):string {
    try {
        const salt = bcrypt.genSaltSync(12); 
        const hashedPassword = bcrypt.hashSync(password, salt); 
        return hashedPassword;
    } catch (err) {
        console.log(err);
        return '';
    }


}