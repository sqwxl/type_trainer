
export function Timer() {
  let paused: boolean;
  let startMark: number;
  let pauseMark: number;
  let pausedLength: number;
  return {
    start: () => {
      startMark = Date.now();
      paused = false;
      pauseMark = 0;
      pausedLength = 0;
    },
    pause: () => {
      if (!paused) {
        paused = true;
        pauseMark = Date.now();
      }
    },
    unPause: () => {
      if (paused) {
        paused = false;
        pausedLength += Date.now() - pauseMark;
      }
    },
    getTimeElapsed: () => {
      let total = Date.now() - (startMark + pausedLength);
      return total;
    },
  };
}
