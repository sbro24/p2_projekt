export function router(req, res) {
    if (req.url === '/test') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHeader(200, {
            'Content-Type': 'text/txt'
        });
        res.write('test');
        res.end();
    }
}