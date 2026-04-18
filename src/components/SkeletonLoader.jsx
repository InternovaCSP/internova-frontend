import React from 'react';

/**
 * SkeletonLoader Component
 * Simple pulsed loading state placeholder.
 */
const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite linear',
      }}
    />
  );
};

// Add keyframes to document if not present
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .skeleton-pulse {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }
}

export default SkeletonLoader;
