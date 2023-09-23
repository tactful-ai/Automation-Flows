import flow ,{ IExecuteParam,FlowButton}from 'automation-sdk';
import bcrypt from 'bcrypt';
import { list_services } from './listservice';
import { list_Userservices } from './listuserServices';

export function planMmgtScreenFlow(){
    const mainFlow = new flow.WebchatFlow("planMgmtScreenFlow", "intern_planMgmtScreenFlow", "1.0");

    mainFlow
        .check("{{config.isLogged}}", "=", "true")
        .jump("intern_planChoices.planMgmtChoices.webchat@1.0")

        .elseCheck()
        .userInput({"question":"Please Enter Your Number", "contextParam": "userNumber",validation: {
            regex: "^[0-9]{10}$",
            errorMessage: 'Number Must Be Of 10 Digits',
            retryCount: 2,
            failureFlow: "intern_greeting.invalidEntries.webchat@1.0"
        }}) 
        .userInput({"question":"Please Enter Your  Password", "contextParam": "userPass"})
        .jump("intern_authenticatePlan.authenticatePlanFlow.webchat@1.0")

        .endCheck();
        

    return mainFlow;
  }

export function planMgmtChoices(){
    const mainFlow = new flow.WebchatFlow("planMgmtChoices", "intern_planChoices", "1.0");
    mainFlow
        .quickReply("Please Choose One Of The Following",[
            new FlowButton("1", "List Services", { shootingType:"listservice" }, list_services() ),
            new FlowButton("2", "My Services", { shootingType:"listuserservice" }, list_Userservices()),
            new FlowButton("3", "Back To Main Screen", {shootingType:"return" },
                new flow.WebchatFlow("subChoiceFlow", "intern_greeting", "1.0").jump("intern_userChoice.mainUserChoice.webchat@1.0")
                )
    ]);
    return mainFlow
}
  

export function authenticatePlan(){
    const Flow = new flow.WebchatFlow("authenticatePlanFlow", "intern_authenticatePlan", "1.0");
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
          .jump("intern_planMgmtScreenFlow.planMgmtScreenFlow.webchat@1.0")
        
        .else()
          .text([['Loading...',3]])
          .config("isLogged","true")
          .setVariable("userId","{{api.response.json.userId}}")
          .setReminder('TimerName', "{{config.LoginTime}}", "sessionFlow")
          .jump("intern_planChoices.planMgmtChoices.webchat@1.0")
  
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