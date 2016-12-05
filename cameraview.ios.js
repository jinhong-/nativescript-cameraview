"use strict";
var common = require("./cameraview-common");
global.moduleMerge(common, exports);
var CameraView = (function (_super) {
    __extends(CameraView, _super);
    function CameraView() {
        _super.apply(this, arguments);
    }
    return CameraView;
}(common.CameraView));
exports.CameraView = CameraView;
