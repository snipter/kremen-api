import { includes, reduce } from 'lodash';
import { IDeputy, IDistrict } from './types';

export const districtToVotersCount = ({ stations }: IDistrict) => (
  reduce(stations, (memo, station) => (
    station.numberOfVoters ? memo + station.numberOfVoters : memo
  ), 0)
);

export const getDistrictDeputies = ({ deputies: deputyIds}: IDistrict, deputies: IDeputy[]): IDeputy[] => (
  deputies.filter(({ id }) => includes(deputyIds, id))
);
