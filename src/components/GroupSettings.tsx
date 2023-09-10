import Timetable from "../models/Timetable.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {nanoid} from "nanoid";

interface Props {
    timetable: Timetable;
    selectedGroups: string[];
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function GroupSettings(props: Props) {
    const [selectedGroups, setSelectedGroups] = useState<string[]>(props.selectedGroups);

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
            {props.timetable.groups.sort().map((group) => (
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
