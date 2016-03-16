export default async function getConfig() {
  return {
    cookies: {
      domain: process.env.COOKIE_DOMAIN
    },
    client: {
      url: process.env.CLIENT_URL,
      domain: process.env.CLIENT_DOMAIN,
      title: process.env.CLIENT_TITLE,
      serverEndpoint: process.env.CLIENT_SERVER_ENDPOINT,
      staticHost: process.env.STATIC_HOST
    },
    server: {
      endpoint: process.env.SERVER_ENDPOINT,
      session: {
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
      },
      cors: {
        origins: [process.env.CORS_ORIGINS],
        methods: ['*'],
        headers: ['content-type'],
        credentials: true
      }
    }
  };
}
