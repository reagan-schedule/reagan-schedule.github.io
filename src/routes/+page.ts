import type { PageLoad } from './$types';
import {
	erDates,
	sem1Dates,
	sem2Dates,
	sem3Dates,
	sem4Dates,
	regSchedule,
	strikeSchedule,
	erSchedule,
	sem1Schedule,
	sem2Schedule,
	sem3Schedule,
	sem4Schedule,
	scheduleByWeek
} from './data';
export const load: PageLoad = () => {
	return {
		schedules: {
			regSchedule,
			strikeSchedule,
			erSchedule,
			sem1Schedule,
			sem2Schedule,
			sem3Schedule,
			sem4Schedule
		},
		dates: {
			erDates,
			sem1Dates,
			sem2Dates,
			sem3Dates,
			sem4Dates
		},
		scheduleByWeek
	};
};
