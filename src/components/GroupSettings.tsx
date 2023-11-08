import {ChangeEvent, useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Timetable from "../models/Timetable.ts";
import {Form} from "react-bootstrap";

interface Props {
    timetable: Timetable;
    selectedGroups: string[];
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function GroupSettings(props: Props) {
    const [selectedGroups, setSelectedGroups] = useState<string[]>(props.selectedGroups);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const group = e.target.dataset.detail!;

        setSelectedGroups((prevSelectedGroups) => {
            // The filter is basically an intersection of the two arrays. This cleans up any previously selected groups
            // that are no longer available.
            const arr = [];
            for (const row of props.timetable.groups) for (const e of row) arr.push(e);
            const newSelectedGroups = arr.filter((group) => prevSelectedGroups.includes(group));

            if (!newSelectedGroups.includes(group)) {
                for (const group_ of props.timetable.groups) {
                    if (!group_.includes(group)) {
                        continue;
                    }
                    for (const group__ of group_) {
                        const index = newSelectedGroups.indexOf(group__);
                        if (index != -1) {
                            newSelectedGroups.splice(index, 1);
                        }
                    }
                }

                newSelectedGroups.push(group);
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
                <div key={`inline-radio-${group}`}>
                {group.sort().map((group_) => (
                    <Form.Check
                        inline
                        label={`${group_}`}
                        name={`${group}`}
                        type={'radio'}
                        id={"input_groups_" + group_}
                        onChange={handleChange}
                        key={nanoid()}
                        data-detail={`${group_}`}
                        checked={selectedGroups.includes(group_)}
                    />
                ))}
                </div>
            ))}
        </>
    );
}

export default GroupSettings
