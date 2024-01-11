import { forwardRef } from "react";

type props = {ref?: React.RefObject<SVGSVGElement>} & React.SVGProps<SVGSVGElement>;


const CheckMark = forwardRef<SVGSVGElement, props>(
  ({ fill = "currentColor", height = 32, width = 32, className = '', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={`checkmark icon ${className}`}
        fill={fill}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        focusable="false"
        viewBox={`0 0 ${height} ${width}`}
      >
    <g clipPath="url(#clip0_1_2)">
        <path  pathLength={10} id="checkbox-mark" d="M11.3167 26.8895L4.30087 20.7333C3.87451 20.3592 3.73862 19.7525 3.96464 19.2322C4.25777 18.5575 5.05029 18.2583 5.71619 18.5709L11.5987 21.3321C12.4339 21.7241 13.4288 21.494 14.007 20.7751L26.7429 4.94129C27.118 4.47492 27.8381 4.50713 28.1701 5.00511C28.3696 5.30443 28.3683 5.6947 28.1668 5.99268L14.2925 26.5066C13.618 27.5039 12.2217 27.6836 11.3167 26.8895Z" />
        <rect pathLength={10} id="checkbox-border" x="0.5" y="0.5" width="31" height="31" rx="4.5" />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="32" height="32" />
        </clipPath>
      </defs>
      </svg>
    );
  }
);

export default CheckMark;


// export default function CheckMark({ ref, fill = "currentColor", height = "32px", width = "32px", className = '', ...props }: props) {
//   return (
//     <svg
//       ref={ref}
//       className={'checkmark icon ' + className}
//       fill={fill}
//       aria-hidden="true"
//       xmlns="http://www.w3.org/2000/svg"
//       width={width}
//       height={height}
//       focusable="false"
//       viewBox={`-5 -5 ${height} ${width} `}>
//       <g id="CheckMark" clipPath="url(#clip0_1_2)">
//         <path id="checkbox-mark" d="M11.3167 26.8895L4.30087 20.7333C3.87451 20.3592 3.73862 19.7525 3.96464 19.2322C4.25777 18.5575 5.05029 18.2583 5.71619 18.5709L11.5987 21.3321C12.4339 21.7241 13.4288 21.494 14.007 20.7751L26.7429 4.94129C27.118 4.47492 27.8381 4.50713 28.1701 5.00511C28.3696 5.30443 28.3683 5.6947 28.1668 5.99268L14.2925 26.5066C13.618 27.5039 12.2217 27.6836 11.3167 26.8895Z" />
//         <rect id="checkbox-border" x="0.5" y="0.5" width="31" height="31" rx="4.5" />
//       </g>
//       <defs>
//         <clipPath id="clip0_1_2">
//           <rect width="32" height="32" fill="white" />
//         </clipPath>
//       </defs>
//     </svg>
//   )
// }
