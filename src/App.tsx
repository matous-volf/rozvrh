import "./App.css";
import {useCallback, useEffect, useState} from "react";
import Timetable from "./models/Timetable.ts";
import TimeRemaining from "./components/TimeRemaining.tsx";
import {DateTime} from "luxon";
import Lessons from "./components/Lessons.tsx";
import hourTimes from "./data/hourTimes.ts";
import {useCookies} from "react-cookie";
import GroupSettings from "./components/GroupSettings.tsx";
import {getTimetable} from "./api/bakalariScraper.ts";
import {useQuery} from "@tanstack/react-query";
import ClassIdSettings from "./components/ClassIdSettings.tsx";

function App() {
    const [cookies, setCookies] = useCookies(["selectedClassId", "selectedGroups"]);
    const selectedGroups: string[] = cookies.selectedGroups;
    if (selectedGroups === undefined) {
        setCookies("selectedGroups", []);
    }
    const selectedClassId: string = cookies.selectedClassId;
    if (selectedClassId === undefined) {
        setCookies("selectedClassId", null);
    }

    const [currentTime, setCurrentTime] = useState(DateTime.now());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(DateTime.now().minus({hour: 6, minute: 8, second: 0}));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            console.log(classId);
            setCookies("selectedClassId", classId);
        }, [setCookies]
    );

    const handleSelectedGroupsChange = useCallback((groups: string[]) => {
            console.log(groups);
            setCookies("selectedGroups", groups);
        }, [setCookies]
    );

    const {data, isLoading, isError} = useQuery({
        queryKey: ["timetable", selectedClassId, selectedGroups],
        queryFn: () => {
            if (selectedClassId === null) {
                return null;
            }

            return getTimetable(selectedClassId, selectedGroups)
        }
    });

    if (selectedClassId === null) {
        return (
            <>
                <p>Zvolte třídu a skupiny v nastavení.</p>
            </>
        )
    }

    if (isLoading) {
        return (
            <div>
                <p>Načítání...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <p>Načítání rozvrhu se nezdařilo.</p>
                <p>Zkontrolujte připojení k internetu.</p>
            </div>
        );
    }

    const timetable = data as Timetable;

    const dayIndex: number = currentTime.weekday - 3; // !!!
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
                <p>Můžete zvolit třídu a skupiny v nastavení.</p>
            </>
        )
    }

    return (
        <div>
            <ClassIdSettings selectedClassId={selectedClassId}
                             setSelectedClassIdCallback={handleSelectedClassIdChange}/>
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
