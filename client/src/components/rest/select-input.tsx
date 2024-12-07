import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface SelectInptPropTypes {
    name: string;
    label: string;
    options: string[];
    register: UseFormRegister<Record<string, string>>;
    setValue: UseFormSetValue<Record<string, string>>;
    selectedValue: string;
    text: string;
}

const SelectInput = ({ name, label, options, register, selectedValue, text, setValue}: SelectInptPropTypes) => {
    return (
        <div>
            <div className="relative w-full flex items-center">
                <label className="text-sm md:text-md font-semibold text-gray-700 min-w-24" htmlFor={name}>
                    {label}
                </label>
                <div className="relative h-11 w-full">
                    <select
                        id={name}
                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        {...register(name, {
                            onChange: (e) => {
                                if (e.target.value !== "Other") {
                                    setValue(`${name}_Other`, "");
                                }
                            },
                        })}
                    >
                        <option value="" className="text-slate-400">{text}</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                </div>
            </div>
            {selectedValue === "Other" && (
                <div className="relative w-full flex items-center">
                    <label
                        htmlFor={`${name}_Other`}
                        className="text-sm md:text-md font-semibold text-gray-700 min-w-24"
                    >
                        {label} (Specify)
                    </label>
                    <div className="relative h-11 w-full">
                        <input
                            type="text"
                            placeholder={text}
                            {...register(`${name}_Other`)}
                            autoComplete="off"
                            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        />
                        <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SelectInput;