const mongoose = require('mongoose'),
    format = require('util').format,
    fs = require('fs');

var ca = fs.readFileSync("./keys/rds-combined-ca-bundle.pem");

console.log("> certificate: ", ca);

mongoose.connect(
    'mongodb://localhost:27017/market',
    //'mongodb://administrator:SaCS06060710c@itrm-simulator-database.cluster-cwixugx8dqo4.us-east-1.docdb.amazonaws.com:27017/?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
{
    //sslValidate: true,
    //sslCA: [ ca ],
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/*var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("open"); });*/

var candleSchema = new mongoose.Schema({
    symbol: String,
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number
});

var tickSchema = new mongoose.Schema({
    symbol: String,
    date: Date,
    bid: Number,
    ask: Number
});

module.exports = {
    Tick: mongoose.model('Tick', tickSchema),
    DailyCandle: mongoose.model('DailyCandle', candleSchema),
    MinuteCandle: mongoose.model('MinuteCandle', candleSchema),
    FiveMinutesCandle: mongoose.model('FiveMinuteCandle', candleSchema),
    TenMinutesCandle: mongoose.model('TenMinutesCandle', candleSchema),
    FifteenMinutesCandle: mongoose.model('FifteenMinuteCandle', candleSchema),
    ThirtyMinutesCandle: mongoose.model('ThirtyMinutesCandle', candleSchema),
    HourlyCandle: mongoose.model('HourlyCandle', candleSchema)
};