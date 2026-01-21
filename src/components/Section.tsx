import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "hero" | "hero-green";
}

const Section = ({ children, className, id, background = "default" }: SectionProps) => {
  const bgClasses = {
    default: "",
    muted: "bg-muted",
    hero: "gradient-hero",
    "hero-green": "gradient-hero-green",
  };

  return (
    <section id={id} className={cn("py-16 md:py-24", bgClasses[background], className)}>
      <div className="container">{children}</div>
    </section>
  );
};

export default Section;
