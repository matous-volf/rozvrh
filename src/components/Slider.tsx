import { ChangeEvent, useState } from "react";
import { Form } from "react-bootstrap";

const Slider = ({
    min,
    max,
    step,
    defaultValue,
    onChange,
}: {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    onChange?: (value: number) => void;
}) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="d-flex gap-2">
            <Form.Range
                className="flex-shrink-0"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
            />
            {value}
        </div>
    );
};

export default Slider;
