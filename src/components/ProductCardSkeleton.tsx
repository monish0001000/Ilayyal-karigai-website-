import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card-skeleton-container" aria-hidden="true">
      {/* 4:5 Portrait Image Box */}
      <div className="skeleton-image-box">
        <div className="skeleton-shimmer-sweep" />
      </div>
      {/* Meta Text Skeletons */}
      <div className="skeleton-meta-box">
        <div className="skeleton-line tag" />
        <div className="skeleton-line title" />
        <div className="skeleton-line subtitle" />
        <div className="skeleton-row footer">
          <div className="skeleton-line price" />
          <div className="skeleton-line button" />
        </div>
      </div>
    </div>
  );
};
