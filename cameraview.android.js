"use strict";
var common = require("./cameraview-common");
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
        this.mHolder = this.getHolder();
        this.mHolder.addCallback(this);
        this.mHolder.setType(android.view.SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
    },
    surfaceCreated: function () {
    },
    surfaceDestroyed: function () { },
    surfaceChanged: function () {
        var holder, format, w, h;
        holder = arguments[0];
        format = arguments[1];
        w = arguments[2];
        h = arguments[3];
        if (this.mHolder.getSurface() == null) {
            return;
        }
        try {
            this.mCamera.stopPreview();
        }
        catch (e) {
        }
        try {
            var parameters = this.mCamera.getParameters();
            parameters.setPreviewSize(this.mPreviewSize.width, this.mPreviewSize.height);
            this.mCamera.setParameters(parameters);
            var displayOrientation = this.getCorrectCameraOrientation(this.mCameraInfo, this.mCamera);
            this.mCamera.setDisplayOrientation(displayOrientation);
            this.mCamera.setPreviewDisplay(this.mHolder);
            this.mCamera.startPreview();
        }
        catch (e) {
        }
    },
    onMeasure: function () {
        var widthMeasureSpec, heightMeasureSpec;
        widthMeasureSpec = arguments[0];
        heightMeasureSpec = arguments[1];
        var width = android.view.View.resolveSize(this.getSuggestedMinimumWidth(), widthMeasureSpec);
        var height = android.view.View.resolveSize(this.getSuggestedMinimumHeight(), heightMeasureSpec);
        if (this.mSupportedPreviewSizes != null) {
            this.mPreviewSize = this.getOptimalPreviewSize(this.mSupportedPreviewSizes, width, height);
        }
        var ratio;
        if (this.mPreviewSize.height >= this.mPreviewSize.width)
            ratio = this.mPreviewSize.height / this.mPreviewSize.width;
        else
            ratio = this.mPreviewSize.width / this.mPreviewSize.height;
        this.setMeasuredDimension(width, (width * ratio));
        this.setMeasuredDimension((width * ratio), height);
    },
    getOptimalPreviewSize: function (sizes, w, h) {
        var ASPECT_TOLERANCE = 0.1;
        var targetRatio = h / w;
        if (sizes == null)
            return null;
        var optimalSize = null;
        var minDiff = Number.MAX_VALUE;
        var targetHeight = h;
        for (var i = 0; i < sizes.length; i++) {
            var size = sizes[i];
            var ratio = size.height / size.width;
            if (Math.abs(ratio - targetRatio) > ASPECT_TOLERANCE)
                continue;
            if (Math.abs(size.height - targetHeight) < minDiff) {
                optimalSize = size;
                minDiff = Math.abs(size.height - targetHeight);
            }
        }
        if (optimalSize == null) {
            minDiff = Number.MAX_VALUE;
            for (var i = 0; i < sizes.length; i++) {
                var size = sizes[i];
                if (Math.abs(size.height - targetHeight) < minDiff) {
                    optimalSize = size;
                    minDiff = Math.abs(size.height - targetHeight);
                }
            }
        }
        return optimalSize;
    },
    getCorrectCameraOrientation: function (cameraInfo, camera) {
        var rotation = this.mContext.getWindowManager().getDefaultDisplay().getRotation();
        var degrees = 0;
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
        var result;
        if (cameraInfo.facing == android.hardware.Camera.CameraInfo.CAMERA_FACING_FRONT) {
            result = (cameraInfo.orientation + degrees) % 360;
            result = (360 - result) % 360;
        }
        else {
            result = (cameraInfo.orientation - degrees + 360) % 360;
        }
        return result;
    }
});
var CameraView = (function (_super) {
    __extends(CameraView, _super);
    function CameraView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CameraView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CameraView.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    CameraView.prototype._createUI = function () {
        var cameraId = 1;
        this._android = new CameraPreview(this._context);
        this.camera = android.hardware.Camera.open(cameraId);
        var cameraInfo = this.getCameraInfo(cameraId);
        this._android.init2(this.camera, cameraInfo);
    };
    CameraView.prototype.getCameraInfo = function (cameraId) {
        var cameraInfo = new android.hardware.Camera.CameraInfo();
        android.hardware.Camera.getCameraInfo(cameraId, cameraInfo);
        return cameraInfo;
    };
    CameraView.prototype.getCorrectCameraOrientation = function (cameraInfo, camera) {
        var rotation = this._context.getWindowManager().getDefaultDisplay().getRotation();
        var degrees = 0;
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
        var result;
        if (cameraInfo.facing == android.hardware.Camera.CameraInfo.CAMERA_FACING_FRONT) {
            result = (cameraInfo.orientation + degrees) % 360;
            result = (360 - result) % 360;
        }
        else {
            result = (cameraInfo.orientation - degrees + 360) % 360;
        }
        return result;
    };
    CameraView.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
    };
    return CameraView;
}(common.CameraView));
exports.CameraView = CameraView;
