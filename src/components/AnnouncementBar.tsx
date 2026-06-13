/** @jsxRuntime classic */
import React, { useEffect, useState } from 'react';

export default function AnnouncementBar() {
  const announcements = [
    "30-DAY RETURNS | FREE ACCRA DELIVERY OVER GHC 200 | SECURE MOBILE MONEY CHECKOUT",
    "TRUST IN THE LORD WITH ALL THINE HEART | WEAR WHO YOU ARE IN CHRIST",
    "PUT ON THE WHOLE ARMOR OF GOD | PREMIUM FAITH STREETWEAR"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div id="announcement-bar" className="w-full bg-beige text-[#555] py-2 border-b border-gray-100 text-[10px] md:text-xs tracking-widest font-sans uppercase text-center transition-all duration-500 font-medium">
      <div className="container mx-auto px-4 overflow-hidden h-4 relative flex items-center justify-center">
        <span className="inline-block transition-all duration-700 ease-in-out">
          {announcements[index]}
        </span>
      </div>
    </div>
  );
}
