"use client";

import { useEffect } from "react";

export default function MoreButton({ messageRef }: { messageRef: any }) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      console.log("qwe");
    }
  });
  useEffect(() => {
    if (messageRef.current) {
      observer.observe(messageRef.current);
      console.log(messageRef.current);
    }
  });

  return <div className="text-white m-auto py-2 absolute">More</div>;
}
