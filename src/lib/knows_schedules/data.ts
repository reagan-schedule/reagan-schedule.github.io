import { Temporal } from '@js-temporal/polyfill';

const Time = Temporal.PlainTime;
export const specialDates: [MonthDayMaybeYear[], Label][] = [
	[[[5, 15]], 'Senior Exam Schedule 1'],
	[[[5, 16]], 'Senior Exam Schedule 2'],
	[[[5, 19]], 'Semester Exam Schedule 1'],
	[[[5, 20]], 'Semester Exam Schedule 2'],
	[[[5, 21]], 'Semester Exam Schedule 3'],
	[[[5, 22]], 'Semester Exam Schedule 4'],
];
type MonthDayMaybeYear = [number, number, number?];
//schedules

export const reg = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 45) },
	{ name: 'Period 2', id: 'p2', start: new Time(9, 50), end: new Time(10, 45) },
	{
		name: 'Period 3',
		id: 'p3',
		start: new Time(10, 50),
		end: new Time(11, 40),
	},
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(11, 45),
		end: new Time(12, 35),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(12, 40),
		end: new Time(13, 30),
	},
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 35),
		end: new Time(14, 25),
	},
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(14, 30),
		end: new Time(15, 20),
	},
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(15, 25),
		end: new Time(16, 15),
	},
];
export const strike = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 40) },
	{ name: 'Period 2', id: 'p2', start: new Time(9, 45), end: new Time(10, 30) },
	{
		name: 'STRIKE Time',
		id: 'STRIKE',
		start: new Time(10, 35),
		end: new Time(11, 15),
	},
	{ name: 'Period 3', id: 'p3', start: new Time(11, 20), end: new Time(12, 5) },
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(12, 10),
		end: new Time(12, 55),
	},
	{ name: 'Period 5', id: 'p5', start: new Time(13, 0), end: new Time(13, 45) },
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 50),
		end: new Time(14, 35),
	},
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(14, 40),
		end: new Time(15, 25),
	},
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(15, 30),
		end: new Time(16, 15),
	},
];
export const er = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 26) },
	{ name: 'Period 2', id: 'p2', start: new Time(9, 30), end: new Time(10, 6) },
	{
		name: 'Period 3',
		id: 'p3',
		start: new Time(10, 10),
		end: new Time(10, 45),
	},
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(10, 49),
		end: new Time(11, 24),
	},
	{ name: 'Period 5', id: 'p5', start: new Time(11, 28), end: new Time(12, 3) },
	{ name: 'Period 6', id: 'p6', start: new Time(12, 7), end: new Time(12, 42) },
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(12, 46),
		end: new Time(13, 21),
	},
	{ name: 'Period 8', id: 'p8', start: new Time(13, 25), end: new Time(14, 0) },
];
export const sem1 = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 35) },
	{ name: 'Period 2', id: 'p2', start: new Time(9, 40), end: new Time(10, 25) },
	{
		name: 'Period 3',
		id: 'p3',
		start: new Time(10, 30),
		end: new Time(11, 15),
	},
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(11, 20),
		end: new Time(12, 30),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(12, 35),
		end: new Time(13, 20),
	},
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 25),
		end: new Time(14, 35),
	},
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(14, 40),
		end: new Time(15, 25),
	},
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(15, 30),
		end: new Time(16, 15),
	},
];
export const sem2 = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 35) },
	{ name: 'Period 2', id: 'p2', start: new Time(9, 40), end: new Time(10, 50) },
	{
		name: 'Period 3',
		id: 'p3',
		start: new Time(10, 55),
		end: new Time(11, 40),
	},
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(11, 45),
		end: new Time(12, 30),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(12, 35),
		end: new Time(13, 45),
	},
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 50),
		end: new Time(14, 35),
	},
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(14, 40),
		end: new Time(15, 25),
	},
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(15, 30),
		end: new Time(16, 15),
	},
];
export const sem3 = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(10, 5) },
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(10, 10),
		end: new Time(10, 45),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(10, 50),
		end: new Time(11, 25),
	},
	{ name: 'Period 6', id: 'p6', start: new Time(11, 30), end: new Time(12, 5) },
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(12, 10),
		end: new Time(13, 20),
	},
];
export const sem4 = [
	{ name: 'Period 3', id: 'p3', start: new Time(8, 50), end: new Time(10, 5) },
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(10, 10),
		end: new Time(10, 45),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(10, 50),
		end: new Time(11, 25),
	},
	{ name: 'Period 6', id: 'p6', start: new Time(11, 30), end: new Time(12, 5) },
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(12, 10),
		end: new Time(13, 20),
	},
];
export const assembly = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 55) },
	{ name: 'Period 2', id: 'p2', start: new Time(10, 0), end: new Time(11, 0) },
	{ name: 'Period 3', id: 'p3', start: new Time(11, 5), end: new Time(12, 5) },
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(12, 10),
		end: new Time(12, 50),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(12, 55),
		end: new Time(13, 35),
	},
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 40),
		end: new Time(14, 20),
	},
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(14, 25),
		end: new Time(15, 25),
	},
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(15, 30),
		end: new Time(16, 15),
	},
];
export const senior1 = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(10, 5) },
	{
		name: 'Period 2',
		id: 'p2',
		start: new Time(10, 10),
		end: new Time(10, 55),
	},
	{ name: 'Period 3', id: 'p3', start: new Time(11, 0), end: new Time(11, 45) },
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(11, 50),
		end: new Time(12, 35),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(12, 40),
		end: new Time(13, 25),
	},
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 30),
		end: new Time(14, 15),
	},
	{
		name: 'Period 7',
		id: 'p7',
		start: new Time(14, 20),
		end: new Time(15, 30),
	},
	{
		name: 'Period 8',
		id: 'p8',
		start: new Time(15, 35),
		end: new Time(16, 15),
	},
];
export const senior2 = [
	{ name: 'Period 1', id: 'p1', start: new Time(8, 50), end: new Time(9, 35) },
	{ name: 'Period 2', id: 'p2', start: new Time(9, 40), end: new Time(10, 25) },
	{
		name: 'Period 3',
		id: 'p3',
		start: new Time(10, 30),
		end: new Time(11, 40),
	},
	{
		name: 'Period 4',
		id: 'p4',
		start: new Time(11, 45),
		end: new Time(12, 30),
	},
	{
		name: 'Period 5',
		id: 'p5',
		start: new Time(12, 35),
		end: new Time(13, 20),
	},
	{
		name: 'Period 6',
		id: 'p6',
		start: new Time(13, 25),
		end: new Time(14, 10),
	},
	{ name: 'Period 7', id: 'p7', start: new Time(14, 15), end: new Time(15, 0) },
	{ name: 'Period 8', id: 'p8', start: new Time(15, 5), end: new Time(16, 15) },
];
export const labels = {
	'Regular Schedule': reg,
	'STRIKE Schedule': strike,
	'Early Release Schedule': er,
	'Semester Exam Schedule 1': sem1,
	'Semester Exam Schedule 2': sem2,
	'Semester Exam Schedule 3': sem3,
	'Semester Exam Schedule 4': sem4,
	'Senior Exam Schedule 1': senior1,
	'Senior Exam Schedule 2': senior2,
	'Assembly Schedule': assembly,
};
export type Label = keyof typeof labels;
