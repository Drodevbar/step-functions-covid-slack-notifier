import { CovidDayStatsModel } from '../model/covid-day-stats.model';
import { covidClient } from '../integration/covid.client';
import { CovidClientItemModel } from '../model/integration/covid-client-item.model';
import { covidDayStatsMapper } from '../mapper/covid-day-stats.mapper';
import { LastDayStatsModel } from '../model/last-day-stats.model';
import { AxiosError, AxiosResponse } from 'axios';
import { CovidClientException } from '../exception/covid-client.exception';

const getLastDayStats = async (): Promise<LastDayStatsModel> => {
    const dayOneData: AxiosResponse<CovidClientItemModel[]> | null = await covidClient.fetchDataFromDayOneForPoland()
        .catch((error: AxiosError) => {
            console.log({
                message: 'An error was thrown during fetching COVID data from day one for Poland',
                response: error.response.data,
                statusCode: error.response.status
            });

            return null;
        });

    if (dayOneData === null || dayOneData.status !== 200) {
        throw new CovidClientException('Cannot fetch covid day one data for Poland');
    }

    const lastTwoDaysStats: CovidDayStatsModel[] = dayOneData.data.slice(-2)
        .map((item: CovidClientItemModel) => covidDayStatsMapper.fromCovidClientItem(item));

    return {
        newConfirmed: lastTwoDaysStats[1].confirmed - lastTwoDaysStats[0].confirmed,
        newDeaths: lastTwoDaysStats[1].deaths - lastTwoDaysStats[0].deaths,
        newRecovered: lastTwoDaysStats[1].recovered - lastTwoDaysStats[0].recovered,
        overallActive: lastTwoDaysStats[1].active,
    }
}

export const covidLastDayStatsService = {
    getLastDayStats,
};
