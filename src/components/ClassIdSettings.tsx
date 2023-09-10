import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {nanoid} from "nanoid";
import {useQuery} from "@tanstack/react-query";
import {getClassIds} from "../api/bakalariScraper.ts";
import ClassId from "../models/ClassId.ts";

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

    const {data, isLoading, isError} = useQuery({
        queryKey: ["classIds"],
        queryFn: () => getClassIds(),
    });

    const classIds: ClassId[] = useMemo(() => data === undefined ? [] : data, [data])

    useEffect(() => {
        if (classIds.length < 1) {
            setSelectedClassId(null);
        }
    }, [classIds]);

    if (isLoading) {
        return (
            <>
                <p>Načítání...</p>
            </>
        )
    }

    if (isError) {
        return (
            <>
                <p>Načítání tříd se nezdařilo.</p>
                <p>Zkontrolujte připojení k internetu.</p>
            </>
        )
    }

    if (classIds.length < 1) {
        return (
            <>
                <p>Nejsou dostupné žádné třídy.</p>
            </>
        )
    }

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassId(e.target.value);
    };

    return (
        <>
            <select onChange={handleChange} value={selectedClassId ?? ""}>
                {selectedClassId === null && <option></option>}
                {classIds.map((classId) => (
                    <option key={nanoid()} value={classId.id}>{classId.name}</option>
                ))}
            </select>
        </>
    );
}

export default ClassIdSettings
