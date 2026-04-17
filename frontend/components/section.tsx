import React from "react";

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="space-y-6 pb-12 border-b border-gray-200 last:border-none">
    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
      {title}
    </h2>

    <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
      {children}
    </div>
  </section>
);

export interface SubSectionProps {
  subtitle: string;
  children: React.ReactNode;
}

export const SubSection: React.FC<SubSectionProps> = ({
  subtitle,
  children,
}) => (
  <div className="space-y-3">
    <h3 className="text-lg md:text-xl font-semibold text-gray-900">
      {subtitle}
    </h3>

    <div className="space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
      {children}
    </div>
  </div>
);
