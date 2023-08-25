import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Bus, SDK, RedisExpiredEvents, Triggers, DialogController, Dialog } from 'automation-sdk';
import { FlowCoordinator } from './src/settings';
import pjson from './package.json';
import configs from './configs';

dotenv.config();
const sdkConfigs = {
  serviceName: process.env.SERVICE_NAME || 'internship',
  RedisConfig: {
    url: configs.REDIS_URL,
    contextTTL: configs.CONTEXT_REDIS_TTL,
    dialogTTL: configs.DIALOG_REDIS_TTL,
    localizationTTL: configs.LOCALIZATION_REDIS_TTL,
  },
  ApiConfig:
  {
    Services: {
      channels: {
        baseUrl: configs.CHANNELS_HOST_URL,
      },
      livechat: {
        baseUrl: configs.LIVECHAT_HOST_URL,
      },
      AI: {
        basePathAI: configs.AI_API_HOST_URL,
        basePathNlu: configs.AI_NLU_HOST_URL,
        nluModel: configs.NLU_MODEL,
        minConfidence: configs.MIN_CONFIDENCE,
        aiDummyIntents: configs.AI_DUMMY_INTENTS
      },
      AutomationAPI: {
        baseUrl: configs.AUTOMATION_API_HOST_URL,
      },
    },
    TokenConfigs: {
      clientId: "",
      clientSecret: "",
      tokenEndpoint: ""
    }
  },
  BusConfig: {
    broker: configs.BUS_BROKER || 'redis',
    namespace: configs.STAGE || 'development',
    messageExpiration: configs.BUS_MESSAGE_EXPIRATION || 3600000,
    url: configs.BUS_URL || configs.REDIS_URL
  },
  Tenants: {
    baseUrl: configs.TENANTS_HOST_URL,
  },
  Bugsnag: {
    type: configs.MONITOR_TYPE,
    namespace: configs.STAGE,
    service: configs.SERVICE_NAME || configs.BUGSNAG_SERVICE_NAME,
    appVersion: pjson.version,
    key: configs.BUGSNAG_KEY
  },
  Logger:{
    level: configs.LOGGER_LEVEL
  }
}
export const sdk = new SDK(sdkConfigs);
const app: Express = express();
const port = process.env.PORT;

//Setup your flows
const flowCoordinator = new FlowCoordinator();
flowCoordinator.setupFlows();
flowCoordinator.syncFlows();

Bus.getInstance().startConsuming();

Bus.getInstance().on(`${Triggers.EXECUTE_FLOWS_AUTOMATION_EVENTS}.${process.env.SERVICE_NAME}`, async (msg: any, cb: any) => {
  console.log('Intentc from bus intent  execute======> ', msg);
  cb();
  const message = msg.body;
  const partnerFlow = flowCoordinator.flowManager.getFlowByDetails(`${message.matchedFlow.defaultFlowId}`);
  console.log("matchedFlow ==========>", partnerFlow)
  partnerFlow?.run(message.tactfulMessage);
});

Bus.getInstance().on(`${Triggers.RESUME_FLOWS_AUTOMATION_EVENTS}.${process.env.SERVICE_NAME}`, async (msg: any, cb: any) => {
  console.log('Intentc from bus intent resume ======> ', msg);
  cb();
  const message = msg.body;
  const conversationId = message.tactfulMessage.tactfulUserId!;
  const cacheClient = sdk.redisDialogClient;
  const dialogController = new DialogController(conversationId, cacheClient!);
  const cachedDialog = await dialogController.getDialog();
  const dialog = Dialog.fromJSON(cachedDialog, dialogController);
  await dialog.resume(message.tactfulMessage);
});

try {
  console.log("configs.REDIS_URL ===>", configs.REDIS_URL);
  RedisExpiredEvents({
    url: configs.REDIS_URL!,
  });
}
catch (error) {
  console.log("RedisExpiredEvents errors ==> ", error);
}

//Start express serevr on port numer => 8000
app.listen(port, () => {
  console.log(`⚡️[server]: Automation Flows is running on port number => ${port}`);
});

//Server status endpoint
app.get('/status', (req: Request, res: Response) => {
  res.send('Automation-Flows service is working!');
});
