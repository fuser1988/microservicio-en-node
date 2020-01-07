let express    = require('express');        
let app        = express();                 
let bodyParser = require('body-parser');
let notificationServiceUnqfyMod = require('./notificationServiceUnqfy');
let notificationServiceUnqfyExceptionsMod = require('./notificationServiceUnqfyExceptions');

let apiExceptionsMod = require('./apiExceptions/api-exception');
let badRequestExceptionMod = require('./apiExceptions/badRequest-exception');
let notFoundAPIExceptionMod = require('./apiExceptions/not-found-apiException');
let notFoundRelatedAPIExceptionMod = require('./apiExceptions/not-found-related-res-apiExeption');
let serverErrorAPIExceptionMod = require('./apiExceptions/serverError-apiException');

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof apiExceptionsMod.ApiException ) {
        res.status(err.status);
        res.json({ status: err.status, errorCode: err.errorCode });
    } else if (err.type === 'entity.parse.failed') {
        // body-parser error para JSON invalido
        res.status(err.status);
        res.json({ status: err.status, errorCode: 'BAD_REQUEST' });
    } else {
        // continua con el manejador de errores por defecto
        next(err);
    }
}


let notificationService = new notificationServiceUnqfyMod.NotificationServiceUnquify();
let router = express.Router(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/', router);
app.use(errorHandler);

let port = process.env.PORT || 5001;


router.route('/subscribe').post( (req, res, next) => {
    try {
        if ( req.body.artistId && req.body.email && req.body.email.includes('@') ){
            notificationService.subscribeEmailToArtist(req.body.email, parseInt(req.body.artistId))
            .then(() => {
                res.status(200); res.json({});
            })
            .catch(err => { next(modelErrorToApiError(err)) });
        } else {
            next( new badRequestExceptionMod.BadRequestException() )
        }
    }catch(error){ 
        next( modelErrorToApiError(error) )
    }
});


router.route('/unsubscribe').post( (req, res, next) => {
    try {
        if ( req.body.artistId && req.body.email ){
            notificationService.unSubscribeEmailToArtist(req.body.email, parseInt(req.body.artistId))
            .then(() => {
                res.status(200); res.json({});
            })
            .catch(err => { next(modelErrorToApiError(err)) });
        }else{
           next( new badRequestExceptionMod.BadRequestException )
        }
    }catch(error){ 
        next( modelErrorToApiError(error) )
    }
});


router.route('/notify').post( (req, res, next) => {
    try {
        if ( req.body.artistId && req.body.message && req.body.subject ){
            notificationService.notifyNewAlbum(parseInt(req.body.artistId), req.body);
            res.status(200);
            res.json({});
        }else{
            next( new badRequestExceptionMod.BadRequestException )
        }
    } catch(error) {
        next(modelErrorToApiError(error))
    }
});

router.route('/subscriptions').get((req, res, next) => {
    try {
        const artistId = req.query.artistId;
        if (artistId) {
            notificationService.getAllSubscriptors(parseInt(artistId))
                .then(subscriptors => {
                    res.status(200);
                    res.json({ "idArtist": artistId, "subscriptors": subscriptors });
                })
                .catch(err => { next(modelErrorToApiError(err)) });
        } else {
            next(new badRequestExceptionMod.BadRequestException)
        }
    } catch (error) {
        next(modelErrorToApiError(error))
    }
});

router.route('/subscriptions').delete( (req, res, next) => {
    try {
        if ( req.body.artistId ){
            notificationService.deleteAllSubscriptorToArtist(parseInt(req.body.artistId))
                .then(() => {
                    res.status(200);
                    res.json({});
                }).catch(err => { next(modelErrorToApiError(err)) });
        }else{
            next( new badRequestExceptionMod.BadRequestException )
        }
    }catch(error){ 
        next( modelErrorToApiError(error) )
    }
});

/** echo response */
router.route('/ping').get((req, res, next) => {
    res.json({});
})

// Catching all invalid routes
router.get('/'); 
router.route(/^/).all((req,res,next) => {
    next(new notFoundAPIExceptionMod.NotFoundRes());
})

function modelErrorToApiError(error) {
    if (error instanceof notificationServiceUnqfyExceptionsMod.NotificationServiceUnqfyException) {
        return new notFoundRelatedAPIExceptionMod.NotFoundRelRes();
    } else {
        return new serverErrorAPIExceptionMod.ServerError();
    }
}


app.listen(port);   
console.log('Magic happens on port ' + port);