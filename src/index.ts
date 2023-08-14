import { Card, FacebookFlow, FlowButton , IExecuteParam, TextStep} from "automation-sdk";


  // Simulate the flow
  // new FacebookFlow(name, category, version, description, source, cacheable, steps);
 export function main(){
  const flowExample = new FacebookFlow("Flow1", "Complain", "1.0");
  flowExample.on(flowExample.triggers.INTENT, "RESTART")
   .randomText([
    ["Welcome to We", 1], ["Good Morning Sir", 1], ["How can i help you", 1]
   ])
  .userInput({question: "Enter Your Name", contextParam: "name"})
  .userInput({question: "Enter Your Number", contextParam: "number"})
  .jump("choice_flow.choice_category@1.0")


      
      
      
          return main
        }

    export function Choice(){
        const choiceFlow = new FacebookFlow("choice_flow", "choice_category", "1.0");
        choiceFlow
          .quickReply("Choose :", [
            new FlowButton("1", "Renew your package", { shootingType: "Renew" }, Renew()),
            new FlowButton("2", "Cancel Subscription", { shootingType: "Cancel" }, Cancel()),
            new FlowButton(
                "3", 
                "Exit", 
                "End of flow", 
            new FacebookFlow("3", "examples_category").text([['Thank you!']])
            ),
          ])
          return Choice
    } 
    
    export function Renew (){
        const Renew = new FacebookFlow("Renew","Renew_cat");
        Renew.setVariable("credit","125")
        .setVariable("Package Cost","100")
        .if(($) =>  "credit" >= "Package Cost")
        .text([
        ['Congratulations , your package is renewed']
    ])
        .action(($) => {
        $.context.params["user_status"] = 'Subscribed';
    })
        .else()
        .text([
        ['There is no enough credit , please recharge your balance and try again']
        
    ])
        .jump("choice_flow.choice_category@1.0")
        .endIf()


        return Renew
    }

    export function Cancel(){
        const Cancel = new FacebookFlow("Cancel","Cancel_cat");
        Cancel.action(($: IExecuteParam) => {
            $.context.params["Customer_Statues"] = 'Not Subscribed'
        })
        .text([
            ["Your Subscribtion is Cancelled"]
        ])
        .jump("choice_flow.choice_category@1.0")

        return Cancel
    }

          

                 


  
  
  

  

  
  
  