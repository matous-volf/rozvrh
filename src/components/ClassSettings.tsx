import {useEffect, useMemo, useState} from "react";
import {nanoid} from "nanoid";
import {useQuery} from "@tanstack/react-query";
import {getClassIds} from "../api/timetable.ts";
import ClassId from "../models/ClassId.ts";
import {FormSelect} from "react-bootstrap";
import School from "../models/School.ts";

interface Props {
    selectedSchool: School;
    selectedClassId: string | null;
    setSelectedClassIdCallback: (classId: string | null) => void;
}

function ClassSettings(props: Props) {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(props.selectedClassId);

    const setSelectedClassIdCallback = props.setSelectedClassIdCallback;
    useEffect(() => {
        setSelectedClassIdCallback(selectedClassId);
    }, [setSelectedClassIdCallback, selectedClassId]);

    const {data, isLoading, isError} = useQuery({
        queryKey: ["classIds", props.selectedSchool],
        queryFn: () => getClassIds(props.selectedSchool),
    });

    const classIds: ClassId[] = useMemo(() => data === undefined ? [] : data, [data])

    useEffect(() => {
        if (!isLoading && (classIds === null || classIds.length < 1)) {
            setSelectedClassId(null);
        }
    }, [classIds, isLoading]);

    return (
        <>
            <h2>Třída</h2>
            {(isLoading ? (<p>Načítání...</p>
            ) : isError ? (<p>Třídy se nepodařilo načíst. Škola pravděpodobně nepovolila veřejný rozvrh.</p>
            ) : <FormSelect onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId ?? ""}
                            id="input-class" className="w-auto">
                {selectedClassId === null && <option></option>}
                {classIds.map((classId) => (
                    <option key={nanoid()} value={classId.id}>{classId.name}</option>
                ))}
            </FormSelect>)
            }
        </>
    );
}

export default ClassSettings;
