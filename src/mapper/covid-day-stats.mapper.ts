import { CovidDayStatsModel } from '../model/covid-day-stats.model';
import { CovidClientItemModel } from '../model/integration/covid-client-item.model';

const fromCovidClientItem = (covidClientItem: CovidClientItemModel): CovidDayStatsModel => ({
    confirmed: covidClientItem.Confirmed,
    deaths: covidClientItem.Deaths,
    recovered: covidClientItem.Recovered,
    active: covidClientItem.Active
});

export const covidDayStatsMapper = {
    fromCovidClientItem,
};
