// Define functions
function parseHrtimeToMilliseconds(hrtime) {
    var seconds = (hrtime[0] + (hrtime[1] / 1e6)).toFixed(0)
    return seconds
}

// Export module
module.exports = parseHrtimeToMilliseconds
