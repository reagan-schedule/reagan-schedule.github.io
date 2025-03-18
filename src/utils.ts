export class Time {
	readonly hours: number;
	readonly minutes: number;
	constructor(hours: number, minutes: number) {
		this.hours = hours;
		this.minutes = minutes;
	}

	static fromDate(date: Date): Time {
		return { hours: date.getHours(), minutes: date.getMinutes() };
	}
	static equal(left: Time, right: Time) {
		return left.hours === right.hours && left.minutes == right.minutes;
	}
	static less(left: Time, right: Time) {
		return left.hours < right.hours || (left.hours === right.hours && left.minutes < right.minutes);
	}
	static greater(left: Time, right: Time) {
		return left.hours > right.hours || (left.hours === right.hours && left.minutes > right.minutes);
	}
	static subtract(left: Time, right: Time): Time {
		let minutes = left.minutes - right.minutes + left.hours * 60 - right.hours * 60;
		const hours = Math.floor(minutes / 60);
		minutes %= 60;
		return { hours, minutes };
	}
	static add(left: Time, right: Time): Time {
		return {
			hours: left.hours + right.hours,
			minutes: left.minutes + right.minutes
		};
	}
}
type DateSpecific = readonly [month: number, date: number, year?: number];
interface RecurringEvent {
	readonly name: string;
	readonly id: string;
	readonly start: Time;
	readonly end: Time;
}
const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
export function formatAsClock(start: Time, end: Time) {
	const left = new Date();
	left.setHours(start.hours);
	left.setMinutes(start.minutes);
	const right = new Date();
	right.setHours(end.hours);
	right.setMinutes(end.minutes);
	return fmt.formatRange(left, right);
}
function match(matcher: Date) {
	return (value: DateSpecific) =>
		matcher.getMonth() === value[0] &&
		matcher.getDate() === value[1] &&
		(!value[2] || matcher.getFullYear() === value[2]);
}
export function* flatEvents(events: readonly RecurringEvent[], daysIntoFuture: number) {
	for (const { start, end, name } of events) {
		yield {
			time: Time.add(start, { hours: 24 * daysIntoFuture, minutes: 0 }),
			name: name.concat(' starts')
		};
		yield {
			time: Time.add(end, { hours: 24 * daysIntoFuture, minutes: 0 }),
			name: name.concat(' ends')
		};
	}
}
export function getSchedule<ScheduleKey>(
	forDate: Date,
	frozen: readonly [ScheduleKey, readonly DateSpecific[]][],
	fallback: Record<number, ScheduleKey>
) {
	const schedule = frozen.find(([, dates]) => dates.some(match(forDate)))?.[0];
	if (schedule) return schedule;

	const daySchedule = fallback[forDate.getDay()];
	return daySchedule;
}
