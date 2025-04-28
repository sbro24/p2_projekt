/**Converts an error to a string.
 * @param { Error } err 
 * @returns {string} - Returns the error message as a string.
 */
export function ErrorToString(err) {
    if (err instanceof Error) {
        let cause = '';
        if (err.cause !== undefined) cause = `\n  [cause]: '${err.cause}'`;
        //slice(7) removes the first 7 characters of the stack trace: "Error: "
        return err.stack.slice(7) + cause;
    }
}