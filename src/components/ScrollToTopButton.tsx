"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <Button
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 rounded-full bg-blue-500 p-3 text-white shadow-lg"
        variant="outline"
      >
        Top
      </Button>
    )
  );
};

export default ScrollToTopButton;
