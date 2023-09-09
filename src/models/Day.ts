import Hour from "./Hour.ts";

class Day {
    hours: Hour[];

    constructor(hours: Hour[]) {
        this.hours = hours;
    }
}

export default Day;