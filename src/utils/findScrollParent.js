function parents(node, ps) {
  if (node.parentNode === null) {
    return ps;
  }

  return parents(node.parentNode, ps.concat([node]));
}

function style(node, prop) {
  return getComputedStyle(node, null).getPropertyValue(prop);
}

function overflow(node) {
  return style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x');
}

function scroll(node) {
  return (/(auto|scroll)/).test(overflow(node));
}

export default function findScrollParent(node) {
  if (!(node instanceof HTMLElement)) {
    return null;
  }

  const ps = parents(node.parentNode, []);
  const sp = ps.find((parentNode) => (scroll(parentNode) ? parentNode : false));

  return sp || window;
}
