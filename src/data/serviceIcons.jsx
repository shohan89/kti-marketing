export const SERVICE_ICONS = {
  'social-media-management': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle className="svc-icon__node svc-icon__node--1" cx="18" cy="5" r="3"/>
      <circle className="svc-icon__node svc-icon__node--2" cx="6" cy="12" r="3"/>
      <circle className="svc-icon__node svc-icon__node--3" cx="18" cy="19" r="3"/>
      <line className="svc-icon__share-line svc-icon__share-line--1" x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line className="svc-icon__share-line svc-icon__share-line--2" x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  'content-creation': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path className="svc-icon__doc" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path className="svc-icon__pencil" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  'ads-campaign-management': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle className="svc-icon__ring svc-icon__ring--3" cx="12" cy="12" r="10"/>
      <circle className="svc-icon__ring svc-icon__ring--2" cx="12" cy="12" r="6"/>
      <circle className="svc-icon__ring svc-icon__ring--1" cx="12" cy="12" r="2"/>
    </svg>
  ),
  'copywriting': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line className="svc-icon__text-line svc-icon__text-line--1" x1="16" y1="13" x2="8" y2="13"/>
      <line className="svc-icon__text-line svc-icon__text-line--2" x1="16" y1="17" x2="8" y2="17"/>
      <polyline className="svc-icon__text-line svc-icon__text-line--3" points="10 9 9 9 8 9"/>
    </svg>
  ),
  'product-photography': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="svc-icon__camera">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle className="svc-icon__lens" cx="12" cy="13" r="4"/>
    </svg>
  ),
  'model-photography': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="svc-icon__person">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  'video-production': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon className="svc-icon__play" points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  'influencer-marketing': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path className="svc-icon__person-left" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle className="svc-icon__person-left" cx="9" cy="7" r="4"/>
      <path className="svc-icon__person-right" d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path className="svc-icon__person-right" d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  'website-maintenance': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle className="svc-icon__gear-center" cx="12" cy="12" r="3"/>
      <path className="svc-icon__gear-outer" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
}
