const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {addTrackToApprovalList, getTracks, addUserRecords} = require('../api/trackApi.js');
const {getUserIdFromJwt} = require('../utils/getUserIdFromJwt.js');

router
    .route('/addTrack')
    .post( async (req, res) => {

        try{
            const trackSourceData = req.body.trackGeojson;
            const routeDistance = req.body.routeDistance;
            const routeDuration = req.body.routeDuration;
    
            const user_id = await getUserIdFromJwt( req );
            if( user_id == null ){
                res.status(403).json({ message: 'User not logged in' });
                return;
            }

            const result = await addTrackToApprovalList(user_id, routeDistance, routeDuration, trackSourceData);
            console.log('result' + result);
            
            if( result == true ){
                res.status(200).json({ message: 'Track Added to Approval List' });
            } else{
                res.status(403).json({ message: 'Error occurred, couldnt add track to approval list' });
            }
        }catch(err){
            console.log(err);
            res.status(400);
        }

    })  

router 
    .route('/getTracks')
    .get( async (req, res) => {
        try{
            const trackSourceDataArray = await getTracks();

            res.status(200).json(trackSourceDataArray);
        }catch(err){
            console.log(err);
            res.status(400);
        }
    })

router
    .route('/endRun')
    .post( async (req,res) => {
        try{
            const user_id = await getUserIdFromJwt( req );
            if( user_id == null ){
                res.status(403).json({ message: 'User not logged in' });
                return;
            }
            
            // console.log( req.body.runData );

            const pathCoordinates = req.body.runData.pathCoordinates;
            const distance = req.body.runData.distanceCovered;
            const duration = req.body.runData.timeElapsed;

            console.log( 'in route endrun ');
            // console.log( pathCoordinates );
            console.log( distance );

            const jsonObject 
            = {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': pathCoordinates
                    }
                }
            }

            const result = await addUserRecords(user_id, distance, duration, jsonObject);
            if( result == true ){
                res.status(200).json({ message: 'Run data added to user records' });
            } else{
                res.status(403).json({ message: 'Error occurred, couldnt add run data to user records' });
            }
        }catch(err){
            console.log(err);
            res.status(400).json({ message: 'Error occurred, couldnt add run data to user records' });
        }
    })

module.exports = router;