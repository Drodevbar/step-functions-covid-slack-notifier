import type { AWS } from '@serverless/typescript';

// @ts-ignore
const serverlessConfiguration: AWS = {
  service: 'covid-slack-notifier',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    stage: "${opt:stage, self:provider.stage}",
    covidApiUriPolandDayOne: {
      dev: 'https://api.covid19api.com/dayone/country/poland'
    },
    slackNotificationWebhookUrl: {
      dev: '<provide-your-value>'
    },
  },
  plugins: [
      'serverless-webpack',
      'serverless-step-functions',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-2',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    fetchCovidData: {
      handler: 'src/function/fetch-covid-data/handler.handle',
      environment: {
        COVID_API_URI_POLAND_DAY_ONE: "${self:custom.covidApiUriPolandDayOne.${self:custom.stage}}",
      },
    },
    sendSlackNotification: {
      handler: 'src/function/send-slack-notification/handler.handle',
      environment: {
        SLACK_NOTIFICATION_WEBHOOK_URL: "${self:custom.slackNotificationWebhookUrl.${self:custom.stage}}",
      }
    },
  },
  resources: {
    Resources: {
      CovidNotificationStateMachineLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          LogGroupName: 'CovidNotificationStateMachineLogGroup',
        },
      },
    }
  },
  // @ts-ignore
  stepFunctions: {
    stateMachines: {
      covidNotificationStateMachine: {
        name: 'CovidNotificationStateMachine',
        events: [
          {
            schedule: {
              rate: 'cron(0 12 * * ? *)',
              enabled: true,
              name: 'CovidNotificationStateMachineScheduler'
            }
          }
        ],
        definition: {
          Comment: 'It sends notification with COVID data',
          StartAt: 'fetchCovidDataStep',
          States: {
            fetchCovidDataStep: {
              Type: 'Task',
              Resource: { 'Fn::GetAtt': ['fetchCovidData', 'Arn'] },
              Next: 'sendSlackNotificationStep',
              Retry: [
                {
                  ErrorEquals: ['CovidClientException'],
                  IntervalSeconds: 5,
                  MaxAttempts: 2,
                  BackoffRate: 1,
                }
              ],
              Catch: [
                {
                  ErrorEquals: ['CovidClientException'],
                  Next: 'catchCovidClientExceptionStep'
                }
              ]
            },
            sendSlackNotificationStep: {
              Type: 'Task',
              Resource: { 'Fn::GetAtt': ['sendSlackNotification', 'Arn'] },
              End: true,
            },
            catchCovidClientExceptionStep: {
              Type: 'Fail',
              Error: 'COVID API is unavailable',
              Cause: 'COVID API is currently not available',
            }
          }
        },
        loggingConfig: {
          level: 'ALL',
          includeExecutionData: true,
          destinations: [
            { 'Fn::GetAtt': ['CovidNotificationStateMachineLogGroup', 'Arn'] },
          ]
        }
      },
    }
  }
}

module.exports = serverlessConfiguration;
