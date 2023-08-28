import flow ,{ Triggers,IExecuteParam, FlowButton, FacebookFlow}from 'automation-sdk';


export function recharge_balance() {
    
    const Flow = new flow.WebchatFlow("recharge_flow", "intern_greeting", "1.0");
    Flow
   .userInput({"question":"Please Enter Value you want to recharge?", "contextParam": "voucherval"})      
   .userInput({"question":"Please Enter Your Voucher", "contextParam": "userVoucher",validation: {
    regex: "^(?=.*[A-Z])(?=.*\d)[A-Z\d]{10}$",
    errorMessage: 'Voucher Must Contain UpperCase, Numbers And 10 Characters',
    retryCount: 2,
    failureFlow: 'choice_category.choice_flow.webchat@1.0'
    }})
    .api("http://localhost:4000/recharge", 'POST', {
            voucher:"{{params.userVoucher}}",
            value:"{{params.voucherval}}",
            userId:"{{config.userId}}"
        })
    .if(($: IExecuteParam) => {
            const bool = $.context.api.response.json.bool
            return bool ;
          })    
    .text(["New Balance is added to your Account:{{api.response.json.data}}",1])  
    .jump("choice_category.choice_flow.webchat@1.0")

    .else()
              .text(['Invalid Voucher',1])
              .jump("choice_category.choice_flow.webchat@1.0")
          .endIf();    
    
            

    
   

    return Flow
}
