import * as common from "./cameraview-common";
import { View } from "ui/core/view";

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
        this._android = new android.view.TextureView(this._context);
        this._android.setSurfaceTextureListener(new android.view.TextureView.SurfaceTextureListener({
            onSurfaceTextureAvailable: (surface, width, height) => {
                this.camera = android.hardware.Camera.open();
                this.camera.setPreviewTexture(surface);
                this.camera.startPreview();
            },
            onSurfaceTextureSizeChanged: (surface, width, height) => {
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