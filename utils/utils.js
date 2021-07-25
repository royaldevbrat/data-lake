
// Format query string to return
const createQueryURL = (req, res, next) => {
    let query_params = req.query;
    if(query_params) {
        for(const key in query_params) {
            if(Array.isArray(query_params[key])) {
                query_params[key] = query_params[key].filter(function (x) {
                    return x != null && x !== ' ' && x!== '';
                });
            }
        }
    }
    req.query_url = req.protocol + '://' + req.get('host') + req.originalUrl;
    next();
}
module.exports = {
    createQueryURL
}
