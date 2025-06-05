'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from './Button';

export default function NavBar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/overall-leaderboard', label: 'OVERALL LEADERBOARD' },
        { href: '/individual-leaderboard', label: 'INDIVIDUAL LEADERBOARD' },
        { href: '/team-leaderboard', label: 'TEAM LEADERBOARD' },
        { href: '/top-ten', label: 'TOP 10' },
        { href: '/top-twenty', label: 'TOP 20' },
    ];

    return (
        <nav className="bg-white shadow p-4 flex space-x-4 px-5">
            <Image
                src="/CADTIDTLogo.png"
                width={200}
                height={64}
                alt="IDT Logo"
            />

            <div className="flex space-x-4 ml-auto items-center font-bold">
                {navLinks.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`transition-colors duration-300 
                                ${
                                    isActive
                                        ? 'text-orange-400'
                                        : 'text-gray-600 hover:text-orange-400'
                                }`
                            }
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
