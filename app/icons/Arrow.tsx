import { joinClasses } from '@functions';

type propTypes = React.SVGProps<SVGSVGElement>;

export function Arrow({
    fill = 'currentColor',
    height = 32,
    width = 32,
    className = '',
    ...props
}: propTypes) {
    return (
        <svg
            className={joinClasses('arrow icon', className)}
            fill={fill}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            focusable="false"
            viewBox={`0 0 ${height} ${width}`}
        >
            <g id="LeftArrow" clipPath="url(#clip0_6_2)">
                <path
                    id="Arrow"
                    d="M4.77725 15.5818L24.4636 5.41049C25.5313 4.85885 26.4859 6.31412 25.5547 7.07379L14.9819 15.699C14.4811 16.1075 14.4936 16.8767 15.0074 17.2688L25.142 25.0031C26.1001 25.7343 25.1853 27.2229 24.1002 26.6984L4.8011 17.3705C4.0591 17.0119 4.04507 15.96 4.77725 15.5818Z"
                />
            </g>
            <defs>
                <clipPath id="clip0_6_2">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export default Arrow;
