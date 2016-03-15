const id = 'typekit';

if (!document.getElementById(id)) {
  const script = document.getElementsByTagName('script')[0];
  const js = document.createElement('script');

  js.id = id;
  js.src = 'https://use.typekit.net/ejq6aeo.js';
  js.addEventListener('load', function() {
    try {
      Typekit.load({ async: true });
    } catch (err) {
      console.log(err);
    }
  }, false);

  script.parentNode.insertBefore(js, script);
}
