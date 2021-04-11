import { ConfigurationModel } from '../model/configuration.model';

const configuration: ConfigurationModel = {
    covidApiUriPolandDayOne: process.env.COVID_API_URI_POLAND_DAY_ONE,
    slackNotificationWebhookUrl: process.env.SLACK_NOTIFICATION_WEBHOOK_URL,
};

export default configuration;
