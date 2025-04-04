import { Temporal } from '@js-temporal/polyfill';
import {
	assemblyDates,
	erDates,
	schedules,
	sem1Dates,
	sem2Dates,
	sem3Dates,
	sem4Dates
} from './imutable';

type CopyKeys<K, U> = K extends Record<infer T, unknown> ? Record<T, U> : unknown;
type Entries<U> = U extends Record<infer K, infer V> ? ReadonlyArray<readonly [K, V]> : unknown;

export function getSchedule(time: Temporal.ZonedDateTime): keyof typeof schedules | null {
	const searchableDates: Entries<CopyKeys<typeof schedules, ReadonlyArray<readonly number[]>>> = [
		['assemblySchedule', assemblyDates],
		['erSchedule', erDates],
		['sem1Schedule', sem1Dates],
		['sem2Schedule', sem2Dates],
		['sem3Schedule', sem3Dates],
		['sem4Schedule', sem4Dates]
	];
	for (const [key, dates] of searchableDates) {
		if (
			dates.some(
				(date) => ![time.month, time.day, time.year].some((x, i) => i < date.length && x != date[i])
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
export function future(time: Temporal.Instant, overide: keyof typeof schedules | null) {
	for (let z = time.toZonedDateTimeISO('America/Chicago'), d = 0; d < 1000; z = z.add('P1d'), d++) {
		const schedule = (d === 0 && overide) || getSchedule(z);
		for (const interval of schedule ? schedules[schedule] : []) {
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
