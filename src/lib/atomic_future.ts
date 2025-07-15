import { Temporal } from '@js-temporal/polyfill';
export { Temporal };

export interface Interval {
	name: string;
	start: Temporal.PlainTime;
	end: Temporal.PlainTime;
}
interface LazyItem {
	firstIndex: Temporal.ZonedDateTime;
	index: Temporal.ZonedDateTime;
	schedule: Interval[];
}
interface Boundary {
	name: string;
	kind: 'start' | 'end';
	at: Temporal.ZonedDateTime;
	reference: Temporal.ZonedDateTime;
}
export function tr([month, day, year]: [
	number,
	number,
	number,
]): Temporal.PlainDateLike {
	return { year, month, day };
}
export function* futureSchedules<Label extends string>(
	startDate: Temporal.ZonedDateTime,
	customSchedule: Label | Interval[] | null,
	{
		resolver,
		timeSkipService,
	}: {
		resolver: {
			resolveSchedule(
				index: Temporal.ZonedDateTime,
				customSchedule: Label | Interval[] | null
			): Interval[] | null;
		};
		timeSkipService: {
			applyTimeSkip(index: Temporal.ZonedDateTime): {
				nextIndex: Temporal.ZonedDateTime;
				indexModified: boolean;
			};
		};
	}
): Generator<LazyItem> {
	const firstIndex = Temporal.ZonedDateTime.from(startDate);
	for (; ; startDate = startDate.add('P1D')) {
		const { nextIndex, indexModified } =
			timeSkipService.applyTimeSkip(startDate);
		startDate = nextIndex;
		if (indexModified) {
			customSchedule = null;
		}
		const schedule = resolver.resolveSchedule(startDate, customSchedule);
		customSchedule = null;
		if (!schedule) {
			continue;
		}
		yield { firstIndex, index: startDate, schedule };
		// if we had customSchedule = null here, we could apply customSchedule to the first Monday after the weekend if today was a Saturday or Sunday.
		// that would allow very complex and unpredictable behavior.
		// more importantly, it would break the principle of not being able to change any schedule but todays.
	}
}
export function* applySchedule({
	firstIndex: firstDay,
	index: day,
	schedule,
}: LazyItem): Generator<Boundary> {
	for (const { name, start, end } of schedule) {
		yield {
			name,
			kind: 'start',
			at: day.withPlainTime(start),
			reference: firstDay,
		};

		yield {
			name,
			kind: 'end',
			at: day.withPlainTime(end),
			reference: firstDay,
		};
	}
}
export function upperBound(boundary: Boundary) {
	return Temporal.ZonedDateTime.compare(boundary.at, boundary.reference) > 0;
}
export function difference(
	one: Temporal.ZonedDateTime,
	two: Temporal.ZonedDateTime
) {
	return one.epochMilliseconds - two.epochMilliseconds;
}
