import { DataResponse } from "../../app/router.js";


export function router(req, res) {
    switch (req.url) {
        case '/test':
            console.log('test');
            DataResponse(res, data);
            break;
        case '/test/data':
            
            break;
    
        default:
            break;
    }
}

const data = 'AAAAAAAAAAAAAAA'