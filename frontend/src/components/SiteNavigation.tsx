"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    {
        href: "/",
        label: "Service Tickets",
    },
    {
        href: "/customers",
        label: "Customers",
    },
];

export default function SiteNavigation() {
    const pathname = usePathname();

    return (
        <nav className="site-navigation"
            aria-label="Main navigation">
            <span className="site-navigation__links">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                isActive ? "site-navigation__link site-navigation__link--active"
                                    : "site-navigation__link"
                            }
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </span>
        </ nav>
    )
}