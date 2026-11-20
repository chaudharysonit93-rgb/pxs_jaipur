import React from 'react';
import './AnnouncementBar.css';

export function AnnouncementBar() {
  return (
    <aside className="pxs-announcement" aria-label="Announcement">
      <div className="pxs-announcement__content">
        <span className="pxs-announcement__dot" aria-hidden="true" />
        <span>FREE DELIVERY IN JAIPUR ON ORDERS ABOVE ₹999 · CASH ON DELIVERY AVAILABLE</span>
        <span className="pxs-announcement__dot" aria-hidden="true" />
      </div>
    </aside>
  );
}
