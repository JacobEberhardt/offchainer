function parseHrtimeToMilliseconds(hrtime) {
    var seconds = (hrtime[0] + (hrtime[1] / 1e6)).toFixed(3)
    return seconds
}
module.exports = parseHrtimeToMilliseconds
