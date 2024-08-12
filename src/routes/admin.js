const express = require('express');
const pool = require('../db/db.js');

const router = express.Router();

router
    .route('/')
    .get( async (req, res) => {
        try{
        console.log("admin page requested");
        
        const query =
                `select (select user_name 
                from users 
                where user_id = d.user_id ), 
                approval_id, approval_track_distance, approval_track_duration, DATE(approval_request_time) 
                from approval_list d
                where approval_status = 'Pending';
                `;
            const values = [];
            const result = await pool.query(query, values);
        

        res.render('../views/admin',{ items : result.rows})
        }catch(err){
            console.log(err);
            res.status(400).json({ message: 'Error Occurred' });
        }
    })


router
    .route('/approve/:approval_id')
    .post( async (req, res) => {
        try{
            const approval_id = req.params.approval_id;
            console.log(approval_id);
            const query = `UPDATE approval_list SET approval_status = 'Approved' WHERE approval_id = $1`;
            const values = [approval_id];

            const result = await pool.query(query, values);
            res.status(200).json({ message: 'Track Approved' });
        }catch(err){
            console.log(err);
            res.status(400).json({ message: 'Error Occurred' });
        }
    })

module.exports = router;