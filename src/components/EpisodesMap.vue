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
  currentLayer: any;
  currentDate: string;
  selectedPollutantId: string;
}

export default defineComponent({
  name: 'EpisodesMap',
  props: {
    date: String,
    pollutant: String
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      currentLayer: null,
      currentDate: this.date,
      selectedPollutantId: this.pollutant
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

<style scoped>
#map {
 width: 100%;
 height: 350px;
}
</style>
