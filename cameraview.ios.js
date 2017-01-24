"use strict";
var common = require("./cameraview-common");
global.moduleMerge(common, exports);
var CameraView = (function (_super) {
    __extends(CameraView, _super);
    function CameraView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CameraView;
}(common.CameraView));
exports.CameraView = CameraView;
