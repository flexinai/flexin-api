export function millisecondsToHHMMSSFF(millis: number) {
  const seconds = Math.floor((millis / 1000) % 60);
  const minutes = Math.floor((millis / (1000 * 60)) % 60);
  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);

  const printHours = hours < 10 ? '0' + hours : hours;
  const printMinutes = minutes < 10 ? '0' + minutes : minutes;
  const printSeconds = seconds < 10 ? '0' + seconds : seconds;

  return `${printHours}:${printMinutes}:${printSeconds}:00`;
}
