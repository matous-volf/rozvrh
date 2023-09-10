import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {nanoid} from "nanoid";
import {useQuery} from "@tanstack/react-query";
import {getClassIds} from "../api/bakalariScraper.ts";
import ClassId from "../models/ClassId.ts";
import {FormSelect} from "react-bootstrap";

interface Props {
    selectedClassId: string | null;
    setSelectedClassIdCallback: (classId: string | null) => void;
}

function ClassIdSettings(props: Props) {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(props.selectedClassId);

    const setSelectedClassIdCallback = props.setSelectedClassIdCallback;
    useEffect(() => {
        setSelectedClassIdCallback(selectedClassId);
    }, [setSelectedClassIdCallback, selectedClassId]);

    const {data, isLoading} = useQuery({
        queryKey: ["classIds"],
        queryFn: () => getClassIds(),
    });

    const classIds: ClassId[] = useMemo(() => data === undefined ? [] : data, [data])

    useEffect(() => {
        if (!isLoading && classIds.length < 1) {
            setSelectedClassId(null);
        }
    }, [classIds, isLoading]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassId(e.target.value);
    };

    return (
        <>
            <h2>Třída</h2>
            <FormSelect onChange={handleChange} value={selectedClassId ?? ""} id="class-select" className="w-auto">
                {selectedClassId === null && <option></option>}
                {classIds.map((classId) => (
                    <option key={nanoid()} value={classId.id}>{classId.name}</option>
                ))}
            </FormSelect>
        </>
    );
}

export default ClassIdSettings
