import { webchatGreet } from "./greetings";
import {test} from './test';
import {MainFlow,mainUserChoices ,InvalidData,sessionFlow} from './acc_mngmt/index';
import {accMgmtChoiceFlow, authenticateAcc,accMgmtScreenFlow,} from './acc_mngmt/subFlows/acc_mgmt';
import {planMmgtScreenFlow ,authenticatePlan,planMgmtChoices} from './acc_mngmt/subFlows/plan_mgmt';
import {troubleshootScreenFlow,billingAndAccount,callQuality,dataSpeed,escalationFlow,networkConnectivity} from './acc_mngmt/subFlows/troubleshoot';
import {recharge_balance} from './acc_mngmt/subFlows/recharge';
import {renew} from './acc_mngmt/subFlows/renew'
import { subscribe } from "./acc_mngmt/subFlows/subscribe";
import { unsubscribe } from "./acc_mngmt/subFlows/unsubscribe";
import { usage_history,usageHistoryRetrieval } from "./acc_mngmt/subFlows/usage_history";
import { check_balance } from "./acc_mngmt/subFlows/check_balance";
import { list_services } from "./acc_mngmt/subFlows/listservice";
import { list_Userservices } from "./acc_mngmt/subFlows/listuserServices";

export const flowsToBeSetup = [
    webchatGreet(),
    // list other flows here
    
    //main screen 
    MainFlow(),mainUserChoices(),InvalidData(),sessionFlow(),
    
    //account managment
    accMgmtChoiceFlow(),authenticateAcc(),accMgmtScreenFlow(),
    recharge_balance(),check_balance(),
    usage_history(),usageHistoryRetrieval(),
    
    //plan managment
    planMmgtScreenFlow(),authenticatePlan(),planMgmtChoices(),
    list_Userservices(),list_services(),
    renew(),
    subscribe(),unsubscribe(),

    //technical troubleshooting
    troubleshootScreenFlow(),
    billingAndAccount(),
    callQuality(),
    dataSpeed(),
    escalationFlow(),
    networkConnectivity()
]