import React, { useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface MultiSelectProps {
    name: string;
    label: string;
    options: string[];
    placeholder?: string;
    maxDisplayLength?: number;
    register: UseFormRegister<Record<string, string>>;
    setValue: UseFormSetValue<Record<string, string>>;
    value: string;
}

const MultiSelectInput: React.FC<MultiSelectProps> = ({
    name,
    label,
    options,
    placeholder = "Select options",
    maxDisplayLength = 40,
    register,
    setValue,
    value,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedValues = value ? value.split(",") : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (option === "Other") {
            if (isOtherSelected) {
                setIsOtherSelected(false);
                setValue(name, "");
                setValue(`${name}_Other`, "");
            } else {
                setIsOtherSelected(true);
                setValue(name, "Other");
                setIsOpen(false);
            }
        } else if (!isOtherSelected) {
            const newValues = selectedValues.includes(option)
                ? selectedValues.filter((item) => item !== option)
                : [...selectedValues, option];
            setValue(name, newValues.join(","));
        }
    };

    const getDisplayText = () => {
        if (isOtherSelected) return "Other (Specify)";
        if (selectedValues.length === 0) return placeholder;
        const text = selectedValues.join(", ");
        return text.length > maxDisplayLength
            ? `${text.substring(0, maxDisplayLength)}...`
            : text;
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <label className="text-sm md:text-md font-semibold text-gray-700 min-w-24" htmlFor={name}>
                {label}
            </label>
            <div className="relative h-11 w-full">
                <div
                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {getDisplayText()}
                </div>
                {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedValues.includes(option) || (option === "Other" && isOtherSelected) ? "bg-gray-100" : ""
                                    }`}
                                onClick={() => toggleOption(option)}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-4 h-4 border rounded flex items-center justify-center ${selectedValues.includes(option) || (option === "Other" && isOtherSelected)
                                                ? "border-gray-700 bg-gray-700"
                                                : "border-gray-400"
                                            }`}
                                    >
                                        {(selectedValues.includes(option) || (option === "Other" && isOtherSelected)) && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    {option}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <input
                type="hidden"
                {...register(name)}
                value={value}
            />
            {isOtherSelected && (
                <div className="relative w-full mt-4">
                    <label
                        htmlFor={`${name}_Other`}
                        className="text-sm md:text-md font-semibold text-gray-700 min-w-24"
                    >
                        {label} (Specify)
                    </label>
                    <div className="relative h-11 w-full">
                        <input
                            type="text"
                            placeholder="Please specify"
                            {...register(`${name}_Other`)}
                            autoComplete="off"
                            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        />
                        <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectInput;