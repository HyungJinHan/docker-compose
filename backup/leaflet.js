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
      iconSize: [41, 41],
      iconAnchor: [20, 41],
      popupAnchor: [0, -35],
      iconUrl:
        "https://odn-grafana-image-bucket.s3.ap-northeast-2.amazonaws.com/marker/connected.png",
    });
  } else if (!filter.connection) {
    customIcon = new L.Icon({
      iconSize: [41, 41],
      iconAnchor: [20, 41],
      popupAnchor: [0, -35],
      iconUrl:
        "https://odn-grafana-image-bucket.s3.ap-northeast-2.amazonaws.com/marker/disconnected.png",
    });
  }

  return L.marker(latlng, { icon: customIcon });
};

import("https://esm.sh/leaflet").then(async ({ default: L }) => {
  await import("https://esm.sh/leaflet.markercluster.esm")
    .then(({ markerClusterGroup }) => {
      /**
       * markerCluster
       */
      // var cluster = markerClusterGroup({
      //   iconCreateFunction(cluster) {
      //     return createDivIcon({
      //       iconAnchor: [28, 28],
      //       iconSize: [56, 56],
      //       html: cluster.getChildCount(),
      //     });
      //   },
      // })

      /**
       * Cleanup
       */
      if (this.map) {
        this.map.remove();
      }

      // let container = L.DomUtil.get("leaflet");

      // if (!container || container._leaflet_id) {
      //   return;
      // }

      var map = L.map("leaflet", {
        scrollWheelZoom: true,
        // gestureHandling: true,
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

      /**
       * markerCluster
       */
      // for (let i = 0; i < geojson.length; i++) {
      //   const feature = geojson[i];
      //   const marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]); // new L.LatLng(a[0], a[1])
      //   console.log(marker)
      //   // marker.bindPopup(`${title}`);

      //   cluster.addLayer(marker);
      // }

      // map.addLayer(cluster); // -> markerCluster 주석

      geojsonLayer.bindPopup(function (data) {
        const device = context.data[0].map((res) => res);
        const filter = device.find(
          (res) =>
            JSON.parse(res.location).geometry.coordinates[0] ===
              data.feature.geometry.coordinates[0] &&
            JSON.parse(res.location).geometry.coordinates[1] ===
              data.feature.geometry.coordinates[1]
        );
        const device_id = filter.device_id
          ? filter.device_id
          : filter.device_name;

        context.grafana.locationService.partial(
          {
            "var-Sensor": device_id,
          },
          true // replace: true tells Grafana to update the current URL state, rather than creating a new history entry.
        );

        data.bindPopup(device_id);
        data.openPopup();

        // data.on("mouseover", function () {
        //   data.bindPopup(device_id);
        //   data.openPopup();
        // })

        // data.on("mouseout", function () {
        //   data.closePopup();
        // })
      });
    })
    .catch((err) => console.log(err.message));
});

// ph
// salinity
// tds
// temperature

// 용존산소 mg/L
// 수소이온농도 pH
// 염도 g/Kg
// 전기전도도 µS/cm
// 총용존고형물 ppm

// battery.power.unit | value - W
// battery.voltage.unit | value - V
// load.unit | value - W
// soc.unit | value - %

// const shadowValue = {
//   geometry: {
//     coordinates: [127.67240142822266, 34.7328109741211],
//     type: "Point",
//   },
//   properties: {
//     conductivity: { unit: "µS/cm", value: 41911.875 },
//     oxygen: { unit: "mg/L", value: 4.804198265075684 },
//     ph: { unit: "pH", value: 7.98469638824463 },
//     redox: { unit: "mV", value: -349.25531005859375 },
//     salinity: { unit: "g/Kg", value: 26.881053924560547 },
//     tds: { unit: "ppm", value: 27330.734375 },
//     temperature: { unit: "°C", value: 26.659635543823242 },
//   },
//   type: "Feature",
// };
