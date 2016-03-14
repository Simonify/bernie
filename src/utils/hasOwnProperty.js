const _hasOwnProperty = {}.hasOwnProperty;

export default function hasOwnProperty(obj, prop) {
  return _hasOwnProperty.call(obj, prop);
}
