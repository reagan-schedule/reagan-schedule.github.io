import type { PageLoad } from './$types';
import { schedules, dates } from './db';
import { scheduleByWeek } from './immutable';
import { local, pickableKeys } from './languages';
export const load: PageLoad = () => {
	return { schedules, dates, scheduleByWeek, local, pickableKeys };
};
