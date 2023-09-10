import Timetable from "../models/Timetable.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {nanoid} from "nanoid";

interface Props {
    timetable: Timetable;
    selectedGroups: string[];
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function GroupSettings(props: Props) {
    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>(props.selectedGroups);

    useEffect(() => {
        const groups: string[] = [];
        for (const day of props.timetable.days) {
            for (const hour of day.hours) {
                for (const lesson of hour.lessons) {
                    if (lesson.group === null || lesson.group.trim() === "" || groups.includes(lesson.group)) {
                        continue;
                    }

                    groups.push(lesson.group);
                }
            }
        }
        setGroups(groups);
    }, [props.timetable.days]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const group = e.target.value;

        setSelectedGroups((prevSelectedGroups) => {
            // The filter is basically an intersection of the two arrays. This cleans up any previously selected groups
            // that are no longer available.
            const newSelectedGroups = groups.filter((group) => prevSelectedGroups.includes(group));

            if (e.target.checked && !newSelectedGroups.includes(group)) {
                newSelectedGroups.push(group);
            }
            if (!e.target.checked && newSelectedGroups.includes(group)) {
                const index = newSelectedGroups.indexOf(group);
                newSelectedGroups.splice(index, 1);
            }

            return newSelectedGroups;
        });
    };

    const setSelectedGroupsCallback = props.setSelectedGroupsCallback;
    useEffect(() => {
        setSelectedGroupsCallback(selectedGroups);
    }, [setSelectedGroupsCallback, selectedGroups]);

    return (
        <>
            {groups.sort().map((group) => (
                <div key={nanoid()}>
                    <input type="checkbox" name="groups" value={group} id={"input_groups_" + group}
                           onChange={handleChange} checked={selectedGroups.includes(group)}/>
                    <label htmlFor={"input_groups_" + group}>{group}</label>
                </div>
            ))}
        </>
    );
}

export default GroupSettings
