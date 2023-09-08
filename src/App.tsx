import './App.css'
import * as cheerio from 'cheerio';
import {useEffect, useState} from "react";
import Timetable from "./models/Timetable.ts";
import Day from "./models/Day.ts";
import Hour from "./models/Hour.ts";
import Lesson from "./models/Lesson.ts";

function App() {
    const [timetable, setTimetable] = useState<Timetable | null>();

    useEffect(() => {
        const url = 'https://delta-skola.bakalari.cz/Timetable/Public/Actual/Class/3Q';

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((htmlContent) => {
                const $ = cheerio.load(htmlContent);

                const days: Day[] = [];
                const cellWrappers = $(".bk-timetable-row > .bk-cell-wrapper");
                for (const cellWrapper of cellWrappers) {
                    const hours: Hour[] = [];

                    const cells = $(cellWrapper).find(".bk-timetable-cell");
                    for (const cell of cells) {
                        const lessons: Lesson[] = [];

                        const dayItems = $(cell).find(".day-item > .day-item-hover > .day-flex");
                        for (const dayItem of dayItems) {
                            const subject = $(dayItem).find(".middle").text();
                            const group = $(dayItem).find(".top > .left > div").text();
                            const room = $(dayItem).find(".top > .right > div").text();
                            const teacher = $(dayItem).find(".bottom > span").text();

                            const lesson: Lesson = {
                                subject: subject,
                                group: group ? group : null,
                                room: room,
                                teacher: teacher,
                            };
                            lessons.push(lesson);
                        }

                        const hour: Hour = {
                            lessons: lessons,
                        };
                        hours.push(hour);
                    }

                    const day: Day = {
                        name: "pondělí",
                        hours: hours,
                    }
                    days.push(day);
                }

                const timetable: Timetable = {
                    days: days,
                }

                console.log(timetable);
                setTimetable(timetable);
            })
            .catch((error) => {
                console.error('Error fetching webpage:', error);
            });
    }, []);

    return (
        <div>
            {timetable && <p>timetable</p>}
        </div>
    );
}

export default App
