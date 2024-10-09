import {ChangeEvent, useState} from "react";
import {Form} from "react-bootstrap";

interface Props {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    onChange?: (value: number) => void;
}

function Slider({min, max, step, defaultValue, onChange}: Props) {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return <div className="d-flex gap-2">
        <Form.Range min={min} max={max} step={step} value={value} onChange={handleChange}/>
        <span className="text-end" style={{minWidth: `${1 + Math.floor(Math.log10(max)) / 1.75}rem`}}>{value}</span>
    </div>
}

export default Slider;
