export default function secondsToHms(d: number) {
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? `${h < 10 ? `0${h.toString()}` : h}:` : '';
  const mDisplay = `${m < 10 ? `0${m.toString()}` : m}:`;
  const sDisplay = `${s < 10 ? `0${s.toString()}` : s}`;
  return `${hDisplay}${mDisplay}${sDisplay}`;
}
