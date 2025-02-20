import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedCallback } from 'use-debounce';

interface InputFieldProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    name: Path<T>;
    type?: string;
    placeholder: string;
    errors: FieldErrors<T>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = <T extends FieldValues>({
    register,
    name,
    type = "text",
    placeholder,
    errors,
    onChange,
}: InputFieldProps<T>) => {

    const registeredProps = register(name);

    const debouncedOnChange = useDebouncedCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            registeredProps.onChange(e);
            if (onChange) {
                onChange(e);
            }
        },
        300
    );

    return (
        <div className="w-full">
            <input
                {...registeredProps}
                className="rounded py-1 px-2 w-full bg-slate-900"
                type={type}
                placeholder={placeholder}
                onChange={debouncedOnChange}
            />
            <AnimatePresence>
                {errors[name] && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-red-400 text-sm py-1"
                    >
                        {errors[name]?.message as string}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InputField;
