export default function isChildOf(parent, child, matchParent) {
  if (matchParent !== false && parent === child) {
    return true;
  }

  if (typeof parent.contains === 'function') {
    return parent.contains(child);
  }

  let node;

  while ((node = child.parentNode)) {
    if (parent === node) {
      return true;
    }
  }

  return false;
}
