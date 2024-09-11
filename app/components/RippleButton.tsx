"use client"

import React, { useState, useLayoutEffect } from 'react';

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const RippleButton: React.FC<RippleButtonProps> = ({ children, onClick, className = '' }) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; size: number } | null>(null);

  useLayoutEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(null), 500);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      size,
    });
    if (onClick) onClick();
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripple && (
        <span
          className="absolute bg-white opacity-30 rounded-full animate-ripple"
          style={{
            top: ripple.y - ripple.size / 2,
            left: ripple.x - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      )}
    </button>
  );
};

export default RippleButton;