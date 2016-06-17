/** Measures framerate for the time between start() and stop() calls */
function FramerateMeasurer () {
  this.start = function start () {
    this._beginTime = ( performance || Date ).now()
    this._frames = 0
    this._animationFrameId = requestAnimationFrame(this._loop)
  }.bind(this)

  this.stop = function stop () {
    const endTime = ( performance || Date ).now()

    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId)
    }

    return {
      beginTime: this._beginTime,
      endTime,
      framerate: (this._frames * 1000) / (endTime - this._beginTime),
      frames: this._frames
    }
  }.bind(this)

  this._loop = function _loop () {
    this._frames++
    this._animationFrameId = requestAnimationFrame(this._loop)
  }.bind(this)
}

/** Runs an async test and measures its framerate until a confidence interface is achieved */
function TestRunner (testCase, minSampleSize) {
  minSampleSize = minSampleSize || 5

  const framerateMeasurer = new FramerateMeasurer()

  this.start  = function start () {
    this._framerates = []
    this.isRunning = true

    this._runTest()
  }.bind(this)

  this.stop  = function stop () {
    this.isRunning = false

    console.log(`${this._framerates.length} framerate measurements taken, mean is: ${Statistics.calculateMean(this._framerates)}`)
  }.bind(this)

  this._getTestConfidence  = function _getTestConfidence () {
    if (this._framerates.length >= minSampleSize) {
      const indices = this._framerates.map(
        function (framerate, index) {
          return index
        }
      )

      const regressionSlope = Statistics.calculateRegressionSlope(
        indices,
        Statistics.calculateMean(indices),
        this._framerates,
        Statistics.calculateMean(this._framerates)
      )

       return regressionSlope >= 0
    } else {
      return false
    }
  }.bind(this)

  this._runTest  = function _runTest () {
    framerateMeasurer.start()

    testCase(this._onTestComplete)
  }.bind(this)

  this._onTestComplete  = function _onTestComplete () {
    if (!this.isRunning) {
      return
    }

    const measurements = framerateMeasurer.stop()

    console.log(`${measurements.frames} frames, framerate: ${measurements.framerate}`)

    this._framerates.push(measurements.framerate)

    const isConfident = this._getTestConfidence(this._framerates, minSampleSize)

    if (isConfident) {
      this.stop()
    } else {
      this._runTest()
    }
  }.bind(this)
}

// Adapted from https://github.com/angular/angular/modules/benchpress/src/statistic.ts
const Statistics = {
  calculateMean: function (samples) {
    const total = samples.reduce(
      function (total, x) {
        total += x
        return total
      }, 0)

    return total / samples.length
  },

  // See http://en.wikipedia.org/wiki/Simple_linear_regression
  calculateRegressionSlope: function (xValues, xMean, yValues, yMean) {
    var dividendSum = 0
    var divisorSum = 0
    for (var i = 0; i < xValues.length; i++) {
      dividendSum += (xValues[i] - xMean) * (yValues[i] - yMean)
      divisorSum += Math.pow(xValues[i] - xMean, 2)
    }
    return dividendSum / divisorSum
  }
}
