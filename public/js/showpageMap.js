mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 6, // starting zoom
});

const marker = new mapboxgl.Marker().setLngLat(campground.geometry).addTo(map);
