import { forwardRef, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';

export default forwardRef(({ className = '', isFocused = false, icon: Icon, placeholder, error, options = [], ...props }, ref) => {
    const select = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            select.current.focus();
        }
    }, [isFocused]);

    return (
        <div className="w-full">
            <div className="flex items-center">
                {Icon && (
                    <div className="text-gray-500 text-xl">
                        <Icon />
                    </div>
                )}
                <select
                    {...props}
                    className={`w-full ml-2 pl-2 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-primary-color rounded-none ${className}`}
                    ref={select}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>} 
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
});
