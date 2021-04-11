import { Context } from 'aws-lambda';
import { covidLastDayStatsService } from '../../service/covid-last-day-stats.service';
import { LastDayStatsModel } from '../../model/last-day-stats.model';
import { StepFunctionResultModel } from '../../model/step-function-result.model';

export const handle = async (event: any, context: Context): Promise<StepFunctionResultModel<LastDayStatsModel>> => {
    console.log({ event, context });

    const lastDayStats: LastDayStatsModel = await covidLastDayStatsService.getLastDayStats();

    return Promise.resolve({
        success: true,
        data: lastDayStats,
    });
}
