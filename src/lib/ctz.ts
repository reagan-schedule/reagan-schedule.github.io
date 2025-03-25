export let rebase = (() => {
	let date = new Date();
	let fmt = new Intl.DateTimeFormat(undefined, {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		fractionalSecondDigits: 3,
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		timeZone: 'America/Chicago',
	});
	return function (dateValue: number) {
		date.setTime(dateValue);
		date.setTime(Date.parse(fmt.format(date)));
		return date;
	}
})();

export function getSchedule<K>(dateObj: Date, special: readonly [K, readonly number[][]][], fallback: Record<number, K>) {
	let schedule = special.find(([, dates]) => dates.some((date) => dateObj.getMonth() === date[0] && dateObj.getDate() === date[1]))?.[0];
	if(schedule){
		return schedule;
	}
	return fallback[dateObj.getDay()];
}

export class Time {
	readonly hours: number;
	readonly minutes: number;
	constructor(hours: number, minutes: number) {
		this.hours = hours;
		this.minutes = minutes;
	}
}

interface Segment {
	readonly id: string;
	readonly name: string;
	readonly start: Time;
	readonly end: Time;
}
interface ScheduleGetter {
	(dateObj: Date): readonly Segment[];
}
type FutureReturn = [shouldUpdate: number, future?: {
	event: string;
	time: number;
}];
export function obtainFuture(dateValue: number, getter: ScheduleGetter, fallback: readonly Segment[] | null): FutureReturn {
	let dateObj = rebase(dateValue);
	dateValue = dateObj.getTime();
	for(let days = 0; days < 1000; dateObj.setDate(dateObj.getDate() + 1), days++){
		// only issue is that i assume that the local calendar kind of matches up with the CTZ calendar
		// true in some ways bc both are gregory
		let schedule = (days === 0 && fallback) || getter(dateObj);
		let time = dateObj.getTime();
		for(let seg of schedule) {
			dateObj.setHours(seg.start.hours, seg.start.minutes, 0, 0);
			if(dateObj.getTime() > dateValue){
				return [dateObj.getTime() - dateValue, { event: seg.name + ' starts', time: dateObj.getTime() }];
			}
			dateObj.setHours(seg.end.hours, seg.end.minutes, 0, 0);
			if(dateObj.getTime() > dateValue){
				return [dateObj.getTime() - dateValue, { event: seg.name + ' ends', time: dateObj.getTime() }];
			}
		}
		dateObj.setTime(time);
	}
	return [0];
}