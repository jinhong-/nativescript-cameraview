import * as common from "./cameraview-common";
import { View } from "ui/core/view";
import * as application from "application";

declare var com, android;
global.moduleMerge(common, exports);
export class CameraView extends common.CameraView {
    private _android;
    get android(): any {
        return this._android;

    }

    get _nativeView(): any {
        return this._android;
    }

    private camera;

    public _createUI() {
        let cameraId = 1;
        application.on(application.orientationChangedEvent, this.onOrientationChanged, this);
        this._android = new android.view.TextureView(this._context);
        this._android.setSurfaceTextureListener(new android.view.TextureView.SurfaceTextureListener({
            onSurfaceTextureAvailable: (surface, width, height) => {                
                let cameraInfo = this.getCameraInfo(cameraId);
                this.camera = android.hardware.Camera.open(cameraId);
                let orientation = this.getCorrectCameraOrientation(cameraInfo, this.camera)
                this.camera.setDisplayOrientation(orientation);
                this.camera.setPreviewTexture(surface);
                this.camera.startPreview();
            },
            onSurfaceTextureSizeChanged: (surface, width, height) => {
                let cameraInfo = this.getCameraInfo(cameraId);
                let orientation = this.getCorrectCameraOrientation(cameraInfo, this.camera)
                this.camera.setDisplayOrientation(orientation);
            },
            onSurfaceTextureDestroyed: (surface) => {
                this.camera.stopPreview();
                this.camera.release();
                return true;
            },
            onSurfaceTextureUpdated: (surface) => {
            }
        }));
    }

    private getAllCameraInfo(): any[] {
        let numberOfCameras = android.hardware.Camera.getNumberOfCameras();
        return Array.apply(null, { length: numberOfCameras })
            .map((_, i) => this.getCameraInfo(i));
    }

    private getCameraInfo(cameraId: number): any {
        let cameraInfo = new android.hardware.Camera.CameraInfo();
        android.hardware.Camera.getCameraInfo(cameraId, cameraInfo);
        return cameraInfo;
    }

    private onOrientationChanged(args: application.OrientationChangedEventData) {
        var orientation = args.newValue;
        console.log(orientation);
    }

    private getCorrectCameraOrientation(cameraInfo, camera) {

        let rotation = this._context.getWindowManager().getDefaultDisplay().getRotation();
        let degrees = 0;

        switch (rotation) {
            case android.view.Surface.ROTATION_0:
                degrees = 0;
                break;

            case android.view.Surface.ROTATION_90:
                degrees = 90;
                break;

            case android.view.Surface.ROTATION_180:
                degrees = 180;
                break;

            case android.view.Surface.ROTATION_270:
                degrees = 270;
                break;

        }

        let result: number;
        if (cameraInfo.facing == android.hardware.Camera.CameraInfo.CAMERA_FACING_FRONT) {
            result = (cameraInfo.orientation + degrees) % 360;
            result = (360 - result) % 360;
        } else {
            result = (cameraInfo.orientation - degrees + 360) % 360;
        }

        return result;
    }


    public onUnloaded() {
        super.onUnloaded();
        //application.off(application.orientationChangedEvent, this.onOrientationChanged);
    }

    // public onSurfaceTextureAvailable(surface, width, height) {
    //     this.camera = android.hardware.Camera.open(0);
    //     this.camera.setPreviewTexture(surface);
    //     this.camera.startPreview();
    //     //   try {
    //     //       mCamera.setPreviewTexture(surface);
    //     //       mCamera.startPreview();
    //     //   } catch (IOException ioe) {
    //     //       // Something bad happened
    //     //   }
    // }

    // public onSurfaceTextureSizeChanged(surface, width, height) {
    //     // Ignored, Camera does all the work for us
    // }

    // public onSurfaceTextureDestroyed(surface) {
    //     //   mCamera.stopPreview();
    //     //   mCamera.release();
    //     //   return true;
    // }

    // public onSurfaceTextureUpdated(surface) {
    //     // Invoked every time there's a new Camera preview frame
    // }
}