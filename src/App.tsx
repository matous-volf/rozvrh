import "./App.css"
import * as cheerio from "cheerio";
import {useCallback, useEffect, useState} from "react";
import Timetable from "./models/Timetable.ts";
import Day from "./models/Day.ts";
import Hour from "./models/Hour.ts";
import Lesson from "./models/Lesson.ts";
import TimeRemaining from "./components/TimeRemaining.tsx";
import {DateTime} from "luxon";
import Lessons from "./components/Lessons.tsx";
import hourTimes from "./data/hourTimes.ts";
import {useCookies} from "react-cookie";
import GroupSettings from "./components/GroupSettings.tsx";

function App() {
    const [cookies, setCookies] = useCookies(["selectedGroups"]);
    const selectedGroups: string[] = cookies.selectedGroups;
    if (selectedGroups === undefined) {
        setCookies("selectedGroups", ["S1", "ZIM"]);
    }

    const [timetable, setTimetable] = useState<Timetable | null>(null);

    useEffect(() => {
        const url = "https://delta-skola.bakalari.cz/Timetable/Public/Actual/Class/3Q";

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
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

                            lessons.push(new Lesson(subject, group, room, teacher));
                        }

                        const selectedLesson = lessons.find((lesson) =>
                            lesson.group === null || selectedGroups.includes(lesson.group));

                        hours.push(new Hour(lessons, selectedLesson !== undefined ? selectedLesson : null));
                    }

                    days.push(new Day(hours));
                }

                const timetable = new Timetable(days);

                setTimetable(timetable);
            })
            .catch((error) => {
                console.error("Error fetching webpage:", error);
            });
    }, [selectedGroups]);

    const [currentTime, setCurrentTime] = useState(DateTime.now());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(DateTime.now());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const handleSelectedGroupsChange = useCallback((groups: string[]) => {
            console.log(groups);
            setCookies("selectedGroups", groups);
        }, [setCookies]
    );

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
                <p>Dnes není pracovní den.</p>
            </>
        )
    }

    const hours = timetable.days[dayIndex].hours;
    const firstHourIndex = hours.findIndex((hour) => hour.isSelected);
    const lastHourIndex = hours.findLastIndex((hour) => hour.isSelected);

    if (firstHourIndex === -1 || lastHourIndex === -1) {
        return (
            <>
                <p>Dnes není žádné vyučování.</p>
                <p>Můžete si upravit třídu a skupiny v nastavení.</p>
            </>
        )
    }

    return (
        <div>
            <GroupSettings timetable={timetable} selectedGroups={selectedGroups}
                           setSelectedGroupsCallback={handleSelectedGroupsChange}/>
            <p>{currentTime.toFormat("HH:mm:ss")}</p>
            <TimeRemaining currentTime={currentTime} hourTimes={hourTimes} hours={hours} firstHourIndex={firstHourIndex}
                           lastHourIndex={lastHourIndex} selectedGroups={selectedGroups}/>
            <Lessons currentTime={currentTime} hourTimes={hourTimes} hours={hours} firstHourIndex={firstHourIndex}
                     lastHourIndex={lastHourIndex} selectedGroups={selectedGroups}/>
        </div>
    );
}

export default App
