export default function secondsToHms(d: number, onlyHours = false) {
  if (!d) return '00:00';
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? `${h < 10 ? `0${h.toString()}` : h}:` : '';
  const mDisplay = `${m < 10 ? `0${m.toString()}` : m}:`;
  const sDisplay = `${s < 10 ? `0${s.toString()}` : s}`;
  const hours = h > 0 ? `${h < 10 ? `0${h.toString()}` : h}` : '';
  return onlyHours ? hours : `${hDisplay}${mDisplay}${sDisplay}`;
}
