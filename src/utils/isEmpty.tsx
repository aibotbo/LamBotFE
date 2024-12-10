export default function _isEmpty(data: any) {
  return (
    data == null ||
    data == '' ||
    data == 0 ||
    (Array.isArray(data) && data.length === 0) ||
    (Object.keys(data).length === 0 && data.constructor === Object)
  );
}
