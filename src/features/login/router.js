import { runLogin, runRegister } from "./login";

export function router(req, res, data) {
    switch (req.url) {
        case '/login/login':
            
            break;
        
        case '/login/register':
            const Register = runRegister();
            switch (Register.response) {
                case 'responsed':
                    
                    break;
                case 'vaildationError':
                    
                    break;
            
                default:
                    
                    break;
            }
        
        default:
            break;
    }
}