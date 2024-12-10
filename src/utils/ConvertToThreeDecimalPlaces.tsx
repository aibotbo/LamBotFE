export default function convertToThreeDecimalPlaces(num: string | number) {
  const numDecimalPlaces = (num.toString().split('.')[1] || '').length;
  if (numDecimalPlaces > 3) {
    return (+num).toFixed(3);
  } else {
    return num;
  }
}
