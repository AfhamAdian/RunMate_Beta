
const initializeMap = (mapboxAccessToken) => {
    mapboxgl.accessToken = mapboxAccessToken;
    const map = new mapboxgl.Map({
        container: 'map',                            // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        // center: [-74.5, 40],                         // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9                                      // starting zoom
    });

    return map;

};

function geoLocateTest( map ){

    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });
    map.addControl(geolocate);              // adds a button

    
    // const directions = new MapboxDirections({
    //     accessToken: mapboxgl.accessToken,
    //     unit: 'metric'
    // });   
    // map.addControl(directions, 'top-right');             // adds a direction button


    var lng, lat;
    navigator.geolocation.getCurrentPosition((position) => {
        lng = position.coords.longitude;
        lat = position.coords.latitude;
        map.setCenter([lng, lat]);
    });


    return map;
}

function calculateTimeAndDistance( map )
{
    const options = {
        enableHighAccuracy: true, // Use high accuracy mode if available
        maximumAge: 0             // Maximum age (in milliseconds) of a cached position
    };

    var prevCoords = null;  
    var distanceCovered = 0;
    var timeElapsed = 0;
    var pathCoordinates = [];
    map.setZoom(17);


    // fucntions for adding path line
    map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                }
            }
    });
    

    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#888',
            'line-width': 8
        }
    });


    const watchID = navigator.geolocation.watchPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        if( prevCoords != null ){
            const point1 = turf.point([prevCoords.longitude, prevCoords.latitude]);
            const point2 = turf.point([lng, lat]);

            const options = {units: 'miles'};
            const distance = turf.distance(point1, point2, options);
            distanceCovered += distance;

            timeElapsed = (position.timestamp - prevCoords.timestamp) / 1000;
            prevCoords.timestamp = position.timestamp;

            map.setCenter([lng, lat]);

            // add new coordinates to the path
            pathCoordinates.push([lng, lat]);
            // update route
            map.getSource('route').setData({
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': pathCoordinates
                }
            });
        } else {
            pathCoordinates.push([lng, lat]);
            prevCoords = {longitude: lng, latitude: lat, timestamp: position.timestamp};
        }

        console.log(`Distance Covered: ${distanceCovered} miles, time spent: ${timeElapsed} seconds`);
    }, (error) => {
        console.error(error);
    }, options);




    if( timeElapsed > 600000 ){
        navigator.geolocation.clearWatch(watchID);
    }
}



