const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const path = require('path');
const axios = require('axios');
const pool = require('./src/db/db');
const cookieParser = require('cookie-parser');
 

const app = express();
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();


// creating Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('server started to listening at port 3000'));



app.use('/', require('./src/routes/home.js'));
app.use('/login', require('./src/routes/logIn.js'));
app.use('/track', require('./src/routes/track.js'));

app.use('/admin', require('./src/routes/admin.js'));
// Routes//
// app.get('/', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, 'public/map1.html'));
// });

app.get('/config', (req, res) => {
    res.status(200).json({ mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN });
})



// app.post('/addTrack', async (req, res) => {
//     //console.log(req.body);
//     const trackSourceData = req.body.trackGeojson;
//     const routeDistance = req.body.routeDistance;
//     const routeDuration = req.body.routeDuration;

//     console.log(trackSourceData);
//     console.log(routeDistance);
//     console.log(routeDuration);

//     const result = await addTrackToApprovalList(1, routeDistance, routeDuration, trackSourceData);
//     console.log('result' + result);
// });





app.post('/direction', async (req,res) => {
    const coordinates = req.body.coordinates;

    const response = await getRoute(coordinates);
    
    console.log(response);

    res.status(200).json(response);
})



async function getRoute( coordinates )
{
    var url = `https://api.mapbox.com/directions/v5/mapbox/walking/`;
    // ${point1[0]},${point1[1]};${point2[0]},${point2[1]}
    coordinates.forEach( coord => {
        url += coord.lng+`,`+coord.lat+`;`;
    });
    
    url = url.slice(0, -1);
    url += `?alternatives=true&annotations=distance,duration&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${ process.env.MAPBOX_ACCESS_TOKEN }`;

    console.log( url );

    var routeGeometry;
    var distance;
    var duration;
    try {
        const response = await axios.get(url)
        // console.log(response);
        routeGeometry = response.data.routes[0].geometry;
        distance = response.data.routes[0].distance;
        duration = response.data.routes[0].duration;

        // console.log( 'duration : ', duration ); 
        console.log( 'url fethced ');
        const res = {
            routeGeometry : routeGeometry,
            distance : distance,
            duration : duration
        }
        
        // console.log(res);
        return res;        
    } catch (error) {
        console.error('eror in api call')
    }
}