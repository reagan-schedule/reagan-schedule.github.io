import { Temporal } from '@js-temporal/polyfill';
import { labels, specialDates as specials, type Label } from './data';
import { type Interval } from '$lib/atomic_future';
export { type Label, labels } from './data';

export function scheduleCollection() {
	const specialDates = specials;
	const allSchedules = labels;
	function getSchedule(time: Temporal.ZonedDateTime): Label | null {
		const result = specialDates.find(([predicate]) => {
			return predicate.some(
				(date) =>
					![time.month, time.day, time.year].some(
						(x, i) => i < date.length && x !== date[i]
					)
			);
		});
		if (result) {
			return result[1];
		}
		if (time.dayOfWeek === 4) {
			return 'STRIKE Schedule';
		}
		if (time.dayOfWeek >= 6) {
			return null;
		}
		return 'Regular Schedule';
	}
	function namedSchedule(label: Label) {
		return allSchedules[label];
	}
	function resolveSchedule(
		index: Temporal.ZonedDateTime,
		customSchedule: Label | Interval[] | null
	) {
		const schedule = customSchedule || getSchedule(index);
		if (typeof schedule === 'string') {
			return namedSchedule(schedule);
		}
		return schedule;
	}
	return { getSchedule, namedSchedule, resolveSchedule };
}
export abstract class ScheduleCollection {
	private static specialDates = specials;
	private static allSchedules = labels;
	static getSchedule(time: Temporal.ZonedDateTime): Label | null {
		const result = this.specialDates.find(([predicate]) => {
			return predicate.some(
				(date) =>
					![time.month, time.day, time.year].some(
						(x, i) => i < date.length && x !== date[i]
					)
			);
		});
		if (result) {
			return result[1];
		}
		if (time.dayOfWeek === 4) {
			return 'STRIKE Schedule';
		}
		if (time.dayOfWeek >= 6) {
			return null;
		}
		return 'Regular Schedule';
	}
	static namedSchedule(label: Label) {
		return this.allSchedules[label];
	}
	static resolveSchedule(
		index: Temporal.ZonedDateTime,
		customSchedule: Label | Interval[] | null
	) {
		const schedule = customSchedule || this.getSchedule(index);
		if (typeof schedule === 'string') {
			return this.namedSchedule(schedule);
		}
		return schedule;
	}
}
