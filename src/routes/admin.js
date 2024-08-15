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


router
    .route('/addAchievement')
    .post( async (req, res) => {
        try{
            console.log(req.body);
            const {
                track_count,
                streak,
                distance_required,
                name,
                description,
                image_url
            } = req.body;

            const query = `
                INSERT INTO achievement_list (
                    achievement_id,  
                    acheivement_criteria_track_count ,    
                    achievement_criteria_streak ,
                    achievement_criteria_distance ,
                    achievement_name ,
                    achievement_description ,    
                    achievement_image       
                ) VALUES (
                    COALESCE((SELECT MAX(achievement_id) FROM achievement_list), 0) + 1,
                    $1,$2,$3,$4,$5,$6
                );
            `;

            const values = [
                track_count || null,
                streak || null,
                distance_required || null,
                name || null,
                description || null,
                image_url || null
            ];
            
            const formattedQuery = formatQuery(query, values);
            console.log(formattedQuery);

            const result = await pool.query(query, values);
            res.status(200).json({ message: 'Achievment Added' });
        }catch(err){
            console.log(err);
            res.status(400).json({ message: 'Error Occurred' });
        }
    })

    function formatQuery(query, values) {
        return query.replace(/\$(\d+)/g, (_, index) => {
            const value = values[index - 1];
            if (value === null) return 'NULL';
            if (typeof value === 'string') return `'${value}'`;
            return value;
        });
    }

module.exports = router;