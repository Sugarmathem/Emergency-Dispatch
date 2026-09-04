const pad = (n: number) => String(n).padStart(2, "0");

export const format = {
  /** "21:14:07" */
  utcHMS(d: Date): string {
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  },
  /** "SEP 04 2026" */
  zuluDate(d: Date): string {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${months[d.getUTCMonth()]} ${pad(d.getUTCDate())} ${d.getUTCFullYear()}`;
  },
};
