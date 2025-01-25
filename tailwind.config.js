import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.vue',
    ],

    theme: {
        extend: {
            colors: {
                'primary-color': '#002231',
                'secondary-color': '#0099d0',
            },
        },
    },
    plugins: [],
};
