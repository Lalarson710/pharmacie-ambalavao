import { type ReactNode } from 'react';

interface SectionCardProps {
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, className }: SectionCardProps) {
  return (
    <div className={`section-card ${className ?? ''}`}>
      <div className="section-card-header">
        <h2 className="section-card-title">{title}</h2>
        {subtitle && <p className="section-card-subtitle">{subtitle}</p>}
      </div>
      <div className="section-card-body">{children}</div>
    </div>
  );
}
