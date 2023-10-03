import * as fs from 'fs';
import * as path from 'path';
import * as readlineSync from 'readline-sync';
type questionObject = {
  question: string,
  contextParam: string, // placeholder
  answer?: string,
  validation?: {
      regex: RegExp,
      errorMessage: string,
      retryCount: number,
      failureFlow?: string
  }
};

export class FormStep{
    formTitle:string;
     status:string='';

    filePath: string = path.join(__dirname, 'cache.json');
    constructor(formTitle:string){
        this.formTitle=formTitle;
    }


    cacheRetrieval(){
        const jsonData: string =  fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(jsonData); 
    }

    setStatus(){
      const cache=this.cacheRetrieval();
      return this.status=cache.status;
    }

    displayAnswers(){
        try {
          
          const cache=this.cacheRetrieval();  
            cache.questions.forEach((element:any) => {
                console.log(`${element['contextParam']} : ${element['answer']}`);
              });
          } catch (err) {
            console.error(err);
          }}

    validation(obj:any ){
      let temp:string|number|boolean='';
      if(obj.validation){
        
          for (let i = 1; i <= obj.validation.retryCount; i++) {
            temp =readlineSync.question(`${obj['question']}: `);
            const regexObject = new RegExp(obj.validation.regex);
              if(regexObject.test(temp)){
                  return temp;
    
              }else if(i==obj.validation.retryCount){
                  temp=false;
                  break;
                  
              }else{
                  console.log(obj.validation.errorMessage);
                      continue;
                  }
              }
      }else{
        return temp =readlineSync.question(`${obj['question']}: `);
        
      }
          return temp;
  }
      
    async checkForAsked(){
      try {
        const cache=this.cacheRetrieval();
        const questionEntry: questionObject | undefined =  cache.questions.find((e: any) => {
          return e.asked == false;
        });
        return questionEntry;
      } catch (error) {
        console.log(error);
      }
    }

    executePendingQuestions():any{
     return this.execute();
    }
    
   async execute(){
      const cache=await this.cacheRetrieval();
      await this.setStatus();
      if(this.status=='NEW'||this.status=='PENDING'){
        
        const questionEntry:any=await this.checkForAsked();

        if(questionEntry==undefined){
            this.status='EXECUTED';
          
            try {
            
              cache.status='EXECUTED';
              fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2), 'utf-8');
              console.log('File has been written successfully!\n');
              return this.displayAnswers();
              
            } catch (err) {
              console.error('Error writing to the file:', err);
            }
          
        }else{
          
            const answer= this.validation(questionEntry);
            if(answer==false){
              return console.log(questionEntry.validation.failureFlow);
            }else{

                const questionToUpdate: any =await  cache.questions.find((obj: any) => obj.id == questionEntry.id);
                if (questionToUpdate) {
                
                    questionToUpdate.answer=answer;
                    questionToUpdate.asked=true;
                    cache.status='PENDING';
      
                    fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2), 'utf-8');
                     console.log('FILE WRITTEN');
                    return this.executePendingQuestions();
                } else {
                    console.log('Object not found');
              }
            }
         }
      }
    }
}

const insta=new FormStep('Basic Info');
insta.execute();