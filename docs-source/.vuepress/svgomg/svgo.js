/**
 * Source: https://github.com/jakearchibald/svgomg
 * Original License: MIT
 */

import { WorkerMessenger } from './worker-messenger';
import { SvgFile } from './svg-file';

export class Svgo extends WorkerMessenger {
  constructor() {
    super('./svgo-worker.js');
    this._abortOnNextIteration = false;
    this._currentJob = Promise.resolve();
  }

  async load(svgText) {
    const {width, height} = await this._requestResponse({
      action: 'load',
      data: svgText
    });

    return new SvgFile(svgText, width, height);
  }

  /**
   * 
   * @param {*} settings 
   * @param {*} iterationCallback 
   */
  process(settings, iterationCallback) {
    return this._currentJob = this.abortCurrent().then(async () => {
      this._abortOnNextIteration = false;

      let result = await this._requestResponse({
        action: 'process',
        settings
      });

      var resultFile = new SvgFile(result.data, result.dimensions.width, result.dimensions.height);

      iterationCallback(resultFile);

      if (settings.multipass) {
        while (result = await this.nextPass()) {
          if (this._abortOnNextIteration) {
            throw Error('abort');
          }
          resultFile = new SvgFile(result.data, result.dimensions.width, result.dimensions.height);
          iterationCallback(resultFile);
        }
      }

      // return final result
      return resultFile;
    });
  }

  nextPass() {
    return this._requestResponse({
      action: 'nextPass'
    });
  }

  async abortCurrent() {
    this._abortOnNextIteration = true;
    await this._currentJob;
  }

  async release() {
    await this.abortCurrent();
    super.release();
  }
}