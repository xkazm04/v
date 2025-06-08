'use client';

import { useEffect, useState } from "react";
import FeaturedNews from "../sections/home/FeaturedNews";

export default function Page() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="p-2 pb-[150px] min-h-screen">
                <FeaturedNews />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Responsive Background Pattern */}
            <div 
                className="fixed inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/background/news_bg_1.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />
            <div className="relative z-10 p-2 pb-[150px]">
                <FeaturedNews />
            </div>
        </div>
    );
}