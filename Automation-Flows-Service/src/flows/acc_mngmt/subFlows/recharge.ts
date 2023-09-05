import flow ,{ IExecuteParam}from 'automation-sdk';


export function recharge_balance() {
    
    const Flow = new flow.WebchatFlow("rechargeFlow", "intern_greeting", "1.0");
    Flow
   .userInput({"question":"Please Enter Value you want to recharge", "contextParam": "voucherval"})      
   .userInput({"question":"Please Enter Your Voucher", "contextParam": "userVoucher",validation: {
    regex: "/^[A-Z0-9]{10}$/",
    errorMessage: 'Voucher Must Be UpperCase, Contain Numbers And Be 10 Characters',
    retryCount: 2,
    failureFlow: 'choice_category.choice_flow.webchat@1.0'
    }})
    .api("http://localhost:4000/recharge", 'POST', {
            voucher:"{{params.userVoucher}}",
            amount:"{{params.voucherval}}",
            userId:"{{params.userId}}"
        })
    .if(($: IExecuteParam) => {
            const bool = $.context.api.response.json.bool
            return bool ;
          })    
    .text([["New Balance is added to your Account:{{api.response.json.data}} EGP",1]])  
    .jump("intern_greeting.mainUserChoice@1.0")

    .else()
              .text(['Invalid Voucher',1])
              .jump("intern_greeting.accMgmtChoiceFlow.webchat@1.0")
          .endIf();    
  
    return Flow
}
