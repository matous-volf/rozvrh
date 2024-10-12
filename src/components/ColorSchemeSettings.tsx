import {FormCheck} from "react-bootstrap";
import TernaryDarkMode from "../models/TernaryDarkMode.ts";

interface Props {
    ternaryDarkMode: TernaryDarkMode;
    setTernaryDarkModeCallback: (ternaryDarkMode: TernaryDarkMode) => void;
}

function ColorSchemeSettings(props: Props) {
    return <>
        <h3>Barevné schéma</h3>
        <FormCheck
            label="světlé"
            type="radio"
            id="input-color-scheme-light"
            onChange={(e) => {
                if (e.target.checked) {
                    props.setTernaryDarkModeCallback("light");
                }
            }}
            checked={props.ternaryDarkMode === "light"}
        />

        <FormCheck
            label="tmavé"
            type="radio"
            id="input-color-scheme-dark"
            onChange={(e) => {
                if (e.target.checked) {
                    props.setTernaryDarkModeCallback("dark");
                }
            }}
            checked={props.ternaryDarkMode === "dark"}
        />

        <FormCheck
            label="podle zařízení"
            type="radio"
            id="input-color-scheme-auto"
            onChange={(e) => {
                if (e.target.checked) {
                    props.setTernaryDarkModeCallback("system");
                }
            }}
            checked={props.ternaryDarkMode === "system"}
        />
    </>
}

export default ColorSchemeSettings;
