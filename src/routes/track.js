const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {addTrackToApprovalList} = require('../api/trackApi.js');
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

module.exports = router;