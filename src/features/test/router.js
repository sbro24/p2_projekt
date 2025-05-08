import { DataResponse } from "../../app/router.js";


export function router(req, res) {
    switch (req.url) {
        case '/test':
            DataResponse
            break;
        case '/test/data':
            
            break;
    
        default:
            break;
    }
}

const data = {
    name: 'test',
    data: {
        test: 'test'
    }
}