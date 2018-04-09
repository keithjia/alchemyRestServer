const restify = require('restify');
const loki = require('lokijs');
const errs = require('restify-errors');
const validator = require("./lib/validator");
const uuid = require('uuid/v4');


/**
 * init databse
 */
const db = new loki('Example');

/**
 * Schema:
 * {
 *  username: "username",
 *  password: "password"
 * }
 */
const userCollection = db.addCollection('users', { indices: ['username'] });
/**
 * Schema:
 * {
 *  username: "username",
 *  sessionToken: "session-token"
 * }
 */
const sessionCollection = db.addCollection("sessions", {indices:["username"]});
/**
 * Schema:
 * {
 *  userhash: "username",
 *  filename: "filename",
 *  fileContent: "text content"
 * }
 */
const fileCollection = db.addCollection("files", {indices:["username"]});

/**
 * create http server instance
 * @type {*|Server}
 */
const server = restify.createServer({
  name: 'rest file server',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/echo/:name', function (req, res, next) {
    const u = userCollection.find({username:req.params.name});
    res.send(u);
    return next();
});

/**
 * ROUTES
 */

/**
 *
 */
server.post("/register", (req, res, next) => {
    const user = req.body;
    const result = validator.validateRegisterInputs(user);

    if (result.isValid === false) {
        return next( new errs.BadRequestError(result.errorMessage));
    }

    userCollection.insert(user);
    res.send(204);
    return next();
});

/**
 *
 */
server.post("/login", (req, res, next) => {
    const user = req.body;
    const result = validator.validateRegisterInputs(user);

    if (result.isValid === false) {
        return next( new errs.BadRequestError(result.errorMessage));
    }

    const users = userCollection.find({
        username:user.username,
        password:user.password
    });

    if (users.length === 0){
        return next( new errs.ForbiddenError("Invalid credential"));
    }

    const sessionToken = uuid();
    sessionCollection.insert({
        username: user.username,
        sessionToken: sessionToken
    });

    res.send({token: sessionToken});
    return next();
});

/**
 * find userConext from header session value
 * @param req
 * @returns {*}
 */
function getUserContext(req) {
    const sesstionToken = req.header('X-Session');
    const sessionEntry = sessionCollection.find({sessionToken: sesstionToken});

    return sessionEntry[0];
}


/**
 * PUT filename
 * {
 *  fileContent: "abcdedg"
 * }
 */
server.put("/files/:filename", (req, res, next) => {
    const userContext = getUserContext(req);

    if (!userContext) {
        return next( new errs.ForbiddenError("Invalid credential"));
    }

    console.log("filename: %s", req.params.filename);
    console.log("fileContent: %s", JSON.stringify(req.body));

    const validationRes = validator.validateFileInputs(req.params.filename, req.body);

    if (!validationRes.isValid) {
        return next( new errs.BadRequestError("Bad request for file inputs"));
    }

    const fileContent = req.body.fileContent;

    fileCollection.insert({
        username: userContext.username,
        filename: req.params.filename,
        fileContent: fileContent
    });

    res.send(204);
    return next();
});

/**
 *
 */
server.get("/files/:filename", (req, res, next) => {
    const userContext = getUserContext(req);

    if (!userContext) {
        return next(new errs.ForbiddenError("Invalid credential"));
    }

    const files = fileCollection.find({
        username: userContext.username,
        filename: req.params.filename
    });

    if (files.length === 0) {
        return next(new errs.NotFoundError("File not found"));
    }

    console.log("found %s:", JSON.stringify(files));

    res.send({
        "filename": req.params.filename,
        "fileContent": files[0].fileContent
    });

    return next();
});

/**
 *
 */
server.del("/files/:filename", (req, res, next) => {
    const userContext = getUserContext(req);

    if (!userContext) {
        return next(new errs.ForbiddenError("Invalid credential"));
    }

    const files = fileCollection.find({
        username: userContext.username,
        filename: req.params.filename
    });

    if (files.length === 0) {
        return next(new errs.NotFoundError("File not found"));
    }

    fileCollection.remove(files[0]);

    res.send(204);
    return next();
});

/**
 *
 */
server.get("/files", (req, res, next) => {
    const userContext = getUserContext(req);

    if (!userContext) {
        return next(new errs.ForbiddenError("Invalid credential"));
    }

    const files = fileCollection.find({
        username: userContext.username
    });

    const filenames = [];

    files.forEach( ele => {filenames.push(ele.filename)});
    res.send(filenames);

    return next();
});



server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
