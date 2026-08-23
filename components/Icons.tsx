import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props: IconProps) => (
  <IconBase {...props}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></IconBase>
);
export const RocketIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M14.4 4.1c2.1-1.5 4.1-1.5 5.5-1.5 0 1.4 0 3.4-1.5 5.5l-5.2 7.2-4.5-4.5 5.7-6.7Z" fill="currentColor"/><path d="m8.8 10.7-4.1.8-2.1 2.1 5.3.5.9-3.4Zm4.5 4.5-.8 4.1-2.1 2.1-.5-5.3 3.4-.9Z" fill="currentColor"/><circle cx="15.7" cy="6.8" r="1.7" fill="#050817"/></IconBase>
);
export const GamepadIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M7.4 7h9.2c2 0 3.5 1.3 4 3.2l.8 3.2c.7 2.8-2.7 4.6-4.5 2.4L15.5 14h-7l-1.4 1.8c-1.8 2.2-5.2.4-4.5-2.4l.8-3.2C3.9 8.3 5.4 7 7.4 7Z" fill="currentColor"/><path d="M8 9.5v3M6.5 11h3" stroke="#050817" strokeWidth="1.6" strokeLinecap="round"/><circle cx="16.3" cy="10.2" r=".9" fill="#050817"/><circle cx="18.1" cy="12" r=".9" fill="#050817"/></IconBase>
);
export const CubeIcon = (props: IconProps) => (
  <IconBase {...props}><path d="m12 2.8 8 4.5v9.4l-8 4.5-8-4.5V7.3l8-4.5Z" fill="currentColor"/><path d="m4.5 7.5 7.5 4.2 7.5-4.2M12 11.8v8.6" stroke="#050817" strokeWidth="1.4"/></IconBase>
);
export const DownloadIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M12 3v11m0 0 4-4m-4 4-4-4M4 16v3h16v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const BookIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" fill="currentColor"/></IconBase>
);
export const UsersIcon = (props: IconProps) => (
  <IconBase {...props}><circle cx="9" cy="8" r="3" fill="currentColor"/><circle cx="17" cy="9" r="2.5" fill="currentColor" opacity=".7"/><path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6H3Zm11.5 0c0-2-.7-3.8-1.9-5.2a5.4 5.4 0 0 1 8.4 4.5v.7h-6.5Z" fill="currentColor"/></IconBase>
);
export const GlobeIcon = (props: IconProps) => (
  <IconBase {...props}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M3.5 12h17M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21c-2.3-2.5-3.5-5.5-3.5-9S9.7 5.5 12 3Z" stroke="currentColor" strokeWidth="1.6"/></IconBase>
);
export const HeartIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M12 21S3 15.8 3 9.5A4.5 4.5 0 0 1 11.1 6.8L12 8l.9-1.2A4.5 4.5 0 0 1 21 9.5C21 15.8 12 21 12 21Z" fill="currentColor"/></IconBase>
);
export const StarIcon = (props: IconProps) => (
  <IconBase {...props}><path d="m12 2.5 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.1l6.2-.9L12 2.5Z" fill="currentColor"/></IconBase>
);
export const TicketIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v10a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2V7Z" stroke="currentColor" strokeWidth="2"/><path d="M9 8v8" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/></IconBase>
);
export const CheckIcon = (props: IconProps) => (
  <IconBase {...props}><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const ArrowIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const MenuIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></IconBase>
);
export const CloseIcon = (props: IconProps) => (
  <IconBase {...props}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></IconBase>
);
export const BriefcaseIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M4 7h16v12H4V7Z" fill="currentColor"/><path d="M9 7V4h6v3M4 12h16" stroke="#050817" strokeWidth="1.5"/></IconBase>
);
export const ClockIcon = (props: IconProps) => (
  <IconBase {...props}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></IconBase>
);
export const ShieldIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M12 2.5 20 6v5.5c0 5.1-3.2 8.4-8 10-4.8-1.6-8-4.9-8-10V6l8-3.5Z" fill="currentColor"/><path d="m8.5 12 2.2 2.2 4.8-5" stroke="#050817" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const ChevronIcon = (props: IconProps) => (
  <IconBase {...props}><path d="m8 10 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);

// Product-wide interface icons. Keep these SVG-based so public surfaces never fall back to Unicode glyphs.
export const ScreenTimeIcon = (props: IconProps) => (
  <IconBase {...props}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.9"/><path d="M12 7.5V12l3.3 2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><path d="M8 3.5h8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></IconBase>
);
export const WalletIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M4 6.5h14.5A1.5 1.5 0 0 1 20 8v9.5A1.5 1.5 0 0 1 18.5 19h-14A1.5 1.5 0 0 1 3 17.5v-10A1.5 1.5 0 0 1 4.5 6H16" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/><path d="M15.5 11h5v4h-5a2 2 0 1 1 0-4Z" fill="currentColor"/></IconBase>
);
export const ChatIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/><path d="M7.5 9.5h9M7.5 13h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></IconBase>
);
export const PrivacyIcon = (props: IconProps) => (
  <IconBase {...props}><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.9"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="15" r="1.4" fill="currentColor"/></IconBase>
);
export const ApprovalIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M7 3h10a2 2 0 0 1 2 2v15H5V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.9"/><path d="m8 12 2.4 2.4L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const ActivityIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M3 12h4l2.2-5 4 10 2.3-5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const SettingsIcon = (props: IconProps) => (
  <IconBase {...props}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6m9.6 9.6 1.6 1.6M18.4 5.6l-1.6 1.6m-9.6 9.6-1.6 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></IconBase>
);
export const OverviewIcon = (props: IconProps) => (
  <IconBase {...props}><rect x="3" y="3" width="7" height="7" rx="1.2" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1.2" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="1.2" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1.2" fill="currentColor"/></IconBase>
);
export const DetectionIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M2.8 12s3.4-5.7 9.2-5.7S21.2 12 21.2 12 17.8 17.7 12 17.7 2.8 12 2.8 12Z" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="12" r="2.8" fill="currentColor"/></IconBase>
);
export const EnforcementIcon = (props: IconProps) => (
  <IconBase {...props}><path d="m8 4 7 7m-9.5-3.5 6-6 5 5-6 6-5-5ZM13 13l6.5 6.5M4 20h8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
export const AppealIcon = (props: IconProps) => (
  <IconBase {...props}><path d="M19 8a8 8 0 1 0 1 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><path d="M19 3v5h-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
);
