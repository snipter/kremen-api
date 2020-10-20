import { includes, reduce } from 'lodash';
import { Deputy, DeputyDistrict } from './types';

export const districtToVotersCount = ({ stations }: DeputyDistrict) =>
  reduce(stations, (memo, station) => (station.numberOfVoters ? memo + station.numberOfVoters : memo), 0);

export const getDistrictDeputies = ({ deputies: deputyIds }: DeputyDistrict, deputies: Deputy[]): Deputy[] =>
  deputies.filter(({ id }) => includes(deputyIds, id));
