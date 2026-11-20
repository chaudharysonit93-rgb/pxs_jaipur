import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './SectionHeading.css';

export function SectionHeading({
  index = null,
  title,
  subtitle = null,
  linkText = null,
  linkHref = null,
  className = ''
}) {
  return (
    <div className={`pxs-heading ${className}`}>
      <div className="pxs-heading__main">
        {index && <span className="pxs-heading__index">{index}</span>}
        <h2 className="pxs-heading__title">{title}</h2>
        {subtitle && <p className="pxs-heading__subtitle">{subtitle}</p>}
      </div>

      {linkText && linkHref && (
        <Link to={linkHref} className="pxs-heading__link">
          <span>{linkText}</span>
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
