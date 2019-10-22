export const switchCase = cases => defaultCase => key =>
  cases.hasOwnProperty(key) ? cases[key] : defaultCase;
