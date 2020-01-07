const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const apiExceptionsMod = require('./apiExceptions/api-exception');
const notFoundApiExceptionMod = require('./apiExceptions/not-found-apiException');
const badRequestMod = require('./apiExceptions/badRequest-exception');
const serverErrorAPIExceptionMod = require('./apiExceptions/serverError-apiException');

const monitoringServiceMod = require('./monitoringService');
const monitoringExceptionMod = require('./monitoringServiceUnqfyException');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/', router);
app.use(errorHandler);

let monitoringService = new monitoringServiceMod.MonitoringService();

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof apiExceptionsMod.ApiException) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    } else if (err.type === 'entity.parse.failed') {
        res.status(err.status);
        res.json({ status: err.status, errorCode: 'BAD_REQUEST' });
    } else {
        next(err);
    }
}

/** Enable or disable log service on Slack */
router.route('/logService').post((req, res, next) => {
    try {
        const state = JSON.parse(req.body.state);
        if (state && (state === true || state === false)) {
            monitoringService.setStateLog(state);
            res.status(200);
            res.json({ message: "Succesfull" });
        } else {
            next(new badRequestMod.BadRequestException);
        }
    } catch (err) {
        next(err);
    }
});

/** Get UNQfy server state */
router.route('/unqfyServer').post((req, res, next) => {
    try{
        monitoringService.unqfyServerIsAlive()
        .then((state)=>{res.status(200);res.json({state:state});}); 
        }
    catch(err){
        next(err);
    } 
})

/** Get UNQfy Notifications server state */
router.route('/notificationServer').post((req, res, next) => {
    try{
        monitoringService.notificationServerIsAlive()
        .then((state)=>{res.status(200);res.json({state:state});}); 
        }
    catch(err){
        next(err);
    }   
})

/** Notify activity on UNQfy */
router.route('/activity').post((req, res, next) => {
    try {
        let message = req.body.message;
        if (message) {
            //este metodo no retorna nada lanza una excepcion si no logra mandar el log
            monitoringService.logActivity(message);
            res.status(200);
            res.json({});
        }
        else {
            next(new badRequestMod.BadRequestException);
        }
    } catch (err) {
        next(modelErrorToApiError(err));
    }
})

// Catching all invalid routes
router.get('/');
router.route(/^/).all((req, res, next) => {
    next(new notFoundApiExceptionMod.NotFoundRes);
})

function modelErrorToApiError(error) {
    // al momento no hay más errores que mapear
    if( error instanceof monitoringExceptionMod.MonitoringServiceUnqfyException )
        return new serverErrorAPIExceptionMod.ServerError()
}

let port = process.env.PORT || 5002;
app.listen(port);
console.log('Magic happens on port ' + port);