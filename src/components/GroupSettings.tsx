import {ChangeEvent, useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Timetable from "../models/Timetable.ts";
import {FormCheck} from "react-bootstrap";

interface Props {
    timetable: Timetable;
    selectedGroupIds: string[];
    setSelectedGroupIdsCallback: (groupIds: string[]) => void;
}

function GroupSettings(props: Props) {
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(props.selectedGroupIds);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedGroupId = e.target.dataset.groupId!;

        setSelectedGroupIds((prevSelectedGroupIds) => {
            // This cleans up any previously selected groups that are no longer available.
            const newSelectedGroupIds: string[] = [];
            for (const groupGroup of props.timetable.groupGroups) {
                for (const group of groupGroup) {
                    if (prevSelectedGroupIds.includes(group.id)) {
                        newSelectedGroupIds.push(group.id);
                    }
                }
            }

            if (!newSelectedGroupIds.includes(selectedGroupId)) {
                for (const groupGroup of props.timetable.groupGroups) {
                    if (!groupGroup.some((group) => group.id == selectedGroupId)) {
                        continue;
                    }

                    for (const group of groupGroup) {
                        const index = newSelectedGroupIds.indexOf(group.id);
                        if (index === -1) {
                            continue;
                        }

                        newSelectedGroupIds.splice(index, 1);
                    }
                }

                newSelectedGroupIds.push(selectedGroupId);
            }

            return newSelectedGroupIds;
        });
    };

    const setSelectedGroupIdsCallback = props.setSelectedGroupIdsCallback;
    useEffect(() => {
        setSelectedGroupIdsCallback(selectedGroupIds);
    }, [setSelectedGroupIdsCallback, selectedGroupIds]);

    return (
        <>
            <h2>Skupiny</h2>
            <p>Své skupiny najdete v rozvrhu aplikace Bakaláři.</p>

            {props.timetable.groupGroups.length < 1 && <p>Nejsou k dispozici žádné skupiny.</p>}

            <div className="d-flex flex-column gap-2">
                {props.timetable.groupGroups.sort().map((groupGroup) => (
                    <div key={nanoid()}>
                        {groupGroup
                            .sort((a, b) => a.isBlank ? 1 : b.isBlank ? -1 : a.id.localeCompare(b.id))
                            .map((group) => (
                                <FormCheck
                                    inline={true}
                                    label={`${group.isBlank ? "volno" : group.name}`}
                                    name={groupGroup.map((group => group.id)).toString()}
                                    type={"radio"}
                                    id={"input-group-" + group.id}
                                    onChange={handleChange}
                                    key={nanoid()}
                                    data-group-id={group.id}
                                    checked={selectedGroupIds.includes(group.id)}
                                />
                            ))}
                    </div>
                ))}
            </div>
        </>
    );
}

export default GroupSettings
