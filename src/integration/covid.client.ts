import configuration from '../config';
import axios, { AxiosPromise } from 'axios';
import { CovidClientItemModel } from '../model/integration/covid-client-item.model';

const fetchDataFromDayOneForPoland = async (): Promise<AxiosPromise<CovidClientItemModel[]>> => {
    const uri = configuration.covidApiUriPolandDayOne;

    return axios.get(uri);
};

export const covidClient = {
    fetchDataFromDayOneForPoland,
};
