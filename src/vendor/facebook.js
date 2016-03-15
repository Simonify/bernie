const id = 'facebook-jssdk';

if (!document.getElementById(id)) {
  const script = document.getElementsByTagName('script')[0];
  const js = document.createElement('script');

  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=103085323114183';
  js.async = true;
  js.defer = true;

  script.parentNode.insertBefore(js, script);
}
