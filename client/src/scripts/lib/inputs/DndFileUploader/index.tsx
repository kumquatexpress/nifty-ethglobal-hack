import React, {
  forwardRef,
  useEffect,
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import { cx, css, ClassNamesArg } from "@emotion/css";
import { DropTarget } from "./DropTarget";
import * as Icon from "react-feather";
import colors from "@modules/colors.module.scss";

type Props = {
  id?: string;
  name?: string;
  className?: ClassNamesArg;
  onImgSrcLoaded?: (src: string) => void;
  onError?: (error: DropTargetError) => void;
  onSuccess?: (file: File) => void;
  onIsActiveChanged?: (isActive: boolean) => void;
  dropText?: string;
  onFileChanged?: () => void;
  onUpdateImageRef?: (imageElement: HTMLImageElement) => void;
  size?: {
    width: number;
    height: number;
  };
  defaultImgSrc?: string;
};

type DndFileUploaderHandle = {
  img: () => HTMLImageElement | null;
};

export enum DropTargetError {
  TOO_MANY_FILES = "TOO_MANY_FILES",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

const fr = new FileReader();

const DndFileUploader: React.ForwardRefRenderFunction<
  DndFileUploaderHandle,
  Props
> = (
  {
    onImgSrcLoaded,
    onSuccess,
    onError,
    onIsActiveChanged,
    className,
    dropText = "Drop it here :)",
    onUpdateImageRef,
    defaultImgSrc,
    size,
    ...props
  }: Props,
  ref
) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<DropTargetError | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const [imgSrcLoaded, setImgSrcLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    img: () => {
      return imgRef.current;
    },
  }));

  const onActiveChangedInternal = useCallback((active: boolean) => {
    onIsActiveChanged && onIsActiveChanged(active);
    setIsActive(active);
  }, []);
  const onErrorInternal = useCallback((error: DropTargetError) => {
    onError && onError(error);
    setError(error);
  }, []);
  const onSuccessInternal = useCallback((file: File) => {
    onSuccess && onSuccess(file);
    setFileStateAndLoad(file);
  }, []);

  useEffect(() => {
    function handleImageLoaded() {
      onUpdateImageRef && onUpdateImageRef(imgRef.current as HTMLImageElement);
    }
    function handleFileReader() {
      // convert image file to base64 string
      if (imgRef.current != null && fr.result != null) {
        imgRef.current.src = fr.result as string;
        imgRef.current.addEventListener("load", handleImageLoaded);
        setImgSrcLoaded(true);
        onImgSrcLoaded && onImgSrcLoaded(fr.result as string);
      }
    }
    fr.addEventListener("load", handleFileReader, false);
    return () => {
      fr.removeEventListener("load", handleFileReader);
      imgRef.current?.removeEventListener("load", handleImageLoaded);
    }; // ... and to false on unmount
  }, []);

  const setFileStateAndLoad = useCallback(
    (file) => {
      setFile(file);
      setImgSrcLoaded(false);
      fr.readAsDataURL(file);
    },
    [setFile]
  );

  const onManualInputChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        manualInputRef.current?.files &&
        manualInputRef.current?.files[0] != null
      ) {
        setFileStateAndLoad(manualInputRef.current?.files[0]);
      }
    },
    []
  );

  const dropIsActive = isActive && error == null;
  return (
    <div
      className={cx(
        styles.container,
        size != null &&
          css`
            width: ${size.width};
            height: ${size.height};
          `,
        "badger-dndfileuploader"
      )}
    >
      <DropTarget
        className={cx(styles.uploadWrapper, className)}
        dropTargetElement={
          <div
            className={cx(
              styles.inputFilePicker,
              dropIsActive && "dnd-fileactive"
            )}
          >
            <label
              htmlFor="file-upload"
              className={cx(styles.inputFilePickerTarget)}
            >
              <div className={cx(styles.inputFilePickerTargetDropPreview)}>
                {dropText}
              </div>
              <img
                className={cx(
                  styles.image,
                  !imgSrcLoaded && styles.imageHidden
                )}
                ref={imgRef}
              />
              <div
                className={cx(
                  styles.inputFilePickerControls,
                  imgSrcLoaded && styles.inputFilePickerControlsHidden,
                  css`
                    background-image: url(${defaultImgSrc});
                  `
                )}
              >
                {!dropIsActive && <Icon.Image size={50} />}
              </div>
            </label>
            <input
              id="file-upload"
              ref={manualInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={onManualInputChanged}
            />
          </div>
        }
        onError={onErrorInternal}
        onSuccess={onSuccessInternal}
        onIsActiveChanged={onActiveChangedInternal}
      />
    </div>
  );
};

const styles = {
  container: css`
    align-self: center;
    width: 250px;
    height: 250px;
    flex-shrink: 0;
    display: flex;
    cursor: pointer;
  `,
  uploadWrapper: css`
    width: 100%;
    height: 100%;
  `,
  inputFilePicker: css`
    width: 100%;
    height: 100%;
    input[type="file"] {
      display: none;
    }

    box-shadow: 0px 0px 0px 1px ${colors.badgerBlue};
    transition: box-shadow 0.05s linear, opacity 0.05s linear;

    &:hover {
      box-shadow: 0px 0px 0px 2px ${colors.badgerBlue};
      opacity: 1;
    }

    &.has-tooltip-active:before {
      animation-duration: 0.8s;
      animation-name: tooltipBounce;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    &.has-tooltip-active:after {
      animation-duration: 0.8s;
      animation-name: tooltipArrowBounce;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }
  `,
  inputFilePickerTarget: css`
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  `,
  inputFilePickerTargetDropPreview: css`
    display: none;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    .dnd-fileactive & {
      display: flex;
      transition: box-shadow 0.05s linear, opacity 0.05s linear;
      box-shadow: 0px 0px 0px 2px ${colors.badgerBlue};
      opacity: 1;
    }
  `,
  image: css`
    cursor: pointer;
    .dnd-fileactive & {
      opacity: 0.1;
    }
  `,
  imageHidden: css`
    display: none;
  `,
  inputFilePickerControls: css`
    width: 100%;
    height: 100%;
    padding: 6px 12px;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.05);
    opacity: 0.6;

    &::before {
      content: "";
      background-size: cover;
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      opacity: 0.1;
    }
  `,

  inputFilePickerControlsHidden: css`
    display: none;
  `,
};
export default forwardRef(DndFileUploader);
