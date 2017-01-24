"use strict";
var common = require("./cameraview-common");
var application = require("application");
global.moduleMerge(common, exports);
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
        var _this = this;
        var cameraId = 1;
        application.on(application.orientationChangedEvent, this.onOrientationChanged, this);
        this._android = new android.view.TextureView(this._context);
        this._android.setSurfaceTextureListener(new android.view.TextureView.SurfaceTextureListener({
            onSurfaceTextureAvailable: function (surface, width, height) {
                var cameraInfo = _this.getCameraInfo(cameraId);
                _this.camera = android.hardware.Camera.open(cameraId);
                var orientation = _this.getCorrectCameraOrientation(cameraInfo, _this.camera);
                _this.camera.setDisplayOrientation(orientation);
                _this.camera.setPreviewTexture(surface);
                _this.camera.startPreview();
            },
            onSurfaceTextureSizeChanged: function (surface, width, height) {
                var cameraInfo = _this.getCameraInfo(cameraId);
                var orientation = _this.getCorrectCameraOrientation(cameraInfo, _this.camera);
                _this.camera.setDisplayOrientation(orientation);
            },
            onSurfaceTextureDestroyed: function (surface) {
                _this.camera.stopPreview();
                _this.camera.release();
                return true;
            },
            onSurfaceTextureUpdated: function (surface) {
            }
        }));
    };
    CameraView.prototype.getAllCameraInfo = function () {
        var _this = this;
        var numberOfCameras = android.hardware.Camera.getNumberOfCameras();
        return Array.apply(null, { length: numberOfCameras })
            .map(function (_, i) { return _this.getCameraInfo(i); });
    };
    CameraView.prototype.getCameraInfo = function (cameraId) {
        var cameraInfo = new android.hardware.Camera.CameraInfo();
        android.hardware.Camera.getCameraInfo(cameraId, cameraInfo);
        return cameraInfo;
    };
    CameraView.prototype.onOrientationChanged = function (args) {
        var orientation = args.newValue;
        console.log(orientation);
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
