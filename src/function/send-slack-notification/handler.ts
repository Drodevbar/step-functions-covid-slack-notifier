import { Context } from 'aws-lambda';
import { LastDayStatsModel } from '../../model/last-day-stats.model';
import { covidSlackNotifierService } from '../../service/covid-slack-notifier.service';
import { StepFunctionResultModel } from '../../model/step-function-result.model';

export const handle = async (event: StepFunctionResultModel<LastDayStatsModel>, context: Context): Promise<StepFunctionResultModel<null>> => {
    console.log({ event, context });

    await covidSlackNotifierService.sendSlackNotification(event.data);

    return Promise.resolve({ success: true, data: null });
}
