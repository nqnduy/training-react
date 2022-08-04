import EventEmitter from 'events';

/**
 * This callback is displayed as a global member.
 * @callback _updateCallback
 * @param {{
 * tick: Number
 * deltaTick: Number
 * }} events
 */

class Timer {
    static Event = {
        TICKER: 'ticker',
    };

    static count = 1;

    static listener = new EventEmitter();

    /**
     *
     * @param {_updateCallback} fn
     */
    static addUpdateListener(fn) {
        this.listener.on(Timer.Event.TICKER, fn);
    }

    /**
     *
     * @param {_updateCallback} fn
     */
    static removeUpdateListener(fn) {
        this.listener.off(Timer.Event.TICKER, fn);
    }

    static #interval;

    static init() {
        let prevDate = new Date();
        if (!this.#interval) {
            console.log('Timer init');
            Timer.count = 0;

            this.#interval = setInterval(() => {
                const tick = new Date();
                const deltaTick = tick - prevDate;
                Timer.listener.emit(Timer.Event.TICKER, { tick, deltaTick });
                prevDate = new Date();

                Timer.count++;
            }, 250);
        }
    }

    static async wait(timeout = 1000) {
        await this.setTimeout(timeout);
    }

    static setTimeout(timeout = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }
}

export default Timer;

if (typeof window == 'undefined') Timer.init();
