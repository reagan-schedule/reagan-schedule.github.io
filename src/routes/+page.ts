import type { PageLoad } from './$types';
import { schedules, dates } from './data';
import { scheduleByWeek } from './immutable';
export const load: PageLoad = () => {
	return { schedules, dates, scheduleByWeek };
};
