import { FlowManager } from "automation-sdk";
import { flowsToBeSetup } from "../flows/setup";
import axios from "axios";
import configs from "../../configs";

export class FlowCoordinator {
    flowManager: FlowManager;
    constructor() {
        this.flowManager = new FlowManager();
    }

    setupFlows() {
        /////////////////webchat////////////////////
        flowsToBeSetup.forEach(flow => this.flowManager.setupNewFlow(flow));

        console.log("flowDetails after setup ==> ", FlowManager.flowDetails);
    }

    getLocalFlowByTrigger(trigger: string, intent: string, platformType: string) {
        return this.flowManager.getFlowByTrigger(trigger, intent, platformType); 
    }
    
    async getFlowByTrigger(profileId: string, trigger: string, intent: string, platformType: string) {
        console.log('get flow by trigger',profileId, trigger, intent, platformType);
        const profileFlows = await this.getProfileFlow(profileId, trigger, intent, platformType);
        console.log('returned profile flows ', profileFlows);
        if(profileFlows && profileFlows.length > 0) {
            const flow = profileFlows[0];
            return flow;
        }
    }

   async getProfileFlow(profileId: string, trigger: string, intent: string, platformType: string) {
        const url = `${process.env.AUTOMATION_API_HOST_URL}/profile-flows?profileId=${profileId}&platformType=${platformType}&triggerKey=${trigger}&triggerValue=${intent}`;
        try {
            const token = configs.SERVICE_TOKEN;
            const response = await axios.get(url, {headers: {Authorization: token}});
            return response.data;
        } catch(error){
            console.log('Could not get flows from api', error);
        }
    }

    async subscripeSyncedFlows(flows: any[]){
        const url = `${process.env.AUTOMATION_API_HOST_URL}/profiles/${configs.PROFILE_ID}/subscription`;
        const body = {
            "flowIds": flows.map(flow => flow.id)
        };
        try {
            const token = configs.SERVICE_TOKEN;
            const response = await axios.post(url, body, {headers: {Authorization: token}});
            console.log('subscriped flows status', response.status);
        } catch(error){
            console.log('Flows didn\'t subscriped', error);
        }
    }

    async syncFlows() {
        const url = `${process.env.AUTOMATION_API_HOST_URL}/default-flows/sync`;
        const defaultFlowsData = this.flowManager.getDefaultFlowsData();
        const body = JSON.parse(JSON.stringify(defaultFlowsData));
        try {
            const token = configs.SERVICE_TOKEN;
            const response = await axios.post(url, body, {headers: {Authorization: token}});
            console.log('synced flows with api', response.status);
            console.log(defaultFlowsData);
            const syncedFlows = response.data;
            await this.subscripeSyncedFlows(syncedFlows);

        } catch(error){
            console.log('Could not sync with api', error);
        }
    }
}

