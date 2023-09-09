import './App.css'
import * as cheerio from 'cheerio';
import {useEffect, useState} from "react";
import Timetable from "./models/Timetable.ts";
import Day from "./models/Day.ts";
import Hour from "./models/Hour.ts";
import Lesson from "./models/Lesson.ts";
import TimeRemaining from "./components/TimeRemaining.tsx";
import {DateTime} from "luxon";
import Lessons from "./components/Lessons.tsx";
import hourTimes from "./data/hourTimes.ts";

function App() {
    const [timetable, setTimetable] = useState<Timetable | null>(null);

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

    const [currentTime, setCurrentTime] = useState(DateTime.now());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(DateTime.now().minus({hour: 0, minute: 0, second: 0}));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    if (timetable === null) {
        return (
            <div>
                <p>Načítání...</p>
            </div>
        );
    }

    const dayIndex: number = currentTime.weekday - 1;
    if (dayIndex > 4) {
        return (
            <>
                <p>Dnes vyučování neprobíhá.</p>
            </>
        )
    }

    const hours = timetable.days[dayIndex].hours;
    const firstHourIndex = hours.findIndex((hour) => {
        return hour.lessons.length > 0;
    });
    const lastHourIndex = hours.findLastIndex((hour) => {
        return hour.lessons.length > 0;
    });

    return (
        <div>
            <p>{currentTime.toFormat("HH:mm:ss")}</p>
            <TimeRemaining currentTime={currentTime} hourTimes={hourTimes} firstHourIndex={firstHourIndex}
                           lastHourIndex={lastHourIndex}/>
            <Lessons currentTime={currentTime} hourTimes={hourTimes} hours={hours} firstHourIndex={firstHourIndex}
                     lastHourIndex={lastHourIndex}/>
        </div>
    );
}

export default App
