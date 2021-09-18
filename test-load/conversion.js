exports.convertIDToInt = (requestParams, context, ee, next) => {
    //console.log("requestParams.json", requestParams.json)
    //console.log("context.vars", context.vars)
    requestParams.json.start_lat = parseInt(context.vars.start_lat)
    requestParams.json.start_long = parseInt(context.vars.start_long)
    requestParams.json.end_lat = parseInt(context.vars.end_lat)
    requestParams.json.end_long = parseInt(context.vars.end_long)
    return next()
}