async function walkingRouteBetweenTwoCoords ( map,mapboxAccessToken )
{
    const point1 = [91.831535,22.331238];
    const point2 = [91.812567,22.351754];

    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${point1[0]},${point1[1]};${point2[0]},${point2[1]}?alternatives=true&annotations=distance,duration&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxAccessToken}`;

    try {
        const response = await axios.get(url);
        const route = response.data.routes[0].geometry;

        // add route to the map
        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': route
            }
        });

        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#888',
                'line-width': 8
            }
        });

        map.setZoom(14);
    } catch (error) {
        console.error(error)
    }
}

// In this portion, a button to get the location of points clicked

function setUpButtonForDirectionAndGetLongLat ( map )
{
    document.create
}



















// // // this is the portion of the code to mimic movement

// let simulatedIndex = 0;
// const simulatedPath =
//     [
//         // { "latitude": 23.0005, "longitude": 91.0 },                     // every 2nd lattitude desnt work for some reason
//         // { "latitude": 23.00049892946162, "longitude": 91.00003270156462 },
//         // { "latitude": 23.00049572243069, "longitude": 91.0000652630961 },
//         // { "latitude": 23.000490392640202, "longitude": 91.00009754516101 },
//         // { "latitude": 23.000482962913143, "longitude": 91.00012940952256 },
//         // { "latitude": 23.000473465064747, "longitude": 91.00016071973265 },
//         // { "latitude": 23.000461939766257, "longitude": 91.00019134171619 },
//         // { "latitude": 23.000448436370768, "longitude": 91.0002211443451 },
//         // { "latitude": 23.000433012701894, "longitude": 91.00025 },
//         // { "latitude": 23.00041573480615, "longitude": 91.00027778511651 },
//         // { "latitude": 23.000396676670146, "longitude": 91.00030438071451 },
//         // { "latitude": 23.00037591990374, "longitude": 91.00032967290755 },
//         // { "latitude": 23.000353553390593, "longitude": 91.0003535533906 },
//         // { "latitude": 23.00032967290755, "longitude": 91.00037591990375 },
//         // { "latitude": 23.000304380714503, "longitude": 91.00039667667015 },
//         // { "latitude": 23.00027778511651, "longitude": 91.00041573480615 },
//         // { "latitude": 23.00025, "longitude": 91.00043301270189 },
//         // { "latitude": 23.000221144345108, "longitude": 91.00044843637076 },
//         // { "latitude": 23.00019134171618, "longitude": 91.00046193976625 },
//         // { "latitude": 23.00016071973265, "longitude": 91.00047346506474 },
//         // { "latitude": 23.00012940952255, "longitude": 91.00048296291314 },
//         // { "latitude": 23.000097545161008, "longitude": 91.0004903926402 },
//         // { "latitude": 23.00006526309611, "longitude": 91.00049572243068 },
//         // { "latitude": 23.000032701564614, "longitude": 91.00049892946161 },
//         // { "latitude": 23.0, "longitude": 91.0005 }

//         {
//             "latitude": 91.831546,
//             "longitude": 22.331234
//           }
//           ,{
//             "latitude": 91.83168,
//             "longitude": 22.33156
//           }
//           , {
//             "latitude": 91.832009,
//             "longitude": 22.331845
//           }
//           , {
//             "latitude": 91.832307,
//             "longitude": 22.331992
//           }
//           , {
//             "latitude": 91.832301,
//             "longitude": 22.332019
//           }
//           ,{
//             "latitude": 91.832025,
//             "longitude": 22.33189
//           }
//           , {
//             "latitude": 91.831979,
//             "longitude": 22.331884
//           }
//           , {
//             "latitude": 91.831986,
//             "longitude": 22.331922
//           }
//           , {
//             "latitude": 91.832008,
//             "longitude": 22.33203
//           }
//         , {
//             "latitude": 91.832019,
//             "longitude": 22.332457
//           }
//           ,{
//             "latitude": 91.832021,
//             "longitude": 22.332522
//           }
//          , {
//             "latitude": 91.832048,
//             "longitude": 22.332749
//           }
//          , {
//             "latitude": 91.832083,
//             "longitude": 22.332868
//           }
//          , {
//             "latitude": 91.832107,
//             "longitude": 22.332924
//           }
//           , {
//             "latitude": 91.83217,
//             "longitude": 22.333066
//           }
//          , {
//             "latitude": 91.83231,
//             "longitude": 22.333287
//           }
//           , {
//             "latitude": 91.83247,
//             "longitude": 22.333559
//           }
//           , {
//             "latitude": 91.832532,
//             "longitude": 22.333719
//           }
//           , {
//             "latitude": 91.832569,
//             "longitude": 22.333842
//           }
//           , {
//             "latitude": 91.832533,
//             "longitude": 22.333849
//           }
//          , {
//             "latitude": 91.832501,
//             "longitude": 22.333867
//           }
//          , {
//             "latitude": 91.832478,
//             "longitude": 22.333894
//           }
//          , {
//             "latitude": 91.832467,
//             "longitude": 22.333927
//           }
//           ,{
//             "latitude": 91.832467,
//             "longitude": 22.333961
//           }
//           ,{
//             "latitude": 91.832481,
//             "longitude": 22.333994
//           }
//           ,{
//             "latitude": 91.832506,
//             "longitude": 22.334021
//           }
//           ,{
//             "latitude": 91.832519,
//             "longitude": 22.334028
//           }
//           ,{
//             "latitude": 91.832408,
//             "longitude": 22.335023
//           }
//           , {
//             "latitude": 91.832278,
//             "longitude": 22.335788
//           }
//          , {
//             "latitude": 91.832363,
//             "longitude": 22.335794
//           }
//           , {
//             "latitude": 91.832304,
//             "longitude": 22.336128
//           }
//          , {
//             "latitude": 91.832242,
//             "longitude": 22.336369
//           }
//           ,{
//             "latitude": 91.832259,
//             "longitude": 22.336601
//           }
//          , {
//             "latitude": 91.832265,
//             "longitude": 22.336777
//           }
//           ,{
//             "latitude": 91.832268,
//             "longitude": 22.336918
//           }
//           ,{
//             "latitude": 91.832313,
//             "longitude": 22.33705
//           }
//           , {
//             "latitude": 91.832364,
//             "longitude": 22.337139
//           }
//          , {
//             "latitude": 91.832426,
//             "longitude": 22.337211
//           }
//         ,{
//             "latitude": 91.832552,
//             "longitude": 22.33731
//           }
//           , {
//             "latitude": 91.832756,
//             "longitude": 22.337407
//           }
//           ,{
//             "latitude": 91.832976,
//             "longitude": 22.337567
//           }
//           , {
//             "latitude": 91.833244,
//             "longitude": 22.337974
//           }
//          , {
//             "latitude": 91.833426,
//             "longitude": 22.338301
//           }
//           ,{
//             "latitude": 91.83368,
//             "longitude": 22.338756
//           }
//         , {
//             "latitude": 91.833718,
//             "longitude": 22.338823
//           }
//           , {
//             "latitude": 91.833683,
//             "longitude": 22.33894
//           }
//          ,{
//             "latitude": 91.83305,
//             "longitude": 22.34009
//           }
//         , {
//             "latitude": 91.832875,
//             "longitude": 22.340313
//           }
//          , {
//             "latitude": 91.832417,
//             "longitude": 22.340374
//           }
//           , {
//             "latitude": 91.832392,
//             "longitude": 22.340445
//           }
//          , {
//             "latitude": 91.832161,
//             "longitude": 22.340466
//           }
// ];


// // // overloading the watchPosition function to mimic movement
// navigator.geolocation.watchPosition = function ( successCallback ) {
//     const intervalId = setInterval( async () => {
//         if (simulatedIndex < simulatedPath.length) {
//             const position = {
//                 coords: {
//                     latitude: simulatedPath[simulatedIndex].latitude,
//                     longitude: simulatedPath[simulatedIndex].longitude,
//                     accuracy: 10,
//                 },
//                 timestamp: Date.now(),
//             };
//             // DO what you want to do with the cordinates here
//             await successCallback(position);
//             //
//             simulatedIndex++;
//         } else {
//             clearInterval(intervalId);
//         }
//     }, 2000);

//     return intervalId;
// };

function mimicMovement( )
{

}



window.initializeMap = initializeMap;
window.geoLocateTest = geoLocateTest;
window.mimicMovement = mimicMovement;
window.calculateTimeAndDistance = calculateTimeAndDistance;