import {Observable} from "data/observable";
// import {NativescriptWikitude} from "nativescript-wikitude";
import * as cam from 'nativescript-cameraview';

export class HelloWorldModel extends Observable {
  public message: string;
  // private nativescriptWikitude: NativescriptWikitude;

  constructor() {
    super();
    // this.nativescriptWikitude = new NativescriptWikitude();
    // this.message = this.nativescriptWikitude.message;
  }
}