import HourTime from "../models/HourTime.ts";
import {DateTime} from "luxon";

const definitions = [
    {"start": {"hour": 7, "minute": 10}, "end": {"hour": 7, "minute": 55}},
    {"start": {"hour": 8, "minute": 0}, "end": {"hour": 8, "minute": 45}},
    {"start": {"hour": 8, "minute": 50}, "end": {"hour": 9, "minute": 35}},
    {"start": {"hour": 9, "minute": 50}, "end": {"hour": 10, "minute": 35}},
    {"start": {"hour": 10, "minute": 40}, "end": {"hour": 11, "minute": 25}},
    {"start": {"hour": 11, "minute": 35}, "end": {"hour": 12, "minute": 20}},
    {"start": {"hour": 12, "minute": 25}, "end": {"hour": 13, "minute": 10}},
    {"start": {"hour": 13, "minute": 15}, "end": {"hour": 14, "minute": 0}},
    {"start": {"hour": 14, "minute": 0}, "end": {"hour": 14, "minute": 45}},
    {"start": {"hour": 14, "minute": 45}, "end": {"hour": 15, "minute": 30}},
    {"start": {"hour": 15, "minute": 35}, "end": {"hour": 16, "minute": 20}},
    {"start": {"hour": 16, "minute": 20}, "end": {"hour": 17, "minute": 5}},
    {"start": {"hour": 17, "minute": 5}, "end": {"hour": 17, "minute": 50}},
    {"start": {"hour": 18, "minute": 0}, "end": {"hour": 18, "minute": 45}},
    {"start": {"hour": 18, "minute": 50}, "end": {"hour": 19, "minute": 35}},
    {"start": {"hour": 19, "minute": 40}, "end": {"hour": 20, "minute": 25}}
];

const hourTimes: HourTime[] = [];
for (const definition of definitions) {
    hourTimes.push({
        start: DateTime.fromObject(definition.start),
        end: DateTime.fromObject(definition.end)
    });
}

export default hourTimes;
