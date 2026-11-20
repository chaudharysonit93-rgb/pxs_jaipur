import React from 'react';
import './Button.css';

export function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`pxs-btn pxs-btn--${variant} pxs-btn--${size} ${fullWidth ? 'pxs-btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="pxs-btn__spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && <span className="pxs-btn__icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
