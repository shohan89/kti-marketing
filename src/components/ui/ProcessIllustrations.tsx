export function IllusDiscovery() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="process-illus" aria-hidden="true">
      <circle cx="90" cy="72" r="42" stroke="#D7262E" strokeWidth="4.5" className="illus-draw" />
      <line x1="122" y1="104" x2="152" y2="135" stroke="#D7262E" strokeWidth="5" strokeLinecap="round" className="illus-fade" />
      <line x1="72" y1="62" x2="108" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="illus-fade-d1" />
      <line x1="72" y1="74" x2="100" y2="74" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="illus-fade-d2" />
      <line x1="72" y1="86" x2="104" y2="86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="illus-fade-d3" />
    </svg>
  )
}

export function IllusStrategy() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="process-illus" aria-hidden="true">
      <circle cx="100" cy="80" r="20" fill="rgba(215,38,46,0.12)" stroke="#D7262E" strokeWidth="3" className="illus-scale" />
      <line x1="100" y1="60" x2="100" y2="28" stroke="#D7262E" strokeWidth="2" className="illus-draw" />
      <line x1="117" y1="92" x2="148" y2="120" stroke="#D7262E" strokeWidth="2" className="illus-draw" />
      <line x1="83" y1="92" x2="52" y2="120" stroke="#D7262E" strokeWidth="2" className="illus-draw" />
      <circle cx="100" cy="20" r="10" fill="rgba(215,38,46,0.12)" stroke="#D7262E" strokeWidth="2" className="illus-fade-d1" />
      <circle cx="156" cy="126" r="10" fill="rgba(215,38,46,0.12)" stroke="#D7262E" strokeWidth="2" className="illus-fade-d2" />
      <circle cx="44" cy="126" r="10" fill="rgba(215,38,46,0.12)" stroke="#D7262E" strokeWidth="2" className="illus-fade-d3" />
    </svg>
  )
}

export function IllusProduction() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="process-illus" aria-hidden="true">
      <rect x="48" y="20" width="84" height="108" rx="6" stroke="currentColor" strokeWidth="3" className="illus-fade" />
      <line x1="64" y1="55" x2="116" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="illus-fade-d1" />
      <line x1="64" y1="70" x2="104" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="illus-fade-d2" />
      <line x1="64" y1="85" x2="110" y2="85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="illus-fade-d3" />
      <path d="M133 108 L155 58 L164 67 L142 117 Z" fill="#D7262E" opacity="0.9" className="illus-scale" />
      <circle cx="157" cy="55" r="7" fill="#D7262E" className="illus-scale" />
    </svg>
  )
}

export function IllusReview() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="process-illus" aria-hidden="true">
      <rect x="36" y="14" width="96" height="122" rx="6" stroke="currentColor" strokeWidth="3" className="illus-fade" />
      <path d="M54 56 L66 68 L90 44" stroke="#D7262E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="illus-draw" />
      <line x1="102" y1="56" x2="122" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="illus-fade-d1" />
      <path d="M54 88 L66 100 L90 76" stroke="#D7262E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="illus-draw-d2" />
      <line x1="102" y1="88" x2="122" y2="88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="illus-fade-d2" />
      <path d="M54 120 L66 132 L90 108" stroke="#D7262E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="illus-draw-d3" />
      <line x1="102" y1="120" x2="122" y2="120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="illus-fade-d3" />
    </svg>
  )
}

export function IllusDelivery() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="process-illus" aria-hidden="true">
      <circle cx="100" cy="82" r="52" stroke="#D7262E" strokeWidth="4" className="illus-draw" />
      <path d="M100 110 L100 54" stroke="#D7262E" strokeWidth="4" strokeLinecap="round" className="illus-draw" />
      <path d="M80 74 L100 54 L120 74" stroke="#D7262E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="illus-draw" />
      <circle cx="55" cy="36" r="5" fill="#D7262E" opacity="0.5" className="illus-fade-d1" />
      <circle cx="150" cy="28" r="4" fill="#D7262E" opacity="0.4" className="illus-fade-d2" />
      <circle cx="158" cy="56" r="3" fill="#D7262E" opacity="0.35" className="illus-fade-d3" />
    </svg>
  )
}

export const PROCESS_ILLUSTRATIONS = [IllusDiscovery, IllusStrategy, IllusProduction, IllusReview, IllusDelivery]
