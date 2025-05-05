export function router(req, res) {
    if (req.url === '/cookieset') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Set-Cookie', ['sessionToken=bingbong']);
        res.writeHeader(200, {
            'Content-Type': 'text/txt'
        });
        res.write('cookieset');
        res.end();
    }

    if (req.url === '/cookie') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHeader(200, {
            'Content-Type': 'text/txt'
        });
        res.write(req.headers?.cookie);
        res.end();
    }
}