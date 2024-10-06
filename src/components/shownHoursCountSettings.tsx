import { useLocalStorage } from "usehooks-ts";
import Slider from "./Slider";
import Timetable from "../models/Timetable";

interface Props {
    timetable: Timetable | null;
}

function NumberOfShownHoursSettings(props: Props) {
    const [numberOfShownHours, setNumberOfShownHours] = useLocalStorage<number>(
        "shownHoursCount",
        2
    );

    return (
        <>
            <h3>Počet zobrazených hodin</h3>
            <Slider
                min={0}
                max={
                    props.timetable !== null
                        ? props.timetable.hourTimes.length
                        : 2
                }
                step={1}
                defaultValue={numberOfShownHours}
                onChange={setNumberOfShownHours}
            />
        </>
    );
}

export default NumberOfShownHoursSettings;
