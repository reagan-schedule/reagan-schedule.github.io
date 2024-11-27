export class Time {
	hours: number;
	minutes: number;
	constructor(hours: number, minutes: number) {
		this.hours = hours;
		this.minutes = minutes;
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
	static add(left: Time, { hours, minutes }: {hours?: number, minutes?: number}) {
		return new Time(left.hours+(hours??0),left.minutes+(minutes??0));
	}
}
const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
export function format(time: Time) {
	const nil = new Date(0);
	nil.setHours(time.hours, time.minutes);
	return fmt.format(nil);
}