export function router(req, res) {
    switch (res.url) {
        case '/test':
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHeader(200, {
                'Content-Type': 'text/txt'
            });
            res.write('test');
            res.end();
            break;
        case '/test/data':
            
            break;
    
        default:
            break;
    }
}