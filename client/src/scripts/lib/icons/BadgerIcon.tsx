//@ts-nocheck

import * as React from "react";
import { cx, css } from "@emotion/css/macro";

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 445.48 440.94"
    className={cx(
      `icon badgerIcon ${props.inverted ? "inverted" : null}`,
      css`
        width: ${props.size}px !important;
        height: ${props.size}px !important;
      `
    )}
    {...props}
  >
    <defs>
      <style>{".cls-1{fill:none;fill-rule:evenodd}"}</style>
    </defs>
    <path
      className="badgerStripes"
      d="M222.74 0c-16.53.31-32.67 5.62-47.06 13.74-21 11.89-22.86 51-25.91 72.77-4 28.48-4.87 57.35-3.69 86.06 1.21 29.82 4.63 59.51 9 89 3 20.7 17.17 57.33 6.8 77-2 3.73-5.2 6.58-7.83 9.87-3.4 4.27-6.21 9.65-11.34 11.43-26.29 9.12-55.22-44-63.67-62.47-12.86-28-18.92-59.23-22.27-89.39a731.33 731.33 0 0 1-4.47-85.91c.18-24.66 2-49 4.46-73.47a4 4 0 0 0-.12-1.94 3.86 3.86 0 0 0-1.22-1.42 35.88 35.88 0 0 0-12.57-6.71c-.58-.17-1.16-.32-1.75-.45C-6.15 27.1-.4 73.63.93 106c2.7 65.42 12.18 135.35 38.52 195.66C70.74 373.34 141.12 441 222.74 440.94s152-67.6 183.28-139.24c26.34-60.31 35.83-130.24 38.52-195.66 1.34-32.41 7.09-78.94-40.16-67.93-.59.13-1.17.28-1.75.45a35.79 35.79 0 0 0-12.57 6.71 3.77 3.77 0 0 0-1.22 1.42 4 4 0 0 0-.12 1.94c2.46 24.51 4.28 48.81 4.46 73.47a729.18 729.18 0 0 1-4.44 85.9c-3.35 30.16-9.41 61.37-22.26 89.39-8.48 18.42-37.38 71.61-63.67 62.46-5.13-1.78-7.94-7.16-11.34-11.43-2.63-3.29-5.86-6.14-7.83-9.87-10.37-19.63 3.76-56.26 6.8-77 4.33-29.51 7.74-59.2 9-89 1.17-28.71.29-57.58-3.7-86.06-3.05-21.8-4.86-60.88-25.91-72.77C255.41 5.62 239.27.31 222.74 0Z"
    />
    <path
      className="badgerRightEye"
      d="M355 283.5a16.91 16.91 0 0 1-4.56 8.65c-2.14 2.05-5.08 3-7.5 4.74-7.43 5.31-9.78 16.68-19.83 18.52a16 16 0 0 1-18-10.4c-2-5.33-1.72-11.67-.53-17.18 2.28-10.55 8.09-20.48 18.11-25.3 11.49-5.52 29.58-2 32.38 12.09a22.15 22.15 0 0 1-.07 8.88Z"
    />
    <path
      className="badgerLeftEye"
      d="M90.43 283.5a16.85 16.85 0 0 0 4.57 8.65c2.13 2.06 5.08 3 7.49 4.74 7.43 5.31 9.78 16.68 19.83 18.53a16 16 0 0 0 18-10.41c2-5.32 1.73-11.67.53-17.18-2.28-10.55-8.09-20.47-18.11-25.29-11.49-5.53-29.58-2.05-32.38 12.09a22.28 22.28 0 0 0 .07 8.87Z"
    />
  </svg>
);

export default SvgComponent;
