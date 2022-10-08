<template>
  <div id="stations-map" ref="stationsMap"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getPlatforms } from '@ionic/vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

interface myData {
  map: any;
  center: [number, number];
  numberOfStations: number;
  allStations: any;
  stationInfo: string;
  stationInfoPublicName: string;
  markerGroup: any;
  counter: any;
  screenshoter: any;
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
      stationInfoPublicName: '',
      markerGroup: null,
      counter: null,
      screenshoter: null
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
      // Handle different platforms
      let zoomControl = false;

      if (getPlatforms().includes('desktop') && window.innerWidth >= 1500) {
        zoomControl = true;
      }

      // Init map
      this.map = L.map('stations-map', {
        zoomControl,
        minZoom: 7,
        maxZoom: 17,
        scrollWheelZoom: false,
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
      this.map.createPane('export');
      this.map.getPane('export').style.zIndex = '0';

      this.map.createPane('background');
      this.map.getPane('background').style.zIndex = '100';

      this.map.createPane('labels');
      this.map.getPane('labels').style.zIndex = '200';

      // Light Gray Canvas Base + Reference (Esri)
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        pane: 'export'
      }).addTo(this.map);

      Vector.vectorTileLayer('291da5eab3a0412593b66d384379f89f', {
        pane: 'background'
      }).addTo(this.map);

      Vector.vectorTileLayer('1768e8369a214dfab4e2167d5c5f2454', {
         pane: 'labels'
      }).addTo(this.map);

      // Export
      if (getPlatforms().includes('desktop')) {
        this.screenshoter = new SimpleMapScreenshoter({
          hideElementsWithSelectors: ['.leaflet-control-zoom', '.leaflet-control-simpleMapScreenshoter']
        }).addTo(this.map);
      }

      const ctrl = L.control as any,
            watermark = ctrl({ position: 'bottomright' });

      watermark.onAdd = () => {
        let div = L.DomUtil.create('div', 'watermark');

        div.innerHTML += '<img src="/app/assets/img/logo-atmosud.png" alt="AtmoSud" style="display:none;width:150px;">';

        return div;
      };

      watermark.addTo(this.map);

      const watermarkImg = this.$refs.stationsMap.querySelector('.watermark img');

      this.map.on('simpleMapScreenshoter.click', () => {
        this.map.dragging.disable();
        watermarkImg.style.display = 'block';
      });

      this.map.on('simpleMapScreenshoter.done', () => {
        this.map.dragging.enable();
        watermarkImg.style.display = 'none';
      });

      // Data
      this.addStations();
    },
    addStations(): void {
      let firstIcon = L.icon({
        iconUrl: '/app/assets/img/station-fixe-active.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      let secondIcon = L.icon({
        iconUrl: '/app/assets/img/station-temporaire-active.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      let thirdIcon = L.icon({
        iconUrl: '/app/assets/img/station-inactive.png',
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
          this.stationInfoPublicName = 'fixes';
        } else if (this.stationInfo === 'temporary' && icon === secondIcon) {
          this.addMarkers(station, icon);
          this.stationInfoPublicName = 'temporaires';
        } else if (this.stationInfo === 'closed' && icon === thirdIcon) {
          this.addMarkers(station, icon);
          this.stationInfoPublicName = 'inactives';
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

      // Export
      if (getPlatforms().includes('desktop')) {
        this.screenshoter.options.screenName = `stations_${this.stationInfoPublicName}`;
      }
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
#stations-map {
  width: 90%;
  height: 350px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
}

#stations-map .leaflet-popup-content-wrapper, #stations-map .leaflet-popup-tip {
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  border-radius: 5px;
}

#stations-map .leaflet-popup-content p {
  margin: 10px 0;
}

#stations-map .counter {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
}

@media screen and (min-width: 993px) {
  #stations-map {
    width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
