export let local = {
    regSchedule: 'Regular Schedule',
    strikeSchedule: 'STRIKE Schedule',
    erSchedule: 'Early Release',
    sem1Schedule: 'Finals Day 1',
    sem2Schedule: 'Finals Day 2',
    sem3Schedule: 'Finals Day 3',
    sem4Schedule: 'Finals Day 4',
    nil: null,
} as const;
export let pickableKeys = [
    'regSchedule',
    'strikeSchedule',
    'erSchedule',
    'sem1Schedule',
    'sem2Schedule',
    'sem3Schedule',
    'sem4Schedule'
] as const;