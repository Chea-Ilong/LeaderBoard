'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ButtonProps {
    to?: string;
    label?: string;
    bgColor?: string;
    textColor?: string;
}

const Button = ({
    to = 'signup',
    label = 'See more',
    bgColor = 'bg-orange-400',
    textColor = 'text-white',
}: ButtonProps) => {
    return (
        <Link
            href={`/${to}`}
            className={`group relative flex items-center ${bgColor} ${textColor} transition-all duration-300 px-4 py-2 clip-angle overflow-hidden`}
        >
            <span className="transition-all duration-300 group-hover:pr-6">
                {label}
            </span>
            <span className="absolute right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">
                <ChevronRight size={18} />
            </span>
        </Link>
    );
};

export default Button;
