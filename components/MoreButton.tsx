"use client";

import { useEffect } from "react";

export default function MoreButton({
  messageRef,
  fetchMore,
}: {
  messageRef: any;
  fetchMore: any;
}) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      //   fetchMore(20, 20);
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
