mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color : "red"})
.setLngLat(listing.geometry.coordinates)// Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25 })
.setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after Booking</p>`))
.addTo(map)