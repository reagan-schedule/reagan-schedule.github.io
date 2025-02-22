export class Time {
	hours: number;
	minutes: number;
	constructor(hours: number, minutes: number) {
		this.hours = hours;
		this.minutes = minutes;
	}
	static fromDate(date: Date) {
		return new Time(date.getHours(), date.getMinutes());
	}
	static equal(left: Time, right: Time) {
		return left.hours === right.hours && left.minutes === right.minutes;
	}
	static less(left: Time, right: Time) {
		return left.hours < right.hours || (left.hours === right.hours && left.minutes < right.minutes);
	}
	static greater(left: Time, right: Time) {
		return left.hours > right.hours || (left.hours === right.hours && left.minutes > right.minutes);
	}
	static subtract(left: Time, right: Time) {
		let minutes = left.minutes - right.minutes + left.hours * 60 - right.hours * 60;
		const hours = Math.floor(minutes / 60);
		minutes %= 60;
		return { hours, minutes };
	}
	static add(left: Time, { hours = 0, minutes = 0 }: RelativeTimeFormat) {
		return new Time(left.hours + hours, left.minutes + minutes);
	}
}
const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
export function format(time: Time) {
	const nil = new Date(0);
	nil.setHours(time.hours, time.minutes);
	return fmt.format(nil);
}
export type MonthDay = [month: number, date: number];
export type MonthDayYear = [month: number, date: number, year: number];
export type DailyEvent = { name: string; id: string; start: Time; end: Time };
export type RelativeTimeFormat = { hours?: number; minutes?: number };
export type NamedTime = { time: Time; name: string };
export function matchDate(matcher: Date) {
	return (value: MonthDay | MonthDayYear) =>
		matcher.getMonth() === value[0] &&
		matcher.getDate() === value[1] &&
		(value.length === 2 || matcher.getFullYear() === value[2]);
}
export function toFlatTimeArray(
	events: DailyEvent[],
	{ hours = 0, minutes = 0 }: RelativeTimeFormat = {}
): NamedTime[] {
	return events.flatMap(({ start, end, name }) => [
		{ time: Time.add(start, { hours, minutes }), name: `${name} starts` },
		{ time: Time.add(end, { hours, minutes }), name: `${name} ends` }
	]);
}
export function upperBound(range: NamedTime[], value: Time) {
	return range.find(({ time }) => Time.greater(time, value));
}
