import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';
import configuration from '../config';
import { LastDayStatsModel } from '../model/last-day-stats.model';

const sendSlackNotification = async (stats: LastDayStatsModel): Promise<IncomingWebhookResult> => {
    const webhook: IncomingWebhook = new IncomingWebhook(configuration.slackNotificationWebhookUrl);

    return webhook.send({
        blocks: [
            {
                type: 'header',
                text: {
                    text: ':microbe: COVID report for the last 24h :microbe:',
                    type: 'plain_text',
                    emoji: true,
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*New confirmed cases:*\n${stats.newConfirmed}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*New deaths:*\n${stats.newDeaths}`,
                    },
                ]
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*New recovered:*\n${stats.newRecovered}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Overall active cases:*\n${stats.overallActive}`,
                    },
                ]
            }
        ]
    });
}

export const covidSlackNotifierService = {
    sendSlackNotification,
};
