import type { PageLoad } from './$types';
import { scheduleByWeek, schedules, dates } from './data';
export const load: PageLoad = () => {
	return { schedules, dates, scheduleByWeek };
};
