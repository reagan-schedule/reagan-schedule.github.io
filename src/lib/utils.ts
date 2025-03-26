import type { Temporal } from "@js-temporal/polyfill";
import { schedules } from "../routes/db";

export function searchFuture(current: Temporal.Instant, overide) {
    let z = current.toZonedDateTimeISO('America/Chicago');
    for(let d = 0; d < 1000; d++, z = z.add('1d')) {
        let schedule = (d === 0 && overide) || schedules[keyFor(z)];
        for(let x of schedule) {
            x = z.with({ hour: x.hour, minute: x.minute })
        }
    }
}