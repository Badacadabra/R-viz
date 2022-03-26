<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';

interface myData {
  map: any;
  center: [number, number];
  numberOfStations: number;
  allStations: any;
  stationInfo: any;
  markerGroup: any;
  counter: any;
}

export default defineComponent({
  name: 'StationsMap',
  props: {
    stations: Array,
    info: String
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      numberOfStations: 0,
      allStations: this.stations,
      stationInfo: this.info,
      markerGroup: null,
      counter: null
    }
  },
  watch: {
    info(newInfo): void {
      this.stationInfo = newInfo;
      this.map.removeLayer(this.markerGroup);
      this.map.removeControl(this.counter);
      this.numberOfStations = 0;
      this.addStations();
    }
  },
  methods: {
    setupLeafletMap(): void {
      // Init map
      this.map = L.map('map', {
        zoomControl: false,
        minZoom: 7,
        maxZoom: 17,
        attributionControl: false,
        tap: false
      }).setView(this.center, 7);

      // Fix problem with tile loading
      this.map.whenReady(() => {
        setTimeout(() => {
          this.map.invalidateSize();
        }, 300);
      });

      // Map panes
      this.map.createPane('background');
      this.map.getPane('background').style.zIndex = "100";

      this.map.createPane('labels');
      this.map.getPane('labels').style.zIndex = "200";

      // Light Gray Canvas Base + Reference (Esri)
      Vector.vectorTileLayer('291da5eab3a0412593b66d384379f89f', {
        pane: 'background'
      }).addTo(this.map);

      Vector.vectorTileLayer('1768e8369a214dfab4e2167d5c5f2454', {
         pane: 'labels'
      }).addTo(this.map);

      // Data
      this.addStations();
    },
    addStations(): void {
      let firstIcon = L.icon({
        iconUrl: '/assets/img/station-fixe-active.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      let secondIcon = L.icon({
        iconUrl: '/assets/img/station-temporaire-active.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      let thirdIcon = L.icon({
        iconUrl: '/assets/img/station-inactive.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      this.markerGroup = L.layerGroup().addTo(this.map);

      for (let station of this.allStations) {
        let icon = null;

        if (station.type_mesure === 'Fixe' && station.etat === 'en service') {
          icon = firstIcon;
        } else if (station.type_mesure === 'Temporaire' && station.etat === 'en service') {
          icon = secondIcon;
        } else {
          icon = thirdIcon;
        }

        if (this.stationInfo === 'fixed' && icon === firstIcon) {
          this.addMarkers(station, icon);
        } else if (this.stationInfo === 'temporary' && icon === secondIcon) {
          this.addMarkers(station, icon);
        } else if (this.stationInfo === 'closed' && icon === thirdIcon) {
          this.addMarkers(station, icon);
        }
      }

      // Number of stations
      let ctrl = L.control as any;

      this.counter = ctrl({ position: 'topleft' });

      this.counter.onAdd = () => {
        let div = L.DomUtil.create('div', 'counter');

        div.innerHTML += this.numberOfStations > 1 ? `${this.numberOfStations} stations` : `${this.numberOfStations} station`;

        return div;
      };

      this.counter.addTo(this.map);
    },
    addMarkers(station: any, icon: any): void {
      let marker = L.marker([station.latitude, station.longitude], { icon }).addTo(this.markerGroup);
      marker.bindPopup(`<p>${station.nom}</p>`);

      this.numberOfStations++;
    }
  },
  mounted() {
    this.setupLeafletMap();
  }
});
</script>

<style>
#map {
 width: 100%;
 height: 350px;
}

.leaflet-popup-content-wrapper, .leaflet-popup-tip {
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  border-radius: 5px;
}

.leaflet-popup-content p {
  margin: 10px 0;
}

.counter {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
}
</style>
