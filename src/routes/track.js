const router = require('express').Router();
const {addTrackToApprovalList} = require('../api/trackApi.js');

router
    .route('/addTrack')
    .post( async (req, res) => {

        try{
            const trackSourceData = req.body.trackGeojson;
            const routeDistance = req.body.routeDistance;
            const routeDuration = req.body.routeDuration;
        
            console.log(trackSourceData);
            console.log(routeDistance);
            console.log(routeDuration);
        
            const result = await addTrackToApprovalList(1, routeDistance, routeDuration, trackSourceData);
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