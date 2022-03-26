<template>
  <div id="map" ref="map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';
import axios from 'axios';

interface myData {
  map: any;
  center: [number, number];
  currentLayer: any;
  currentDate: string;
}

export default defineComponent({
  name: 'AtmoMap',
  props: {
    date: String
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      currentLayer: null,
      currentDate: this.date
    }
  },
  watch: {
    date(newDate): void {
      this.currentDate = newDate;
      this.map.removeLayer(this.currentLayer);
      this.addChoropleth();
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

      this.addChoropleth();
    },
    addChoropleth(): void {
      const reqPolygons = axios.get('https://geo.api.gouv.fr/communes?codeRegion=93&format=geojson&geometry=contour');
      const reqColors = axios.get('https://preprod-api.atmosud.org/siam/v1/accueil');

      axios.all([reqPolygons, reqColors]).then(axios.spread((...responses) => {
        const resPolygons = responses[0];
        const resColors = responses[1];

        this.currentLayer = L.geoJSON(resPolygons.data, {
          style: () => {
            return {
              color: 'white',
              weight: 1
            }
          },
          onEachFeature: (feature, layer: any) => {
            let color = resColors.data.data.legendes.indice_atmo.find(i => i.indice === resColors.data.data.cartes.communes[feature.properties.code][this.currentDate].indice_atmo).couleur;

            layer.setStyle({
              'fillColor': color,
              'fillOpacity': 1
            });

            layer.on('click', () => {
              this.$emit('clickOnCity', feature.properties.code);
            });
          }
        }).addTo(this.map);

        this.$emit('mapReady');
      }));
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
</style>
