import React from 'react';
interface FlagIconProps {
  lang: 'en' | 'tr';
  className?: string;
}
export const FlagIcon: React.FC<FlagIconProps> = ({ lang, className }) => {
  switch (lang) {
    case 'en':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-us" viewBox="0 0 640 480" className={className}>
          <path fill="#bd3d44" d="M0 0h640v480H0z" />
          <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
          <path fill="#192f5d" d="M0 0h364.8v258.5H0z" />
          <defs>
            <g id="us-star">
              <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
            </g>
          </defs>
          <g transform="translate(34.5 27.5) scale(2.5)">
            <use href="#us-star" x="0" y="0" />
            <use href="#us-star" x="61" y="0" />
            <use href="#us-star" x="122" y="0" />
            <use href="#us-star" x="183" y="0" />
            <use href="#us-star" x="244" y="0" />
            <use href="#us-star" x="305" y="0" />
            <use href="#us-star" x="30.5" y="26" />
            <use href="#us-star" x="91.5" y="26" />
            <use href="#us-star" x="152.5" y="26" />
            <use href="#us-star" x="213.5" y="26" />
            <use href="#us-star" x="274.5" y="26" />
            <use href="#us-star" x="0" y="52" />
            <use href="#us-star" x="61" y="52" />
            <use href="#us-star" x="122" y="52" />
            <use href="#us-star" x="183" y="52" />
            <use href="#us-star" x="244" y="52" />
            <use href="#us-star" x="305" y="52" />
            <use href="#us-star" x="30.5" y="78" />
            <use href="#us-star" x="91.5" y="78" />
            <use href="#us-star" x="152.5" y="78" />
            <use href="#us-star" x="213.5" y="78" />
            <use href="#us-star" x="274.5" y="78" />
            <use href="#us-star" x="0" y="104" />
            <use href="#us-star" x="61" y="104" />
            <use href="#us-star" x="122" y="104" />
            <use href="#us-star" x="183" y="104" />
            <use href="#us-star" x="244" y="104" />
            <use href="#us-star" x="305" y="104" />
            <use href="#us-star" x="30.5" y="130" />
            <use href="#us-star" x="91.5" y="130" />
            <use href="#us-star" x="152.5" y="130" />
            <use href="#us-star" x="213.5" y="130" />
            <use href="#us-star" x="274.5" y="130" />
            <use href="#us-star" x="0" y="156" />
            <use href="#us-star" x="61" y="156" />
            <use href="#us-star" x="122" y="156" />
            <use href="#us-star" x="183" y="156" />
            <use href="#us-star" x="244" y="156" />
            <use href="#us-star" x="305" y="156" />
            <use href="#us-star" x="30.5" y="182" />
            <use href="#us-star" x="91.5" y="182" />
            <use href="#us-star" x="152.5" y="182" />
            <use href="#us-star" x="213.5" y="182" />
            <use href="#us-star" x="274.5" y="182" />
            <use href="#us-star" x="0" y="208" />
            <use href="#us-star" x="61" y="208" />
            <use href="#us-star" x="122" y="208" />
            <use href="#us-star" x="183" y="208" />
            <use href="#us-star" x="244" y="208" />
            <use href="#us-star" x="305" y="208" />
          </g>
        </svg>
      );
    case 'tr':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-tr" viewBox="0 0 640 480" className={className}>
          <g fillRule="evenodd">
            <path fill="#e30a17" d="M0 0h640v480H0z" />
            <path fill="#fff" d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9" />
            <path fill="#e30a17" d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z" />
            <path fill="#fff" d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z" />
          </g>
        </svg>
      );
    default:
      return null;
  }
};