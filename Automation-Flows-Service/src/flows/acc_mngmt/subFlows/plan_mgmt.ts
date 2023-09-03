import flow ,{ IExecuteParam}from 'automation-sdk';
import bcrypt from 'bcrypt';

export function planMmgtScreenFlow(){
    const mainFlow = new flow.WebchatFlow("plan_mngmt_flow", "intern_greeting", "1.0");
    
    mainFlow
        .text(["Plan Managment Is Still In Development",1])
        .jump("intern_greeting.main_flow.webchat@1.0");
        
    // mainFlow
    //     .check("{{config.isLogged}}", "=", "true")
    //     .jump("intern_greeting.choice_flow.webchat@1.0")

    //     .elseCheck()
    //     .userInput({"question":"Please Enter Your Number", "contextParam": "userNumber"}) 
    //     .userInput({"question":"Please Enter Your  Password", "contextParam": "userPass"})
    //     .jump("intern_category.authenticateFlow.webchat@1.0")

    //     .endCheck()
        

    return mainFlow;
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