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
export type SpecialDate =
	| [month: number, date: number]
	| [month: number, date: number, year: number];
export type DailyEvent = { name: string; id: string; start: Time; end: Time };
type RelativeTimeFormat = { hours?: number; minutes?: number };
type NamedTime = { time: Time; name: string };
export function matchDate(current_time: Date, specialDate: SpecialDate) {
	return (
		current_time.getMonth() === specialDate[0] &&
		current_time.getDate() === specialDate[1] &&
		(specialDate.length === 2 || current_time.getFullYear() === specialDate[2])
	);
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
export function upperBound(times: NamedTime[], value: Time) {
	return times.find(({ time }) => Time.greater(time, value));
}
