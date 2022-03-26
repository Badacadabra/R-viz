<template>
  <div id="map" ref="map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';

interface myData {
  map: any;
  center: [number, number];
  currentLayer: any;
  currentDate: string;
  selectedPollutantId: string;
}

export default defineComponent({
  name: 'ForecastsMap',
  props: {
    date: String
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      currentLayer: null,
      currentDate: this.date,
      selectedPollutantId: 'multi'
    }
  },
  watch: {
    date(newDate): void {
      this.currentDate = newDate;
      this.map.removeLayer(this.currentLayer);
      this.addRaster();
    }
  },
  methods: {
    setupLeafletMap(): void {
      // Init map
      this.map = L.map('map', {
        zoomControl: false,
        minZoom: 7,
        maxZoom: 17,
        attributionControl: false
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

      // Map controls
      const ctrl = L.control as any,
            menu = ctrl({ position: 'topleft' });

      menu.onAdd = () => {
        let div = L.DomUtil.create('div', 'menu');

        div.innerHTML += `<button id="multi" class="active pollutantSelector">Multi-polluant</button>
                          <button id="o3" class="pollutantSelector">O₃</button>
                          <button id="no2" class="pollutantSelector">NO₂</button>
                          <button id="pm2_5" class="pollutantSelector">PM2.5</button>
                          <button id="pm10" class="pollutantSelector">PM10</button>`;

        return div;
      };

      menu.addTo(this.map);

      // Event listeners
      const buttons = this.$refs.map.querySelectorAll('.pollutantSelector');

      for (let button of buttons) {
        button.addEventListener('click', (e) => {
          for (let btn of buttons) {
            btn.classList.remove('active');
          }

          (e.target as HTMLElement).classList.add('active');
          this.selectedPollutantId = (e.target as HTMLElement).id;
          this.map.removeLayer(this.currentLayer);
          this.addRaster();
        });
      }

      this.map.on('click', e => {
        this.$emit('clickOnMap', e.latlng.lat, e.latlng.lng);
      });

      // WMS/WMTS
      this.addRaster();
    },
    addRaster(): void {
      this.currentLayer = L.tileLayer.wms('https://geoservices.atmosud.org/geoserver/wms?', {
        layers: `paca-${this.selectedPollutantId}-${this.currentDate}`,
        format: 'image/png',
        version: '1.1.1',
        crs: L.CRS.EPSG4326,
        transparent: true,
        minZoom: 7,
        opacity: 0.7
      }).addTo(this.map);
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
 height: 80%;
}

.menu, .pollutantSelector {
  background-color: white;
  border-radius: 20px;
}

.pollutantSelector {
  padding: 10px;
}

.active {
  color: white;
  background-color: var(--ion-color-secondary) !important;
}

.leaflet-top.leaflet-left {
  width: 100%;
  display: flex;
  justify-content: center;
}

.leaflet-left .leaflet-control {
  margin-left: 0;
}
</style>
