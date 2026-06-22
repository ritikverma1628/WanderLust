mapboxgl.accessToken = mapToken;

// Fallback to default coordinates if geometry or coordinates are missing
const coordinates = (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2)
    ? listing.geometry.coordinates
    : [77.2090, 28.6139]; // Default coordinates (e.g. New Delhi)

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

// Create custom element for marker
const el = document.createElement('div');
el.className = 'marker';

new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `<h3>${listing.title}</h3><p>${listing.description || listing.location}</p>`
            )
    )
    .addTo(map);