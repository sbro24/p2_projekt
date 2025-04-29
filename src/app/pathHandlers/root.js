export function execute(req, res) {
    if (req.url === '/') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHeader(200, {
            'Content-Type': 'application/json'
        });
        res.write('{"test": 1}');
        res.end();
    }
}