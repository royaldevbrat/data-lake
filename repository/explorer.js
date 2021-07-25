const async = require('async');
const getSum = (accumulator, data) => {
    accumulator = accumulator + data.amount
    return accumulator
}
// Get Costs API Results
function getClientsCostDetails(req, res, next) {
    getClientsDetails(req, function (err, results) {
        if (err) throw err;
        res.status(200).json(results)
    });
}

module.exports.getClientsCostDetails = getClientsCostDetails;

// Get Clients
function getClientsDetails(req, callback) {
    let query = `SELECT *, "client" AS type, 0 AS amount FROM clients`;
    if (req.query.client_id) { /* istanbul ignore next */
        query = `SELECT *, "client" AS type, 0 AS amount FROM clients WHERE id IN (${req.query.client_id})`
    }
    req.db.query(query, async function (err, results) {
        if (err) throw err;
        getProjectDetails(results, req, callback);
    }
    );
}

// Get All Projects
function getProjectDetails(clientData, req, callback) {
    const responseData = {
        ...(Object.keys(req.query).length !== 0 && { "query": req.query_url }),
        "data": []
    };
    async.eachSeries(clientData, function (data, cb) {
        let query = `SELECT id, title as name, "project" AS type, 0 AS amount FROM projects WHERE client_id = ${data.id}`;
        if (req.query.project_id) {
            query = `SELECT  id, title as name, "project" AS type, 0 AS amount FROM projects WHERE id IN (${req.query.project_id}) AND client_id = ${data.id}`
        }
        req.db.query(query, function (err, results) {
            if (err) throw err;
            if (results.length) {
                data.children = results;
                responseData.data.push(data)
            }
            cb()
        }
        );
    }, function (err, result) {
        if (err) throw err;
        getCostsDetails(responseData, req, callback)
    });
}

// Fetch Costs All Details
function getCostsDetails(clientAndProjectData, req, callback) {
    async.eachSeries(clientAndProjectData.data, function (clientData, cb) {
        async.eachSeries(clientData.children, function (projectData, cb2) {
            let query = `SELECT costs.id, cost_type_id, project_id, costs.amount, cost_types.name, cost_types.parent_id, "cost" AS type from costs
                            LEFT JOIN cost_types ON costs.cost_type_id = cost_types.id
                            WHERE costs.project_id = ${projectData.id}`;
            if (req.query.cost_type_id) {
                query = `SELECT costs.id, cost_type_id, project_id, costs.amount, cost_types.name, cost_types.parent_id, "cost" AS type from costs
                LEFT JOIN cost_types ON costs.cost_type_id = cost_types.id
                WHERE  costs.project_id = ${projectData.id} AND (costs.cost_type_id IN (${req.query.cost_type_id}) OR cost_types.parent_id IN (${req.query.cost_type_id}))`;
            }
            req.db.query(query, function (err, results) {
                if (err) throw err;
                const root = results.reduce((min, c) => c.parent_id < min ? c.parent_id : min, results[0].parent_id)
                projectData.children = getCostsTree(results, root);
                projectData.amount = projectData.children.reduce(getSum, 0)
                cb2()
            }
            );
        }, function (err) {
            if (err) throw err;
            clientData.amount = clientData.children.reduce(getSum, 0)
            cb()
        });
    }, function (err) {
        if (err) throw err;
        callback(null, clientAndProjectData)
    });
}

// Generate Cost Tree
function getCostsTree(arr, parent) {
    let out = []
    arr.forEach(data => {
        if (data.parent_id === parent) {
            let children = getCostsTree(arr, data.cost_type_id) || []
            data.children = children
            let newObj = {
                "id": data.id,
                "type": "cost",
                "name": data.name,
                "amount": data.amount,
                "cost_type_id": data.cost_type_id,
                "children": data.children
            }
            out.push(newObj)
        }
    })
    return out
}
