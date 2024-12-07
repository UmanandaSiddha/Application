import { UseFormRegister } from "react-hook-form";

interface TextInputPropTypes {
    name: string;
    text: string;
    label: string;
    type: string;
    register: UseFormRegister<Record<string, string>>;
}

const TextInput = ({ name, text, label, type, register }: TextInputPropTypes) => {
    return (
        <div className="relative w-full flex items-center">
            <label
                htmlFor={name}
                className="text-sm md:text-md font-semibold text-gray-700 min-w-24"
            >
                {label}
            </label>
            {type === "textarea" ? (
                <div className="relative h-16 w-full">
                    <textarea
                        {...register(name)}
                        placeholder={text}
                        id={name}
                        autoComplete="off"
                        className="peer h-full min-h-[100px] w-full resize-none border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                    ></textarea>
                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                </div>
            ) : (
                <div className="relative h-11 w-full">
                    <input
                        type={type}
                        id={name}
                        placeholder={text}
                        {...register(name)}
                        autoComplete="off"
                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    />
                    <span className="after:content[' '] pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-transparent transition-transform duration-300 scale-x-0 border-gray-500 peer-focus:scale-x-100 peer-focus:bg-gray-900 peer-placeholder-shown:border-blue-gray-200"></span>
                </div>
            )}
        </div>
    )
}

export default TextInput