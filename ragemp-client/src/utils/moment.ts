// Modules
import moment from 'moment';

// Locale
const relativeTime = (number: number, _: ExpectedAny, key: string) => {
	const format: { [key: string]: string } = {
		ss: 'secunde',
		mm: 'minute',
		hh: 'ore',
		dd: 'zile',
		ww: 'săptămâni',
		MM: 'luni',
		yy: 'ani'
	};

	return `${number}${number % 100 >= 20 || (number >= 100 && number % 100 === 0) ? ' de ' : ' '}${
		format[key]
	}`;
};

moment.defineLocale('ro', {
	months: [
		'ianuarie',
		'februarie',
		'martie',
		'aprilie',
		'mai',
		'iunie',
		'iulie',
		'august',
		'septembrie',
		'octombrie',
		'noiembrie',
		'decembrie'
	],

	monthsShort: [
		'ian',
		'feb',
		'mart',
		'apr',
		'mai',
		'iun',
		'iul',
		'aug',
		'sept',
		'oct',
		'nov',
		'dec'
	],

	monthsParseExact: true,

	weekdays: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],

	weekdaysShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],

	weekdaysMin: ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ'],

	longDateFormat: {
		LT: 'H:mm',
		LTS: 'H:mm:ss',
		L: 'DD.MM.YYYY',
		LL: 'D MMMM YYYY',
		LLL: 'D MMMM YYYY H:mm',
		LLLL: 'dddd, D MMMM YYYY H:mm'
	},

	calendar: {
		sameDay: '[azi la] LT',
		nextDay: '[mâine la] LT',
		nextWeek: 'dddd [la] LT',
		lastDay: '[ieri la] LT',
		lastWeek: '[fosta] dddd [la] LT',
		sameElse: 'L'
	},

	relativeTime: {
		future: 'peste %s',
		past: '%s în urmă',
		s: 'câteva secunde',
		ss: relativeTime,
		m: 'un minut',
		mm: relativeTime,
		h: 'o oră',
		hh: relativeTime,
		d: 'o zi',
		dd: relativeTime,
		w: 'o săptămână',
		ww: relativeTime,
		M: 'o lună',
		MM: relativeTime,
		y: 'un an',
		yy: relativeTime
	},

	week: {
		dow: 1,
		doy: 7
	}
});
