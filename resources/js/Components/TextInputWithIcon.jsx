import { forwardRef, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';

export default forwardRef(({ type = 'text', className = '', isFocused = false, icon: Icon, placeholder, error, ...props }, ref) => {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
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
                <input
                    {...props}
                    type={type}
                    placeholder={placeholder}
                    className={`w-full ml-2 pl-2 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-primary-color rounded-none ${className}`}
                    ref={input}
                />
            </div>
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
});
