export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    const hasBgColor = /bg-[a-zA-Z0-9-]+/.test(className);

    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-4 py-3 
                ${hasBgColor ? '' : 'bg-primary-color hover:bg-secondary-color focus:bg-secondary-color active:bg-secondary-color'} 
                text-white border border-transparent rounded-md font-semibold text-xs tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled ? 'opacity-25' : ''
                } ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
