export function timeDiffCalc(dateFuture: Date, dateNow: Date) {
  // if NaN return empty string
  if (isNaN(dateFuture.getTime()) || isNaN(dateNow.getTime())) {
    return "00:00:01";
  }
  let diffInMilliSeconds =
    Math.abs(dateFuture.getTime() - dateNow.getTime()) / 1000;

  //   calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  // calculate secons
  const seconds = Math.floor(diffInMilliSeconds % 60);

  return `${getDays(days)}${getZeroFilledTime(hours)}:${getZeroFilledTime(
    minutes
  )}:${getZeroFilledTime(seconds)}`;
}

export function getZeroFilledTime(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function getDays(days: number) {
  if (days === 0) {
    return "";
  }
  return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}⠀`;
}

export function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

export function getTimeFromDate(date: Date) {
  return `${getZeroFilledTime(date.getHours())}:${getZeroFilledTime(
    date.getMinutes()
  )}`;
}
