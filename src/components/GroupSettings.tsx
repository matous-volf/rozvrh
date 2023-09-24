import {ChangeEvent, useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Timetable from "../models/Timetable.ts";
import {FormCheck} from "react-bootstrap";

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
            const newSelectedGroups = props.timetable.groups.filter((group) => prevSelectedGroups.includes(group));

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
            <h2>Skupiny</h2>
            <p>Své skupiny najdete v rozvrhu aplikace Bakaláři.</p>

            {props.timetable.groups.length < 1 && <p>Nejsou k dispozici žádné skupiny.</p>}

            {props.timetable.groups.sort().map((group) => (
                <FormCheck name="groups" value={group} id={"input_groups_" + group} onChange={handleChange}
                           checked={selectedGroups.includes(group)} label={group} key={nanoid()}>
                </FormCheck>
            ))}

        </>
    );
}

export default GroupSettings
