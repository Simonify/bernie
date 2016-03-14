let tracked = false;

export default function trackVisit() {
  if (tracked) {
    return;
  }

  const node = document.createElement('script');

  node.type = 'text/javascript';
  node.async = true;
  node.id = 'gauges-tracker';
  node.setAttribute('data-site-id', '56e692434b2ffa43b7009575');
  node.src = '//secure.gaug.es/track.js';
  node.onload = () => tracked = true;

  document.getElementsByTagName('HEAD')[0].appendChild(node);
}
