'use strict';
require('dotenv').config({path: `./.env.${process.env.NODE_ENV}`});

const configs = {
    PORT: process.env.PORT,
    SERVICE_NAME: process.env.SERVICE_NAME,
    SERVICE_TOKEN: process.env.SERVICE_TOKEN,
    PROFILE_ID: process.env.PROFILE_ID,
    INDEX_DIR: process.env.INDEX_DIR,
    REDIS_URL: process.env.REDIS_URL,
    CONTEXT_REDIS_TTL:process.env.CONTEXT_REDIS_TTL,
    DIALOG_REDIS_TTL:process.env.DIALOG_REDIS_TTL,
    LOCALIZATION_REDIS_TTL:process.env.LOCALIZATION_REDIS_TTL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    AI_API_HOST_URL: process.env.AI_API_HOST_URL,
    AI_NLU_HOST_URL: process.env.AI_NLU_HOST_URL,
    NLU_MODEL: process.env.NLU_MODEL,
    MIN_CONFIDENCE: process.env.MIN_CONFIDENCE,
    AI_DUMMY_INTENTS: process.env.AI_DUMMY_INTENTS,
    CHANNELS_HOST_URL: process.env.CHANNELS_HOST_URL,
    AUTOMATION_API_HOST_URL: process.env.AUTOMATION_API_HOST_URL,
    LIVECHAT_HOST_URL: process.env.LIVECHAT_HOST_URL,
    BUS_BROKER: process.env.BUS_BROKER,
    BUS_PASSWORD: process.env.BUS_PASSWORD,
    BUS_MESSAGE_EXPIRATION: process.env.BUS_MESSAGE_EXPIRATION,
    STAGE: process.env.STAGE,
    BUS_URL: process.env.BUS_URL,
    TENANTS_HOST_URL:process.env.TENANTS_HOST_URL,
    MONITOR_TYPE: process.env.MONITOR_TYPE,
    STAGE:process.env.STAGE,
    BUGSNAG_SERVICE_NAME:process.env.BUGSNAG_SERVICE_NAME,
    BUGSNAG_APP_VERSION:process.env.BUGSNAG_APP_VERSION,
    BUGSNAG_KEY:process.env.BUGSNAG_KEY,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    ERP_API_HOST: process.env.ERP_API_HOST
};

module.exports = configs;