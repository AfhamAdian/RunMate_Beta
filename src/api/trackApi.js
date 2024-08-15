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


async function getTracks(){
    try{
        const query = 
            `SELECT * FROM tracks;`
        const values = [];
        console.log(query);

        var result = null;
        result = await pool.query(query, values);
        // console.log(result);

        if( result != null ){
            return result.rows;
        }else{
            return null;
        }

    }catch(err){
        console.log(err);
        return null;
    }
}


async function addUserRecords ( user_id, record_distance, record_duration, record_track_data)
{
    try{
        const record_track_data_string = JSON.stringify(record_track_data);
        const query = 
            `INSERT INTO records (
                record_id,	
                user_id,
                record_distance,
                record_duration,
                record_track_data,
                record_date
            ) VALUES (
                COALESCE((SELECT MAX(record_id) FROM records), 0) + 1,
                ${ user_id },
                ${ record_distance },
                ${ record_duration },
                '${ record_track_data_string }'::jsonb,
                CURRENT_TIMESTAMP
            );`

        const values = [];
        console.log(query);

        const result = await pool.query(query, values);
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
    addTrackToApprovalList,
    getTracks,
    addUserRecords
}