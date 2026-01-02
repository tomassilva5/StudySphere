const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 5000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const apiProxy = createProxyMiddleware({
  target: 'http://backend:3000',
  changeOrigin: true,
  cookieDomainRewrite: '',
  cookiePathRewrite: '/',
  preserveHeaderKeyCase: true,
  autoRewrite: true,
  onProxyReq: (proxyReq, req, res) => {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      proxyReq.setHeader('Cookie', cookieHeader);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    const setCookies = proxyRes.headers['set-cookie'];
    if (setCookies) {
      const modifiedCookies = setCookies.map(cookie => {
        let modified = cookie;
        if (modified.toLowerCase().includes('samesite=none')) {
          modified = modified.replace(/SameSite=None/gi, 'SameSite=Lax');
        }
        if (modified.includes('Secure;') || modified.includes('Secure ')) {
          modified = modified.replace(/;\s*Secure/gi, '');
        }
        modified = modified.replace(/Domain=[^;]+;?\s*/gi, '');
        return modified;
      });
      proxyRes.headers['set-cookie'] = modifiedCookies;
    }
  },
});

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      if (pathname.startsWith('/api/v1/')) {
        apiProxy(req, res);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      process.stdout.write(`> Ready on http://${hostname}:${port}\n`);
    });
});
