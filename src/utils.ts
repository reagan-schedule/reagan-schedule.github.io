interface TimeFormat {
	hours: number;
	minutes: number;
}
export const Time = {
	fromDate(date: Date): TimeFormat {
		return { hours: date.getHours(), minutes: date.getMinutes() };
	},
	equal(left: TimeFormat, right: TimeFormat) {
		return left.hours === right.hours && left.minutes == right.minutes;
	},
	less(left: TimeFormat, right: TimeFormat) {
		return left.hours < right.hours || (left.hours === right.hours && left.minutes < right.minutes);
	},
	greater(left: TimeFormat, right: TimeFormat) {
		return left.hours > right.hours || (left.hours === right.hours && left.minutes > right.minutes);
	},
	subtract(left: TimeFormat, right: TimeFormat): TimeFormat {
		let minutes = left.minutes - right.minutes + left.hours * 60 - right.hours * 60;
		const hours = Math.floor(minutes / 60);
		minutes %= 60;
		return { hours, minutes };
	},
	add(left: TimeFormat, right: TimeFormat): TimeFormat {
		return {
			hours: left.hours + right.hours,
			minutes: left.minutes + right.minutes
		};
	}
};
const fmt = new Intl.DateTimeFormat(navigator.language, { timeStyle: 'short' });
export function format(time: TimeFormat) {
	const nil = new Date(0);
	nil.setHours(time.hours, time.minutes);
	return fmt.format(nil);
}
export type DateSpecific = [month: number, date: number, year?: number];
export interface RecurringEvent {
	name: string;
	id: string;
	start: TimeFormat;
	end: TimeFormat;
}
export interface NamedTime {
	time: TimeFormat;
	name: string;
}
export function matchDate(matcher: Date) {
	return (value: DateSpecific) =>
		matcher.getMonth() === value[0] &&
		matcher.getDate() === value[1] &&
		(!value[2] || matcher.getFullYear() === value[2]);
}
export function findUpperBound(range: NamedTime[], value: TimeFormat) {
	return range.find(({ time }) => Time.greater(time, value));
}
export function getSchedule<ScheduleKey>(
	forTime: Date,
	frozen: [ScheduleKey, DateSpecific[]][],
	fallback: Record<number, ScheduleKey>,
	fallbackFallback: ScheduleKey
) {
	const schedule = frozen.find(([, dates]) => dates.some(matchDate(forTime)))?.[0];
	if (schedule) return schedule;

	const daySchedule = fallback[forTime.getDay()];
	if (daySchedule) return daySchedule;
	return fallbackFallback;
}
export function flattenTimes(
	populate: unknown[],
	events: RecurringEvent[],
	hours = 0,
	minutes = 0
) {
	for (const { start, end, name } of events) {
		populate.push({ time: Time.add(start, { hours, minutes }), name: `${name} starts` });
		populate.push({ time: Time.add(end, { hours, minutes }), name: `${name} ends` });
	}
}
