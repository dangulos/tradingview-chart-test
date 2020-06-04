const config = require("./config");

function buildCandle(type, data) {
    if (type === "daily")
        return new config.DailyCandle(getCandleObject(
            new Date(data.year, data.month - 1, data.day), data
        ));
    else if (type === "minute")
        return new config.MinuteCandle(getCandleObject(
            new Date(data.year, data.month - 1, data.day, data.hour, data.minute, data.second, 0), data
        ));
}

function buildConstraints(constraints) {
    return { date: {
        $gte: new Date(constraints.li.year, constraints.li.month - 1, constraints.li.day, constraints.li.hour, constraints.li.minute, constraints.li.second, 0),
        $lte: new Date(constraints.lo.year, constraints.lo.month - 1, constraints.lo.day, constraints.lo.hour, constraints.lo.minute, constraints.lo.second, 0)
    }, symbol: constraints.symbol };
}

function deleteCandles(candle, limits, callback) {
    candle.deleteMany(limits, (err, result) => {
        callback(err, result);
    });
}

function deleteTicks(limits, callback) {
    config.Tick.deleteMany(limits, (err, result) => {
        callback(err, result);
    });
}

function getCandleObject(date, data) {
    return {
        symbol: data.symbol,
        date: date,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close
    };
}

function findCandles(candle, limits, callback) {
    candle.find(limits, (err, candles) => {
        callback(err, candles);
    });
}

function findTicks(limits, callback) {
    config.Tick.find(limits, (err, candles) => {
        callback(err, candles);
    });
}

function saveCandle(candle, callback) {
    candle.save(function(err, result) {
        callback(err, result);
    });
}

function createTick(data, callback) {
    let tick = new config.Tick({
        symbol: data.symbol,
        date: new Date(data.year, data.month - 1, data.day, data.hour, data.minute, data.second, 0),
        bid: data.bid,
        ask: data.ask
    });
    tick.save(function(err, result) {
        callback(err, result);
    });
}

module.exports = {
    deleteDailyCandles: function(limits, callback) {
        deleteCandles(config.DailyCandle, buildConstraints(limits), callback);
    }, deleteMinuteCandles: function(limits, callback) {
        deleteCandles(config.MinuteCandle, buildConstraints(limits), callback);
    }, deleteTicks: function(limits, callback) {
        deleteTicks(buildConstraints(limits), callback);
    }, findDailyCandles: function(limits, callback) {
        findCandles(config.DailyCandle, buildConstraints(limits), callback);
    }, findMinuteCandles: function(limits, callback) {
        findCandles(config.MinuteCandle, buildConstraints(limits), callback);
    }, findTicks: function(limits, callback) {
        findTicks(buildConstraints(limits), callback);
    }, saveDailyCandle: function(data, callback) {
        saveCandle(buildCandle("daily", data), callback);
    }, saveMinuteCandle: function(data, callback) {
        saveCandle(buildCandle("minute", data), callback);
    }, saveTick: function(data, callback) {
        createTick(data, callback);
    }
};