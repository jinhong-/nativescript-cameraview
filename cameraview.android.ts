import * as common from "./cameraview-common";
import { View } from "ui/core/view";

declare var com, android;
global.moduleMerge(common, exports);



var CameraPreview = android.view.SurfaceView.extend({
    interfaces: [android.view.SurfaceHolder.Callback],
    init: function () {
        this.mContext = arguments[0];
    },
    init2: function () {
        this.mCamera = arguments[0];
        this.mCameraInfo = arguments[1];
        this.mSupportedPreviewSizes = this.mCamera.getParameters().getSupportedPreviewSizes().toArray();

        // Install a SurfaceHolder.Callback so we get notified when the
        // underlying surface is created and destroyed.
        this.mHolder = this.getHolder();
        this.mHolder.addCallback(this);
        // deprecated setting, but required on Android versions prior to 3.0
        this.mHolder.setType(android.view.SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
    },
    surfaceCreated: function () {
    },
    surfaceDestroyed: function () { },
    surfaceChanged: function () {
        let holder, format, w, h;
        holder = arguments[0];
        format = arguments[1];
        w = arguments[2];
        h = arguments[3];
        // If your preview can change or rotate, take care of those events here.
        // Make sure to stop the preview before resizing or reformatting it.
        if (this.mHolder.getSurface() == null) {
            // preview surface does not exist
            return;
        }

        // stop preview before making changes
        try {
            this.mCamera.stopPreview();
        } catch (e) {
            // ignore: tried to stop a non-existent preview
        }

        // set preview size and make any resize, rotate or reformatting changes here
        // start preview with new settings
        try {
            let parameters = this.mCamera.getParameters();
            parameters.setPreviewSize(this.mPreviewSize.width, this.mPreviewSize.height);
            this.mCamera.setParameters(parameters);
            let displayOrientation = this.getCorrectCameraOrientation(this.mCameraInfo, this.mCamera);
            this.mCamera.setDisplayOrientation(displayOrientation);
            this.mCamera.setPreviewDisplay(this.mHolder);
            this.mCamera.startPreview();
        } catch (e) {
        }
    },
    onMeasure: function () {
        let widthMeasureSpec: number, heightMeasureSpec: number;
        widthMeasureSpec = arguments[0];
        heightMeasureSpec = arguments[1];


        let width: number = android.view.View.resolveSize(this.getSuggestedMinimumWidth(), widthMeasureSpec);
        let height: number = android.view.View.resolveSize(this.getSuggestedMinimumHeight(), heightMeasureSpec);


        if (this.mSupportedPreviewSizes != null) {
            this.mPreviewSize = this.getOptimalPreviewSize(this.mSupportedPreviewSizes, width, height);
        }

        let ratio: number;
        if (this.mPreviewSize.height >= this.mPreviewSize.width)
            ratio = this.mPreviewSize.height / this.mPreviewSize.width;
        else
            ratio = this.mPreviewSize.width / this.mPreviewSize.height;

        // One of these methods should be used, second method squishes preview slightly
        this.setMeasuredDimension(width, (width * ratio));
        this.setMeasuredDimension((width * ratio), height);
    },
    getOptimalPreviewSize: function (sizes: any, w: number, h: number) {
        let ASPECT_TOLERANCE = 0.1;
        let targetRatio = h / w;

        if (sizes == null)
            return null;

        let optimalSize = null;
        let minDiff = Number.MAX_VALUE;

        let targetHeight = h;
        for (let i = 0; i < sizes.length; i++) {
            let size = sizes[i];
            let ratio = size.height / size.width;
            if (Math.abs(ratio - targetRatio) > ASPECT_TOLERANCE)
                continue;

            if (Math.abs(size.height - targetHeight) < minDiff) {
                optimalSize = size;
                minDiff = Math.abs(size.height - targetHeight);
            }
        }
        if (optimalSize == null) {
            minDiff = Number.MAX_VALUE;
            for (let i = 0; i < sizes.length; i++) {
                let size = sizes[i];
                if (Math.abs(size.height - targetHeight) < minDiff) {
                    optimalSize = size;
                    minDiff = Math.abs(size.height - targetHeight);
                }
            }
        }
        return optimalSize;
    },
    getCorrectCameraOrientation: function (cameraInfo, camera) {
        let rotation = this.mContext.getWindowManager().getDefaultDisplay().getRotation();
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
});

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
        this._android = new CameraPreview(this._context);
        this.camera = android.hardware.Camera.open(cameraId);
        let cameraInfo = this.getCameraInfo(cameraId);
        this._android.init2(this.camera, cameraInfo);
        // this._android = new android.view.TextureView(this._context);
        // this._android.setSurfaceTextureListener(new android.view.TextureView.SurfaceTextureListener({
        //     onSurfaceTextureAvailable: (surface, width, height) => {                
        //         let cameraInfo = this.getCameraInfo(cameraId);
        //         this.camera = android.hardware.Camera.open(cameraId);
        //         let orientation = this.getCorrectCameraOrientation(cameraInfo, this.camera)
        //         this.camera.setDisplayOrientation(orientation);
        //         this.camera.setPreviewTexture(surface);
        //         this.camera.startPreview();
        //     },
        //     onSurfaceTextureSizeChanged: (surface, width, height) => {
        //         let cameraInfo = this.getCameraInfo(cameraId);
        //         let orientation = this.getCorrectCameraOrientation(cameraInfo, this.camera)
        //         this.camera.setDisplayOrientation(orientation);
        //     },
        //     onSurfaceTextureDestroyed: (surface) => {
        //         this.camera.stopPreview();
        //         this.camera.release();
        //         return true;
        //     },
        //     onSurfaceTextureUpdated: (surface) => {
        //     }
        // }));
    }

    private getCameraInfo(cameraId: number): any {
        let cameraInfo = new android.hardware.Camera.CameraInfo();
        android.hardware.Camera.getCameraInfo(cameraId, cameraInfo);
        return cameraInfo;
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
    }
}