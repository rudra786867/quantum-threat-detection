import React from 'react';

// Default icon properties: 16px by 16px, flex-shrink 0, display block
const defaultProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: { flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }
};

export const Shield = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const ShieldCheck = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const ShieldAlert = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const Play = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const Activity = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const History = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export const BookOpen = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const BarChart3 = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

export const Info = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export const AlertTriangle = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export const RefreshCw = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export const CheckCircle = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const XCircle = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export const Atom = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <circle cx="12" cy="12" r="2" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
    <path d="M15.7 8.3c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
  </svg>
);

export const ArrowRight = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowLeftRight = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
);

export const Lock = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const Sun = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const Moon = ({ className = "app-icon", size = 16, style, ...props }) => (
  <svg {...defaultProps} width={size} height={size} className={className} style={{ ...defaultProps.style, ...style }} {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
