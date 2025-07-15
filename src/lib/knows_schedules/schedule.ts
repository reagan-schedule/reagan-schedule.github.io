import type { Temporal } from "@js-temporal/polyfill";
import { labels, specialDates, type Label } from "./data";
export type { Label } from "./data";

export class ScheduleCollection {
    private specialDates = specialDates;
    private allSchedules = labels;
    getSchedule(time: Temporal.ZonedDateTime): Label | null {
        const result = this.specialDates.find(([predicate, ]) => {
            return predicate.some((date) => ![time.month, time.day, time.year].some((x, i) => i < date.length && x !== date[i]));
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
    namedSchedule(label: Label) {
        return this.allSchedules[label];
    }
}