import { Temporal } from '@js-temporal/polyfill';
import { range, type Compare } from './compare';

interface Interval {
	name: string;
	start: Temporal.PlainTime;
	end: Temporal.PlainTime;
}
interface LazyItem {
	firstDay: Temporal.ZonedDateTime;
	day: Temporal.ZonedDateTime;
	schedule: Interval[];
}
interface Boundary {
	name: string;
	kind: 'start' | 'end';
	at: Temporal.ZonedDateTime;
	reference: Temporal.ZonedDateTime;
}
function tr([month, day, year]: [
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
		comparator,
		collection,
	}: {
		comparator: Compare<Temporal.PlainDateLike>;
		collection: {
			namedSchedule(label: Label): Interval[];
			getSchedule(day: Temporal.ZonedDateTime): Label | null;
		};
	}
): Generator<LazyItem> {
	const firstDay = Temporal.ZonedDateTime.from(startDate);
	let isFirst = true;
	for (; ; startDate = startDate.add('P1D')) {
		applyTimeSkip(); // Passed in
		let schedule =
			(isFirst && customSchedule) || collection.getSchedule(startDate);
		if (!schedule) {
			continue;
		}
		if (typeof schedule === 'string') {
			schedule = collection.namedSchedule(schedule);
		}
		yield {
			firstDay,
			day: startDate,
			schedule,
		};
		isFirst = false;
	}
	function applyTimeSkip() {
		const timeSkips = [
			range(tr([5, 23, 2025]), tr([8, 11, 2025])),
			range(tr([9, 1, 2025]), tr([9, 2, 2025])),
		];
		const result = timeSkips.find((range) =>
			comparator.inRange(startDate, range)
		);
		if (!result) {
			return;
		}
		startDate = startDate.with(result.upperBound);
		isFirst = false;
	}
}
export function* applySchedule({
	firstDay,
	day,
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
