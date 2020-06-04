const config = require('./config');
const query = require('./query');

module.exports = {
    process: function(socket, message, callback) {
        if (message.report === "PREPARE_DATA_LOADING") {
            prepareLoading(socket, message.content);
            startLoading(socket.loading, message.id, callback);
        } else if (message.report === "CANDLE") {
            saveCandle(socket.loading, message.id, message.content, callback);
        } else if (message.report === "TICK") {
            saveTick(socket.loading, message.id, message.content, callback);
        } else
            callback({ type: 'EMPTY', id: message.id, content: {}, err: {} });
    }
};

function prepareLoading(socket, content) {
    if (content.type === "CANDLE_D1") {
        socket.loading = {
            symbol: content.symbol,
            limits: {
                li: toDateTimeData(content.start_date, content.start_time),
                lo: toDateTimeData(30201231, 125959)
            }, delete: query.deleteDailyCandles,
            find: query.findDailyCandles,
            save: query.saveDailyCandle
        };
    } else if (content.type === "TICK") {
        socket.loading = {
            symbol: content.symbol,
            limits: {
                li: toDateTimeData(content.start_date, content.start_time),
                lo: toDateTimeData(30201231, 125959)
            }, delete: query.deleteTicks,
            find: query.findTicks,
            save: query.saveTick
        };
    }
}

function toDateTimeData(date, time) {
    return {
        year: Math.floor(date / 10000),
        month: Math.floor(date / 100) % 100,
        day: date % 100,
        hour: Math.floor(time / 10000),
        minute: Math.floor(time / 100) % 100,
        second: time % 100
    };
}

function startLoading(loading, messageId, callback) {
    loading.delete({
        symbol: loading.symbol,
        li: loading.limits.li,
        lo: loading.limits.lo
    }, (err, result) => {
        if (err)
            callback({ type: 'ERROR', id: messageId, content: result, err: err });
        else
            callback({ type: 'EMPTY', id: messageId, content: result, err: {} });
    });
}

function saveCandle(loading, messageId, content, callback) {
    let data = toDateTimeData(content.date, content.time);
    loading.save({
        symbol: loading.symbol,
        year: data.year,
        month: data.month,
        day: data.day,
        hour: data.hour,
        minute: data.minute,
        second: data.second,
        open: content.open,
        high: content.high,
        low: content.low,
        close: content.close
    }, (err, result) => {
        if (err)
            callback({ type: 'ERROR', id: messageId, content: result, err: err });
        else
            callback({ type: 'EMPTY', id: messageId, content: result, err: {} });
    });
}

function saveTick(loading, messageId, content, callback) {
    let data = toDateTimeData(content.date, content.time);
    loading.save({
        symbol: loading.symbol,
        year: data.year,
        month: data.month,
        day: data.day,
        hour: data.hour,
        minute: data.minute,
        second: data.second,
        bid: content.bid,
        ask: content.ask
    }, (err, result) => {
        if (err)
            callback({ type: 'ERROR', id: messageId, content: result, err: err });
        else
            callback({ type: 'EMPTY', id: messageId, content: result, err: {} });
    });
}