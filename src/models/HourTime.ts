import {DateTime} from "luxon";


class HourTime {
    start: DateTime;
    end: DateTime;

    constructor(start: DateTime, end: DateTime) {
        this.start = start;
        this.end = end;
    }
}

export default HourTime;