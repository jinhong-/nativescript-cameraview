import * as common from "./cameraview-common";
export declare class CameraView extends common.CameraView {
    private _android;
    readonly android: any;
    readonly _nativeView: any;
    private camera;
    _createUI(): void;
    private getCameraInfo(cameraId);
    private getCorrectCameraOrientation(cameraInfo, camera);
    onUnloaded(): void;
}
