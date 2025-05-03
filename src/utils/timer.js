'use strict';
// @ts-check

/**
 * @typedef {import('src/types/timer.type').TyTimer.Unit} Unit
*/

export class Timer {
  /**
   * @param {Unit} [startFrom]
   */
  constructor(startFrom) {
    // Private state using closure
    /**@type {number} */
    let m_durationTime = startFrom || 0;
    /**@type {Unit | null} */
    let m_startTime = null;
    /**@type {Unit | null} */
    let m_stopTime = null;

    this.start = function () {
      if (m_startTime && m_stopTime) {
        m_durationTime += m_stopTime - m_startTime;
      }

      m_startTime = Date.now();
      m_stopTime = null;
      return this; // Maintain chainability
    };

    this.stop = function () {
      if (m_startTime === null) {
        throw new Error("Duration has not been started properly.");
      }

      m_stopTime = Date.now();
      return this; // Maintain chainability
    };

    this.now = function () {
      if (m_startTime === null) {
        throw new Error("Timer has not been used properly.");
      }

      if (m_stopTime) {// the timer has been stopped
        return m_stopTime - m_startTime;
      }

      return Date.now() - m_startTime;
    };

    this.duration = function () {
      return m_durationTime + this.now();
    };
  }
}
