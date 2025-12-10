'use client';

import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  onClick,
  type = 'button',
  ...props 
}) {
  const baseStyles = 'premium-button font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'premium-button-primary',
    secondary: 'premium-button-secondary',
    ghost: 'premium-button-ghost',
    outline: 'premium-button-ghost',
  };
  
  const sizes = {
    sm: 'px-6 py-2 text-sm rounded-lg',
    md: 'px-8 py-3 text-base rounded-xl',
    lg: 'px-10 py-4 text-lg rounded-xl',
  };
  
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    className = '',
    endAdornment = null,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const {
    id,
    ['aria-describedby']: describedByProp,
    ['aria-label']: ariaLabelProp,
    ...restProps
  } = props;

  const inputId = id || `${generatedId}-input`;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = error
    ? describedByProp
      ? `${describedByProp} ${errorId}`
      : errorId
    : describedByProp;
  const ariaLabel = ariaLabelProp || label || placeholder || 'input field';
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-brand-muted mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
            'bg-brand-surface text-brand-primary placeholder:text-brand-muted/50',
            error ? 'border-error' : 'border-brand-border',
            endAdornment ? 'pr-12' : '',
            className
          )}
          {...(value !== undefined ? { value } : {})}
          {...(onChange ? { onChange } : {})}
          {...restProps}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
});

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      className={clsx(
        'premium-card',
        hover && 'premium-card-hover',
        className
      )}
      whileHover={hover ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-brand-primary/10 text-brand-primary',
    secondary: 'bg-brand-secondary/10 text-brand-secondary',
    gold: 'bg-brand-gold/20 text-brand-gold',
    muted: 'bg-brand-border text-brand-muted',
  };
  
  return (
    <span className={clsx(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

export function SectionHeader({ children, className = '' }) {
  return (
    <div className={clsx('mb-12', className)}>
      <h2 className="section-header gold-accent inline-block pb-2">
        {children}
      </h2>
    </div>
  );
}

