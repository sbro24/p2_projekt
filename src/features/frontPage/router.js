export function router(req, res) {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/txt');
        res.write('Frontpage');
        res.end("\n");
    }
}