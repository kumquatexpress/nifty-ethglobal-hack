// @ts-nocheck
import * as React from "react";

const SvgComponent = (props) => (
  <svg
    id="badger"
    className={props.className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 631.54 632.93"
    style={{
      width: props.size,
    }}
    {...props}
  >
    <defs>
      <style>{".cls-2{fill-rule:evenodd;fill:#fff}"}</style>
    </defs>
    <path
      id="shieldOutline"
      d="M315.77 12q-49.47.91-98.71 6.49-9.67 1.1-19.35 2.33a669.32 669.32 0 0 0-80.53 15.08c-13.23 3.38-26.36 7.15-39.44 11-9.85 2.93-19.56 6.53-29.1 10.32C37.47 61.69 27 66 20.67 76.9c-10 17.31-8.83 38.62-8.4 57.84.3 13.14 1 26.26 1.57 39.39 1.59 33.59 4.26 67.14 8.72 100.47 7.05 52.65 18.77 105.2 40.1 154 43.2 98.92 140.4 192.31 253.11 192.28s209.91-93.36 253.11-192.28c21.33-48.85 33-101.4 40.09-154 4.47-33.33 7.14-66.88 8.73-100.47.62-13.12 1.27-26.25 1.57-39.39.43-19.22 1.55-40.53-8.4-57.84-6.29-10.94-16.8-15.2-28-19.64-9.55-3.79-19.25-7.39-29.1-10.32-13.09-3.89-26.21-7.66-39.44-11a671.08 671.08 0 0 0-80.54-15.08q-9.66-1.25-19.34-2.33Q365.31 13 315.77 12Z"
      style={{
        fillRule: "evenodd",
        fill: "#1c2c42",
        stroke: "#fff",
        strokeMiterlimit: 10,
        strokeWidth: 24,
      }}
    />
    <path
      id="stripes"
      className="cls-2"
      d="M315.77 96c-16.53.31-32.67 5.62-47 13.75-21.05 11.88-22.87 51-25.92 72.76-4 28.48-4.87 57.35-3.69 86.06 1.22 29.83 4.63 59.51 9 89 3 20.7 17.17 57.34 6.8 77-2 3.73-5.2 6.58-7.83 9.88-3.4 4.26-6.21 9.64-11.34 11.42-26.29 9.13-55.22-44-63.67-62.47-12.86-28-18.91-59.22-22.26-89.39a729.07 729.07 0 0 1-4.44-85.89c.18-24.66 2-49 4.46-73.47a4 4 0 0 0-.12-1.94 3.83 3.83 0 0 0-1.22-1.41 35.65 35.65 0 0 0-12.57-6.72c-.58-.16-1.16-.31-1.75-.45C86.88 123.1 92.63 169.62 94 202c2.7 65.42 12.18 135.34 38.52 195.66C163.77 469.33 234.16 537 315.77 536.93s152-67.6 183.29-139.23c26.34-60.32 35.82-130.24 38.52-195.7 1.33-32.41 7.08-78.94-40.17-67.94-.59.14-1.17.29-1.75.45a35.65 35.65 0 0 0-12.57 6.72 3.7 3.7 0 0 0-1.22 1.42 3.93 3.93 0 0 0-.12 1.93c2.46 24.51 4.28 48.81 4.46 73.47a729.07 729.07 0 0 1-4.44 85.95c-3.35 30.17-9.41 61.38-22.26 89.39-8.45 18.44-37.38 71.6-63.67 62.47-5.13-1.78-7.94-7.15-11.34-11.42-2.63-3.3-5.86-6.15-7.83-9.88-10.37-19.62 3.76-56.26 6.8-77 4.33-29.51 7.74-59.19 9-89 1.18-28.71.29-57.58-3.69-86.06-3.06-21.79-4.87-60.88-25.92-72.76-14.42-8.13-30.56-13.44-47.09-13.74Z"
    />
    <path
      id="rightEye"
      className="cls-2"
      d="M448 379.49a16.83 16.83 0 0 1-4.56 8.65c-2.14 2.06-5.08 3-7.49 4.74-7.44 5.31-9.79 16.68-19.84 18.53a16 16 0 0 1-18-10.41c-2-5.32-1.72-11.67-.53-17.18 2.29-10.55 8.09-20.47 18.11-25.29 11.49-5.53 29.58-2 32.39 12.09a22.29 22.29 0 0 1-.08 8.87Z"
    />
    <path
      id="leftEye"
      className="cls-2"
      d="M183.47 379.49a16.79 16.79 0 0 0 4.56 8.66c2.13 2.05 5.08 3 7.49 4.74 7.43 5.3 9.78 16.67 19.83 18.52a16 16 0 0 0 18-10.4c2-5.33 1.72-11.68.52-17.19-2.28-10.55-8.09-20.47-18.11-25.29-11.49-5.53-29.58-2-32.38 12.09a22.11 22.11 0 0 0 .09 8.87Z"
    />
  </svg>
);

export default SvgComponent;
