import flow ,{ IExecuteParam,FlowButton}from 'automation-sdk';
import bcrypt from 'bcrypt';
import { list_services } from './listservice';
import { list_Userservices } from './listuserServices';

export function planMmgtScreenFlow(){
    const mainFlow = new flow.WebchatFlow("planMgmtScreenFlow", "intern_greeting", "1.0");

    mainFlow
        .check("{{config.isLogged}}", "=", "true")
        .jump("intern_greeting.planMgmtChoices.webchat@1.0")

        .elseCheck()
        .userInput({"question":"Please Enter Your Number", "contextParam": "userNumber"}) 
        .userInput({"question":"Please Enter Your  Password", "contextParam": "userPass"})
        .jump("intern_category.authenticatePlanFlow.webchat@1.0")

        .endCheck();
        

    return mainFlow;
  }

export function planMgmtChoices(){
    const mainFlow = new flow.WebchatFlow("planMgmtChoices", "intern_greeting", "1.0");
    mainFlow
        .quickReply("Please Choose One Of The Following",[
            new FlowButton("1", "List Services", {  }, list_services() ),
            new FlowButton("2", "My Services", {  }, list_Userservices()),
            new FlowButton("3", "Back To Main Screen", { },
                new flow.WebchatFlow("accMgmtChoiceFlow", "intern_greeting", "1.0").jump("intern_greeting.mainUserChoice.webchat@1.0")
                )
    ]);
    return mainFlow
}
  

export function authenticatePlan(){
    const Flow = new flow.WebchatFlow("authenticatePlanFlow", "intern_greeting", "1.0");
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
          .jump("intern_greeting.choiceFlow.webchat@1.0")
  
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