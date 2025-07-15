interface Range<Bound> {
	lowerBound: Bound;
	upperBound: Bound;
}
export function range<T>(lower: T, upper: T): Range<T> {
	return { lowerBound: lower, upperBound: upper };
}
export class Compare<T> {
	protected compare: (one: T, two: T) => -1 | 0 | 1;
	constructor(compare: typeof this.compare) {
		this.compare = compare;
	}

	inRange(lower: T, range: Range<T>) {
		return (
			this.compare(lower, range.lowerBound) >= 0
			&& this.compare(lower, range.upperBound) < 0
		);
	}

	equal(one: T, two: T) {
		return this.compare(one, two) === 0;
	}
}
