"use client";

import { useEffect } from "react";

export default function MoreButton({
  messageRef,
  fetchMore,
  messages,
}: {
  messageRef: any;
  fetchMore: any;
  messages: any;
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchMore(20, 20);
      }
    });
    if (messageRef.current) {
      observer.observe(messageRef.current);
      console.log(messageRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [messages, messageRef]);

  return <div className="text-white m-auto py-2 absolute">More</div>;
}
