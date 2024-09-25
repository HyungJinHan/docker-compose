const openstreetmapLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; // openstreetmap (Default)
const googleMapLayer = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"; // Google Map (Satellite)
const mapAttribution =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

const pointToLayer = (feature, latlng) => {
  const device = context.data[0].map((res) => res);
  const filter = device.find(
    (res) =>
      JSON.parse(res.location).geometry.coordinates[0] ===
        feature.geometry.coordinates[0] &&
      JSON.parse(res.location).geometry.coordinates[1] ===
        feature.geometry.coordinates[1]
  );
  let customIcon;

  if (filter.connection) {
    customIcon = new L.Icon({
      iconUrl:
        "https://odn-grafana-image-bucket.s3.ap-northeast-2.amazonaws.com/marker/connected.png",
    });
  } else if (!filter.connection) {
    customIcon = new L.Icon({
      iconUrl:
        "https://odn-grafana-image-bucket.s3.ap-northeast-2.amazonaws.com/marker/disconnected.png",
    });
  }

  return L.marker(latlng, { icon: customIcon });
};

import("https://esm.sh/leaflet").then(({ default: L }) => {
  /**
   * Cleanup
   */
  if (this.map) {
    this.map.remove();
  }

  let container = L.DomUtil.get("leaflet");

  if (!container || container._leaflet_id) {
    return;
  }

  var map = L.map("leaflet", {
    scrollWheelZoom: false,
    zoomControl: true,
    dragging: true,
  }).fitBounds(
    context.data[0].map((res) =>
      JSON.parse(res.location).geometry.coordinates.reverse()
    )
  );

  this.map = map;

  L.tileLayer(openstreetmapLayer, {
    attribution: mapAttribution,
    maxZoom: 18,
  }).addTo(map);

  //if you want to use inline data
  const geojson = context.data[0].map((res) => JSON.parse(res.location));

  let geojsonLayer = L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => pointToLayer(feature, latlng),
  }).addTo(map);

  geojsonLayer.bindPopup(function (data) {
    const device = context.data[0].map((res) => res);
    const filter = device.find(
      (res) =>
        JSON.parse(res.location).geometry.coordinates[0] ===
          data.feature.geometry.coordinates[0] &&
        JSON.parse(res.location).geometry.coordinates[1] ===
          data.feature.geometry.coordinates[1]
    );
    const device_id = filter.device_id;

    context.grafana.locationService.partial(
      {
        "var-Sensor": device_id,
      },
      true // replace: true tells Grafana to update the current URL state, rather than creating a new history entry.
    );
  });
});
