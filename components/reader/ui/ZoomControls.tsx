'use client';

import React from 'react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, onZoomIn, onZoomOut }) => {
  const label = zoom === 100 ? 'Reading Size' : `${zoom}%`;

  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onZoomOut} aria-label="Zoom out">−</button>
      <span style={{ minWidth: '80px', textAlign: 'center' }}>{label}</span>
      <button className="zoom-btn" onClick={onZoomIn} aria-label="Zoom in">+</button>
    </div>
  );
};
