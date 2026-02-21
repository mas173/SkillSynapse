function parseDailyTime(timeString) {
  if (timeString.includes("hr")) {
    const hours = parseInt(timeString);
    return hours * 60;
  }
  return parseInt(timeString);
}

export default parseDailyTime;