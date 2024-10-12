import {FormCheck} from "react-bootstrap";
import {useLocalStorage} from "usehooks-ts";

function ProgressBarSettings() {
    const [progressBarEnabled, setProgressBarEnabled] = useLocalStorage<boolean>("progressBarEnabled", true);

    return <>
        <h3>Ukazatel průběhu</h3>

        <FormCheck label="zobrazit" type="radio" id="input-progress-bar-enabled"
                   onChange={(e) => setProgressBarEnabled(e.target.checked)} checked={progressBarEnabled}/>

        <FormCheck label="skrýt" type="radio" id="input-progress-bar-disabled"
                   onChange={(e) => setProgressBarEnabled(!e.target.checked)} checked={!progressBarEnabled}/>
    </>
}

export default ProgressBarSettings;
