//schedules
// thanks william :)

import { Time } from '../utils';

export const dates = {
	erDates: [
		[9, 11],
		[10, 4],
		[2, 7]
	], //24-25 school year, not including end of semester (they end at 1:20)
	sem1Dates: [[11, 17]], //finals day 1
	sem2Dates: [[11, 18]], //finals day 2
	sem3Dates: [[11, 19]], //finals day 3
	sem4Dates: [[11, 20]] //finals day 4
};
export const schedules = {
	regSchedule: [
		{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 45) },
		{ name: 'Period 2', id: 'p2', start: new Time(9, 50), end: new Time(10, 45) },
		{
			name: 'Period 3',
			id: 'p3',
			start: new Time(10, 50),
			end: new Time(11, 40)
		},
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(11, 45),
			end: new Time(12, 35)
		},
		{
			name: 'Period 5',
			id: 'p5',
			start: new Time(12, 40),
			end: new Time(13, 30)
		},
		{
			name: 'Period 6',
			id: 'p6',
			start: new Time(13, 35),
			end: new Time(14, 25)
		},
		{
			name: 'Period 7',
			id: 'p7',
			start: new Time(14, 30),
			end: new Time(15, 20)
		},
		{
			name: 'Period 8',
			id: 'p8',
			start: new Time(15, 25),
			end: new Time(16, 15)
		}
	],
	strikeSchedule: [
		{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 40) },
		{ name: 'Period 2', id: 'p2', start: new Time(9, 45), end: new Time(10, 30) },
		{
			name: 'STRIKE',
			id: 'strike',
			start: new Time(10, 35),
			end: new Time(11, 15)
		},
		{ name: 'Period 3', id: 'p3', start: new Time(11, 20), end: new Time(12, 5) },
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(12, 10),
			end: new Time(12, 55)
		},
		{ name: 'Period 5', id: 'p5', start: new Time(13, 0), end: new Time(13, 45) },
		{
			name: 'Period 6',
			id: 'p6',
			start: new Time(13, 50),
			end: new Time(14, 35)
		},
		{
			name: 'Period 7',
			id: 'p7',
			start: new Time(14, 40),
			end: new Time(15, 25)
		},
		{
			name: 'Period 8',
			id: 'p8',
			start: new Time(15, 30),
			end: new Time(16, 15)
		}
	],
	erSchedule: [
		{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 26) },
		{ name: 'Period 2', id: 'p2', start: new Time(9, 30), end: new Time(10, 6) },
		{
			name: 'Period 3',
			id: 'p3',
			start: new Time(10, 10),
			end: new Time(10, 45)
		},
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(10, 49),
			end: new Time(11, 24)
		},
		{ name: 'Period 5', id: 'p5', start: new Time(11, 28), end: new Time(12, 3) },
		{ name: 'Period 6', id: 'p6', start: new Time(12, 7), end: new Time(12, 42) },
		{
			name: 'Period 7',
			id: 'p7',
			start: new Time(12, 46),
			end: new Time(13, 21)
		},
		{ name: 'Period 8', id: 'p8', start: new Time(13, 25), end: new Time(14, 0) }
	],
	sem1Schedule: [
		{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 35) },
		{ name: 'Period 2', id: 'p2', start: new Time(9, 40), end: new Time(10, 25) },
		{
			name: 'Period 3',
			id: 'p3',
			start: new Time(10, 30),
			end: new Time(11, 15)
		},
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(11, 20),
			end: new Time(12, 30)
		},
		{
			name: 'Period 5',
			id: 'p5',
			start: new Time(12, 35),
			end: new Time(13, 20)
		},
		{
			name: 'Period 6',
			id: 'p6',
			start: new Time(13, 25),
			end: new Time(14, 35)
		},
		{
			name: 'Period 7',
			id: 'p7',
			start: new Time(14, 40),
			end: new Time(15, 25)
		},
		{
			name: 'Period 8',
			id: 'p8',
			start: new Time(15, 30),
			end: new Time(16, 15)
		}
	],
	sem2Schedule: [
		{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 35) },
		{ name: 'Period 2', id: 'p2', start: new Time(9, 40), end: new Time(10, 50) },
		{
			name: 'Period 3',
			id: 'p3',
			start: new Time(10, 55),
			end: new Time(11, 40)
		},
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(11, 45),
			end: new Time(12, 30)
		},
		{
			name: 'Period 5',
			id: 'p5',
			start: new Time(12, 35),
			end: new Time(13, 45)
		},
		{
			name: 'Period 6',
			id: 'p6',
			start: new Time(13, 50),
			end: new Time(14, 35)
		},
		{
			name: 'Period 7',
			id: 'p7',
			start: new Time(14, 40),
			end: new Time(15, 25)
		},
		{
			name: 'Period 8',
			id: 'p8',
			start: new Time(15, 30),
			end: new Time(16, 15)
		}
	],
	sem3Schedule: [
		{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(10, 5) },
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(10, 10),
			end: new Time(10, 45)
		},
		{
			name: 'Period 5',
			id: 'p5',
			start: new Time(10, 50),
			end: new Time(11, 25)
		},
		{ name: 'Period 6', id: 'p6', start: new Time(11, 30), end: new Time(12, 5) },
		{
			name: 'Period 7',
			id: 'p7',
			start: new Time(12, 10),
			end: new Time(13, 20)
		}
	],
	sem4Schedule: [
		{ name: 'Period 3', id: 'p3', start: new Time(8, 50), end: new Time(10, 5) },
		{
			name: 'Period 4',
			id: 'p4',
			start: new Time(10, 10),
			end: new Time(10, 45)
		},
		{
			name: 'Period 5',
			id: 'p5',
			start: new Time(10, 50),
			end: new Time(11, 25)
		},
		{ name: 'Period 6', id: 'p6', start: new Time(11, 30), end: new Time(12, 5) },
		{
			name: 'Period 8',
			id: 'p8',
			start: new Time(12, 10),
			end: new Time(13, 20)
		}
	],
	nil: []
};

export const scheduleByWeek = [
	'nil',
	'regSchedule',
	'regSchedule',
	'regSchedule',
	'strikeSchedule',
	'regSchedule',
	'nil'
];