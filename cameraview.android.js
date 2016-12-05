"use strict";
var common = require("./cameraview-common");
global.moduleMerge(common, exports);
var CameraView = (function (_super) {
    __extends(CameraView, _super);
    function CameraView() {
        _super.apply(this, arguments);
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
        this._android = new android.view.TextureView(this._context);
        this._android.setSurfaceTextureListener(new android.view.TextureView.SurfaceTextureListener({
            onSurfaceTextureAvailable: function (surface, width, height) {
                _this.camera = android.hardware.Camera.open();
                _this.camera.setPreviewTexture(surface);
                _this.camera.startPreview();
            },
            onSurfaceTextureSizeChanged: function (surface, width, height) {
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
    return CameraView;
}(common.CameraView));
exports.CameraView = CameraView;
