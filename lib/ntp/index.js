var xhr = require('xhr');

exports.offset = getOffset;
exports.server = getServerTime;

function getOffset(url, fn) {
  ntpRequest(url, function (err, times) {
    if(err) return fn(err);

    var roundTrip = times.back - times.start
      , oneWay = Math.round(roundTrip / 2)
      , estimatedClientTimeAtServer = times.start + oneWay
      , offset = times.server - estimatedClientTimeAtServer;

    fn(null, offset);
  });
}

function getServerTime(url, fn) {
  ntpRequest(url, function (err, times) {
    if(err) return fn(err);

    fn(null, times.server);
  });
}

function ntpRequest(url, callback) {
  var startTime = new Date().getTime();

  xhr({
    url: url,
    headers: {
      'X-NTP': 'true'
    }
  }, function (body) {
    if(body.response && parseInt(body.response, 10) > 0) {
      var backTime = new Date().getTime()
        , serverTime = parseInt(body.response, 10);

      return callback(null, {
        start: startTime,
        back: backTime,
        server: serverTime
      });
    }
    callback(new Error("invalid offset"));
  }, function (err) {
    fn(err);
  });
}