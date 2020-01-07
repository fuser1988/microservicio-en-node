const express = require("express"); 
const router = express.Router();

const notFoundExceptionMod = require('../exceptions/not-found-exception');
const duplicatedExceptionMod = require('../exceptions/duplicated-data-exception');
// api errors
const apiExceptionMod = require('../apiExceptions/api-exception');
const BadRequestExceptionMod = require('../apiExceptions/badRequest-exception');
const duplicatedResExceptionMod = require('../apiExceptions/duplicatedRes-apiException');
const notFoundRelatedExceptionMod = require('../apiExceptions/not-found-related-res-apiExeption');
const notFoundApiExceptionMod = require('../apiExceptions/not-found-apiException');
const ServerErrorApiExceptionMod = require('../apiExceptions/serverError-apiException');


class Rest {
    
    static register(app, aFileToPersist, functionToGetUnqfy) {
        
        function errorHandler(err, req, res, next) {
            console.error(err); // imprimimos el error en consola
            // Chequeamos que tipo de error es y actuamos en consecuencia
            if (err instanceof apiExceptionMod.ApiException){
                res.status(err.status);
                res.json({status: err.status, errorCode: err.errorCode});
            } 
            else 
                if (err.type === 'entity.parse.failed'){
                // body-parser error para JSON invalido
                res.status(err.status);
                res.json({status: err.status, errorCode: 'BAD_REQUEST'});
                } 
                else {
                // continua con el manejador de errores por defecto
                next(err);
                }
        }
        
        this.fileToPersist = aFileToPersist;
        this.unqfy = functionToGetUnqfy(this.fileToPersist);
        app.use('/api', router);
        app.use('/', router);
        app.use(errorHandler);
        router.get('/api');

        /*** ARTISTS ***/
        // Getting an artist by id
        router.route('/artists/:id').get((req, res, next) => {
            let id = req.params.id;
            try {
                if (id) {
                    let artistFound = this.unqfy.getArtistById(parseInt(id));
                    res.status(200);
                    res.send(artistFound.toJson());
                }
                else {
                    next(new BadRequestExceptionMod.BadRequestException);
                }
            }
            catch (error) {
                next(modelErrorToApiError(error));
            }
        });
    
        // Getting artists
        router.route('/artists').get((req, res, next) => {
            try {
                let artistsFound;
                if (req.query.name) {
                    artistsFound = this.unqfy.searchByName(req.query.name).artists;
                } else {
                    artistsFound = this.unqfy.artists;
                }
                res.status(200);
                res.send(artistsFound.map(art => { return art.toJson() }));
            } catch (error) {
                next(modelErrorToApiError(error));
            }
        });
        
        // Adding an artist
        router.route('/artists').post((req, res, next) => {
            try{
                if(req.body.name && req.body.country){
                    let newArtist = this.unqfy.addArtist(req.body);
                    this.saveUnqfy();
                    res.status(201).send(newArtist.toJson());
                }else{
                    next( new BadRequestExceptionMod.BadRequestException );
                }
            }
            catch(error){
                next( modelErrorToApiError(error) );
            }
        });

        // Deleting an artist
        router.route('/artists/:id').delete((req, res, next)=>{
            let id = req.params.id;
            try{
                if(id){
                    this.unqfy.removeArtist(parseInt(id));
                    this.saveUnqfy();
                    res.status(204);
                    res.json({message:'borrado Ok'});    
                }
                else{
                    next( new BadRequestExceptionMod.BadRequestException )
                }
            }
            catch(error){
                next( modelErrorToApiError(error) );
           }
        });

        /*** ALBUMS ***/
        // Getting an album by id
        router.route('/albums/:id').get((req, res, next) => {
            let id = req.params.id;
            try {
                if (parseInt(id)) {
                    let albumFound = this.unqfy.getAlbumById(parseInt(id));
                    res.status(200);
                    res.send(albumFound.toJson());
                }
                else {
                    next(new BadRequestExceptionMod.BadRequestException);
                }
            }
            catch (error) {
                next(modelErrorToApiError(error));
            }
        });

        // Getting albums
        router.route('/albums').get((req, res, next) => {
            try {
                let albumsFound;
                if (req.query.name) {
                    albumsFound = this.unqfy.searchByName(req.query.name).albums;
                } else {
                    albumsFound = this.unqfy.getAllAlbum();
                }
                res.status(200).send(albumsFound.map(alb => { return alb.toJson() }));
            }
            catch (err) {
                next(modelErrorToApiError(err));
            }
        })

        // Adding an album
        router.route('/albums').post((req, res, next) => {
            try {
                if (req.body.name && req.body.year && req.body.artistId) {
                    let newAlbum = this.unqfy.addAlbum(parseInt(req.body.artistId), req.body);
                    this.saveUnqfy();
                    res.status(201)
                    res.send(newAlbum.toJson());
                } else {
                    next(new BadRequestExceptionMod.BadRequestException);
                }
            }
            catch (err) {
                next(modelErrorToApiError(err, new notFoundRelatedExceptionMod.NotFoundRelRes));
            }
        })

        // Deleting an album
        router.route('/albums/:id').delete((req, res, next) => {
            let id = req.params.id;
            try {
                if (parseInt(id)) {
                    this.unqfy.removeAlbum(parseInt(id));
                    this.saveUnqfy();
                    res.status(204);
                    res.json({ message: 'borrado Ok' });
                }
                else {
                    next(new BadRequestExceptionMod.BadRequestException)
                }
            }
            catch (error) {
                next(modelErrorToApiError(error));
            }
        });

        // Search lyrics for **an existing** track
        // En el enunciado aparece query con "trackId" pero en los test aparece "name"
        router.route('/lyrics').get((req, res, next) => {
            try {
                if (req.query.trackId || req.query.name) {
                    let promise;
                    if (req.query.trackId) {
                        promise = this.unqfy.getLyricsByTrackId(parseInt(req.query.trackId));
                    }
                    if (req.query.name) {
                        promise = this.unqfy.getLyricsByTrackName(req.query.name)
                    }
                    promise
                        .then((responseLyrics) => {
                            this.saveUnqfy();
                            return responseLyrics;
                        })
                        .then((lyrics) => res.status(200).send({ lyrics: lyrics }));
                }
                else {
                    next(new BadRequestExceptionMod.BadRequestException);
                }
            }
            catch (error) {
                next(modelErrorToApiError(error));
            }
        })

        /** echo response */
        router.route('/ping').get((req, res, next) => {
            res.status(200); res.json({});
        })

        // Catching all invalid routes
        router.get('/');
        router.route(/^/).all((req,res,next) => {
            next(new notFoundApiExceptionMod.NotFoundRes);
        })

        function modelErrorToApiError(error, errNotFound = new notFoundApiExceptionMod.NotFoundRes) {
            if (error instanceof notFoundExceptionMod.NotFoundException) {
                return errNotFound
            } else {
                if (error instanceof duplicatedExceptionMod.DuplicatedDataException) {
                    return new duplicatedResExceptionMod.DuplicatedRes
                } else {
                    return new ServerErrorApiExceptionMod.ServerError
                }
            }
        }

    }

    static saveUnqfy() {
        this.unqfy.save(this.fileToPersist);
    }
}

module.exports = { Rest, };
