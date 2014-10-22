/**
 * fromNow.js v1.0.0
 * http://www.lukeed.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, LUKEED
 * http://www.lukeed.com
 */
function fromNow(date, maxChunks, useAgo, useAnd, vLabel) {
  // set default values if left undefined
  maxChunks = typeof maxChunks !== 'undefined' ? maxChunks : 10;
  useAgo = typeof useAgo !== 'undefined' ? useAgo : false;
  useAnd = typeof useAnd !== 'undefined' ? useAnd : false;
  var confLabel = typeof vLabel === 'object' ? vLabel : {
	  'year':['year', 'years'],
	  'month':['month', 'months'],
	  'day':['day', 'days'],
	  'hour':['hour', 'hours'],
	  'minute':['minute', 'minutes'], 
	  'past': ['ago']
  };
  var fnLabel = typeof vLabel === 'function' ? vLabel : labelFromConf;
  
  /**
   * Default label function from configuration object (passed or default one for English) 
   * @param name name of label, eg: year,month,day,minute,second and 'past'
   * @param size zero or positive to print the size, negative for no-size labels, eg: 'past'
   */
  function labelFromConf(name, size) {
	  return (size > 0 ? size : "") + " " + confLabel[name][size > 1 ? 1 : 0];
  }
  
  var milli = (new Date(date) - new Date()),
      ms = Math.abs(milli);

  var isPast = (useAgo && milli < 0) ? fnLabel('past',-1) : "";

  var msMinute = 60 * 1000,
      msHour = msMinute * 60,
      msDay = msHour * 24,
      msMonth = msDay * 30,
      msYear = msDay * 365;

  var years = Math.floor(ms / msYear),
      months = Math.floor((ms % msYear) / msMonth),
      days = Math.floor((ms % msMonth) / msDay),
      hours = Math.floor((ms % msDay) / msHour),
      minutes = Math.floor((ms % msHour) / msMinute);

  var bundle = [
      years ? fnLabel('year', years) : null,
      months ? fnLabel('month', months) : null,
      days ? fnLabel('day', days) : null,
      hours ? fnLabel('hour', hours) : null,
      minutes ? fnLabel('minute', minutes) : null
  ];


  var compiled = [], limit = 0;
  bundle.forEach(function(segment, index) {
    // Limit the returned array to return 'maxChunks' of not-null segments
    if (segment != null && (limit < maxChunks)) {
      limit++;
      compiled.push(segment);
    }
  });

  var length = compiled.length;
  compiled = compiled.join(', ') + isPast;

  if (useAnd && length > 1) {
    var split = compiled.split(', ');
    if (length == 2) {
      return split.join(' and ');
    } else {
      split[length - 1] = 'and ' + split[length - 1];
      return split.join(', ');
    }
  } else {
    return compiled;
  }
}
