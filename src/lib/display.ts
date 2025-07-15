import { Intl as _Intl } from '@js-temporal/polyfill';

abstract class IntlFactory<T, U> extends Map<T, U> {
	protected readonly locales: string | string[] = [];
	constructor(locales: string | string[]) {
		super();
		this.locales = locales;
	}
	protected abstract make(k: T): U;
	get(k: T): U {
		return super.get(k) || super.set(k, this.make(k)).get(k);
	}
}

class IntlUnitFactory extends IntlFactory<
	NonNullable<Intl.NumberFormatOptions['unit']>,
	Intl.NumberFormat
> {
	make(k: NonNullable<Intl.NumberFormatOptions['unit']>) {
		return new Intl.NumberFormat(this.locales, { style: 'unit', unit: k });
	}
}

class IntlTimeFactory extends IntlFactory<
	NonNullable<Intl.DateTimeFormatOptions['timeStyle']>,
	_Intl.DateTimeFormat
> {
	make(k: NonNullable<Intl.DateTimeFormatOptions['timeStyle']>) {
		return new _Intl.DateTimeFormat(this.locales, { timeStyle: k });
	}
}

class IntlListFactory extends IntlFactory<
	NonNullable<Intl.ListFormatOptions['style']>,
	Intl.ListFormat
> {
	make(k: NonNullable<Intl.ListFormatOptions['style']>) {
		return new Intl.ListFormat(this.locales, { style: k });
	}
}

export class IntlContext {
	private readonly timeFormats: IntlTimeFactory;
	private readonly unitFormats: IntlUnitFactory;
	private readonly listFormats: IntlListFactory;
	constructor(locales: string | string[]) {
		this.timeFormats = new IntlTimeFactory(locales);
		this.unitFormats = new IntlUnitFactory(locales);
		this.listFormats = new IntlListFactory(locales);
	}
	withSeconds(time: { toPlainTime(): _Intl.Formattable }) {
		return this.timeFormats.get('medium').formatToParts(time.toPlainTime());
	}
	asRange(startDate: _Intl.Formattable, endDate: _Intl.Formattable) {
		return this.timeFormats.get('short').formatRange(startDate, endDate);
	}
	asList(...args: unknown[]) {
		return this.listFormats
			.get('long')
			.format(args.filter((temp) => typeof temp === 'string'));
	}
	unit(k: string) {
		return this.unitFormats.get(k);
	}
}
