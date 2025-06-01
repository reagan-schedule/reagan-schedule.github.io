import { Temporal } from '@js-temporal/polyfill';
import {
	assemblyDates,
	erDates,
	holidayDates,
	schedules,
	sem1Dates,
	sem2Dates,
	sem3Dates,
	sem4Dates
} from './imutable';

type CopyKeys<K, U> = K extends Record<infer T, unknown> ? Record<T, U> : unknown;
type Entries<U> = U extends Record<infer K, infer V> ? ReadonlyArray<readonly [K, V]> : unknown;
type Values<U> = U extends Record<infer K, infer V> ? V : unknown;

export function getSchedule(time: Temporal.ZonedDateTime): keyof typeof schedules | null {
	const keyDates: Entries<CopyKeys<typeof schedules, ReadonlyArray<readonly number[]>>> = [
		['assemblySchedule', assemblyDates],
		['erSchedule', erDates],
		['sem1Schedule', sem1Dates],
		['sem2Schedule', sem2Dates],
		['sem3Schedule', sem3Dates],
		['sem4Schedule', sem4Dates],
		['holidaySchedule', holidayDates],
	];
	for (const [key, dates] of keyDates) {
		if (
			dates.some(
				(date) =>
					![time.month, time.day, time.year].some((x, i) => i < date.length && x !== date[i])
			)
		) {
			return key;
		}
	}
	if (time.dayOfWeek === 4) {
		return 'strikeSchedule';
	}
	if (time.dayOfWeek >= 6) {
		return null;
	}
	return 'regSchedule';
}
export function future(
	time: Temporal.Instant,
	overide: keyof typeof schedules | null | Values<typeof schedules>,
) {
	const timeSkipRanges: ReadonlyArray<ReadonlyArray<readonly number[]>> = [
		[[5, 24, 2024], [8, 11, 2024]],
		[[9, 2, 2024], [9, 2, 2024]],
		[[11, 25, 2024], [11, 29, 2024]],
		[[12, 23, 2024], [1, 3, 2025]], // pain
		[[1, 20, 2025], [1, 20, 2025]],
		[[3, 10, 2025], [3, 14, 2025]],
		[[4, 18, 2025], [4, 18, 2025]],
		[[5, 2, 2025], [5, 2, 2025]],
	];
	// b/c all disjoint, no hard logic
	// assume its annual
	for (let z = time.toZonedDateTimeISO('America/Chicago'), d = 0; d < 1000; z = z.add({ days: 1 }), d++) {
		const applicableRanges = timeSkipRanges.filter(([start, end]) => Temporal.PlainDate.compare(z.toPlainDate(), { year: z.year, month: start[0], day: start[1] }) >= 0 && Temporal.PlainDate.compare(z.toPlainDate(), { year: z.year + end[2] - start[2], month: end[0], day: end[1] }) < 0);
		if (applicableRanges.length > 0) {
			const [rangeStart, rangeEnd] = applicableRanges.reduce(([bestStart, bestEnd], [currentStart, currentEnd]) => Temporal.PlainDate.compare({ year: z.year + bestEnd[2] - currentStart[2], month: bestEnd[0], day: bestEnd[1] }, { year: z.year + currentEnd[2] - currentStart[2], month: currentEnd[0], day: currentEnd[1] }) > 0 ? [currentStart, currentEnd] : [bestStart, bestEnd]);
			z = z.with({ year: z.year + rangeEnd[2] - rangeStart[2], month: rangeEnd[0], day: rangeEnd[1] });
			continue;
		}
		// continue before this line means you can't override
		let schedule = (d === 0 && overide) || getSchedule(z);
		if (schedule === null) continue;
		if (typeof schedule === 'string') schedule = schedules[schedule];
		for (const interval of schedule) {
			for (const end of ['start', 'end'] as const) {
				const zWithTime = z.withPlainTime(interval[end]).toInstant();
				if (Temporal.Instant.compare(zWithTime, time) > 0) {
					return {
						when: zWithTime,
						what: [interval, end] as const,
						shouldUpdate: time.until(zWithTime, {
							roundingMode: 'ceil',
							smallestUnit: 'millisecond',
							largestUnit: 'millisecond'
						}).milliseconds
					};
				}
			}
		}
	}
	return { shouldUpdate: 0 };
}
export function localize(key: keyof typeof schedules) {
	const localization: Partial<CopyKeys<typeof schedules, string>> = {
		erSchedule: 'Early Release',
		regSchedule: 'Regular Schedule',
		strikeSchedule: 'Strike Schedule'
	};
	return localization[key];
}
