import { useState } from "react";
import { Show, Hide } from "@/components/Icons";
import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import TooltipIcon from "../TooltipIcon";
import { AnimatePresence, motion } from "framer-motion";

interface PasswordInputProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    name: Path<T>;
    placeholder: string;
    errors: FieldErrors<T>;
}

const PasswordInput = <T extends FieldValues>({ register, name, placeholder, errors }: PasswordInputProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-1/2">
            <div className="relative w-full">
                <input
                    type={showPassword ? "text" : "password"}
                    {...register(name)}
                    className="rounded py-1 px-2 bg-slate-900 w-full pr-10"
                    placeholder={placeholder}
                />
                <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    <TooltipIcon icon={showPassword ? <Hide /> : <Show />} tooltipText={showPassword ? "Hide" : "Show"} />
                </span>
            </div>
            <AnimatePresence>
                {errors[name]?.message && (
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

export default PasswordInput;
