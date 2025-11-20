mapboxgl.accessToken = 'pk.eyJ1Ijoicml0aWt2ZXJtYTE2MjgiLCJhIjoiY21pN2d1M2p1MDB0azJyczQ4NWN4NHN6dSJ9.o3XujTRYb7AwRf5zHHyMrA';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });