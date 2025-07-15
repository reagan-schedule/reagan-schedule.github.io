import { tr } from '$lib/atomic_future';
import { Compare, range } from '$lib/compare';
import { Temporal } from '@js-temporal/polyfill';

export abstract class TimeSkipService {
	private static timeSkips = [
		range(tr([5, 23, 2025]), tr([8, 11, 2025])),
		range(tr([9, 1, 2025]), tr([9, 2, 2025])),
	];
	private static comparator = new Compare(Temporal.PlainDate.compare);
	static applyTimeSkip(index: Temporal.ZonedDateTime) {
		const result = this.timeSkips.find((range) =>
			this.comparator.inRange(index, range)
		);
		let indexModified = false;
		if (result) {
			index = index.with(result.upperBound);
			indexModified = true;
		}
		return { nextIndex: index, indexModified };
	}
}
