"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, shown] as const;
}

type RevealProps = {
  tag?: "div" | "h2" | "p" | "a" | "section";
  delay?: number;
  className?: string;
  id?: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
};

export default function Reveal({
  tag = "div",
  delay = 0,
  className = "",
  id,
  href,
  onClick,
  children,
}: RevealProps) {
  const [ref, shown] = useReveal<HTMLElement>();
  const Tag = tag as ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      href={href}
      onClick={onClick}
      className={`rv ${shown ? "in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}