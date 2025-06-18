'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from './Button';

export default function NavBar() {
    const pathname = usePathname();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const leaderboardLinks = [
        { href: '/overall-leaderboard', label: 'OVERALL LEADERBOARD' },
        { href: '/individual-leaderboard', label: 'INDIVIDUAL LEADERBOARD' },
        { href: '/team-leaderboard', label: 'TEAM LEADERBOARD' },
    ];

    const otherLinks = [
        { href: '/top-ten', label: 'TOP 10' },
        { href: '/top-twenty', label: 'TOP 20' },
    ];

    return (
        <nav className="bg-white shadow p-4 flex px-5 items-center">
            <Image
                src="/CADTIDTLogo.png"
                width={200}
                height={100}
                alt="IDT Logo"
            />

            <div className="sm:flex space-x-4 ml-auto items-center font-bold relative hidden">
                {/* LEADERBOARD DROPDOWN */}
                <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <div className="flex justify-between items-center cursor-pointer text-blue-950 hover:text-orange-400 transition-colors duration-300">
                        <span>LEADERBOARD</span>
                        <ChevronDown size={18} />
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute top-full bg-white border-t-4 border-blue-950 shadow-lg w-65 z-10 p-5">
                            {leaderboardLinks.map(({ href, label }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`block px-4 py-2 text-xs transition-colors duration-200 ${
                                            isActive
                                                ? 'text-orange-400'
                                                : 'text-blue-950 hover:bg-gray-100 hover:text-orange-400'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Other links */}
                {otherLinks.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`transition-colors duration-300 ${
                                isActive
                                    ? 'text-orange-400'
                                    : 'text-blue-950 hover:text-orange-400'
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}

                <Button
                    to="top-twenty"
                    label="Sign Up"
                    bgColor="bg-orange-400"
                    textColor="text-white"
                />
            </div>
        </nav>
    );
}
