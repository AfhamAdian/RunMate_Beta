const pool = require('../db/db');


async function addTrackToApprovalList ( trackUser, trackDistance, trackDuration, trackSourceData){
    try{
        const trackSourceDataString = JSON.stringify(trackSourceData);
        // console.log(trackSourceDataString);

        const query = 
            `INSERT INTO approval_list (
            approval_id,
            user_id,
            approval_track_name,
            approval_track_data,
            approval_track_duration,
            approval_track_distance,
            approval_request_time,
            approval_status
            ) VALUES (
                COALESCE((SELECT MAX(approval_id) FROM approval_list), 0) + 1,
                ${ trackUser },
                'Track Name Example',
                '${ trackSourceDataString }'::jsonb,
                ${ trackDuration },
                ${ trackDistance },
                CURRENT_TIMESTAMP,
                'Pending'
            );`

    
        const values = [];
        console.log(query);

        var result = null;
        result = await pool.query(query, values);

        if( result != null ){
            return true;
        }else{
            return false;
        }

    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {
    addTrackToApprovalList
}