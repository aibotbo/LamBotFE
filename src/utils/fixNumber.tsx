const OPTIONS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  style: 'decimal',
};

export default function fixNumber(value: number | string) {
  return value.toLocaleString('en-US', OPTIONS);
}
