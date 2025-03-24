export class Time {
	readonly hours: number;
	readonly minutes: number;
	constructor(hours: number, minutes: number) {
		this.hours = hours;
		this.minutes = minutes;
	}
}
export interface Segment {
	name: string;
	id: string;
	start: Time;
	end: Time;
}
const _date = new Date();
function getIsChicagoCDTRightNow() {
	_date.setTime(Date.now());
	return new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/Chicago',
		timeZoneName: 'short'
	})
		.format(_date)
		.includes('CDT');
}
export function* realTime(segments: readonly Segment[], realDay: Date) {
	// setUTCHours in CDT/CST appropriately
	for (const segment of segments) {
		const hours = getIsChicagoCDTRightNow() ? -5 : -6;
		realDay.setUTCHours(segment.start.hours - hours, segment.start.minutes);
		yield {
			name: segment.name.concat(' starts'),
			time: realDay.getTime()
		};
		realDay.setUTCHours(segment.end.hours - hours, segment.end.minutes);
		yield {
			name: segment.name.concat(' ends'),
			time: realDay.getTime()
		};
	}
}
function match(dateObject: Date) {
	return (value: readonly number[]) =>
		dateObject.getUTCMonth() === value[0] &&
		dateObject.getUTCDate() === value[1] &&
		(!value[2] || dateObject.getUTCFullYear() === value[2]);
}
export function getSchedule<ScheduleKey>(
	dateObject: Date,
	constant: readonly [ScheduleKey, readonly number[][]][],
	fallback: Record<number, ScheduleKey>
) {
	const schedule = constant.find(([, dates]) => dates.some(match(dateObject)))?.[0];
	if (schedule) return schedule;
	const daySchedule = fallback[dateObject.getUTCDay()];
	return daySchedule;
}
const fmt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });
export function formatSegment(segment: Segment) {
	const start = new Date();
	const end = new Date();
	// idk if i should show the schedule times in the CTZ or in local time
	if (fmt.resolvedOptions().timeZone === 'America/Chicago') {
		// this is true if i set fmt to format as an America/Chicago time
		const hours = getIsChicagoCDTRightNow() ? -5 : -6;
		start.setUTCHours(segment.start.hours - hours, segment.start.minutes);
		end.setUTCHours(segment.end.hours - hours, segment.end.minutes);
	} else {
		// both will show the exact same thing, but above is the *real* Chicago time which could easily be formatted to a time in another TZ
		start.setHours(segment.start.hours, segment.start.minutes);
		end.setHours(segment.end.hours, segment.end.minutes);
	}
	return fmt.formatRange(start, end);
}
export function adjustClock(dateObject: Date) {
	// modify basis vectors so our basis is in CTZ (basis=UTC)
	const hours = getIsChicagoCDTRightNow() ? -5 : -6;
	dateObject.setUTCHours(dateObject.getUTCHours() + hours);
}
