import React, { CSSProperties, FC } from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop, DropTargetMonitor } from "react-dnd";

import { DropTargetError } from "./index";

export interface DropTargetProps {
  dropTargetElement: JSX.Element;
  onError: (error: DropTargetError) => void;
  onSuccess: (file: File) => void;
  onIsActiveChanged: (isActive: boolean) => void;
  className?: ClassNamesArg;
}

export const DropTarget: FC<DropTargetProps> = ({
  dropTargetElement,
  onError,
  onSuccess,
  onIsActiveChanged,
  className,
  ...props
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop({ files }: { files: any[] }) {
        if (files.length == 0) {
          onError(DropTargetError.UNKNOWN_ERROR);
        } else if (files.length > 1) {
          onError(DropTargetError.TOO_MANY_FILES);
        } else {
          onSuccess(files[0]);
        }
      },
      collect: (monitor: DropTargetMonitor) => {
        onIsActiveChanged(monitor.canDrop());
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [props]
  );

  return (
    <div className={cx(className)} ref={drop}>
      {dropTargetElement}
    </div>
  );
};
