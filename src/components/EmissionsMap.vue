<template>
  <div id="emissions-map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getPlatforms } from '@ionic/vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';

interface myData {
  map: any;
  center: [number, number];
  currentVariables: any;
  selectedPollutant: string;
  choroplethData: any;
  currentLayer: any;
  legend: any;
}

export default defineComponent({
  name: 'EmissionsMap',
  props: {
    variables: Object,
    pollutant: String,
    geojson: Object
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      currentVariables: this.variables,
      selectedPollutant: this.pollutant,
      choroplethData: this.geojson,
      currentLayer: null,
      legend: null
    }
  },
  watch: {
    pollutant(newPollutant): void {
      this.selectedPollutant = newPollutant;
      this.map.removeLayer(this.currentLayer);
      this.map.removeControl(this.legend);
      this.addChoropleth();
    }
  },
  methods: {
    setupLeafletMap(): void {
      // Handle different platforms
      let zoomControl = false,
          zoomLevel = 7;

      if (getPlatforms().includes('tablet') && window.innerWidth >= 700) {
        zoomLevel = 8;
      }

      if (getPlatforms().includes('desktop') && window.innerWidth >= 1500) {
        zoomControl = true;
        zoomLevel = 8;
      }

      // Init map
      this.map = L.map('emissions-map', {
        zoomControl,
        minZoom: zoomLevel,
        maxZoom: 17,
        attributionControl: false
      }).setView(this.center, zoomLevel);

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
      this.addChoropleth();
    },
    addChoropleth(): void {
      // Legend
      const ctrl = L.control as any;

      this.legend = ctrl({ position: 'topleft' });

      this.legend.onAdd = () => {
        let div = L.DomUtil.create('div', 'legend'),
            grades = [];

        switch (this.selectedPollutant) {
          case 'nox':
            grades = [0, 400, 900, 1700, 2300, 4000];
            break;
          case 'pm10':
            grades = [0, 100, 200, 300, 400, 900];
            break;
          case 'pm25':
            grades = [0, 100, 200, 300, 500, 700];
            break;
          case 'covnm':
            grades = [0, 1000, 3000, 4000, 6000, 7000];
            break;
          case 'so2':
            grades = [0, 25, 50, 100, 200, 300];
            break;
          case 'nh3':
            grades = [0, 100, 200, 300, 400, 1000];
            break;
          case 'co':
            grades = [0, 1000, 2000, 3000, 5000, 7000];
            break;
        }

        let pollutant = this.selectedPollutant === 'pm25' ? 'pm2.5' : this.selectedPollutant;

        div.innerHTML += `<h4>Émissions ${this.variables[pollutant].annee}<br>(${this.variables[pollutant].unite})</h4>`;

        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += '<i style="background:' + this.getColor(this.selectedPollutant, grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
        }

        return div;
      };

      this.legend.addTo(this.map);

      // GeoJSON
      this.currentLayer = L.geoJSON(this.choroplethData, {
        style: this.style,
        onEachFeature: (feature, layer: any) => {
          layer.on('click', () => {
            this.$emit('clickOnEpci', feature.properties.siren_epci);
          });
        }
      }).addTo(this.map);
    },
    style(feature: any): any {
      return {
        fillColor: this.getColor(this.selectedPollutant, feature.properties.val),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    },
    getColor(pollutant: string, value: number): string {
      switch (pollutant) {
        case 'nox':
          return value > 4000 ? '#084594' :
                 value > 2300 ? '#2171b5' :
                 value > 1700 ? '#4292c6' :
                 value > 900  ? '#6baed6' :
                 value > 400  ? '#9ecae1' :
                 value > 0    ? '#c6dbef' :
                                '#eff3ff';
        case 'pm10':
          return value > 900 ? '#8c2d04' :
                 value > 400 ? '#d94801' :
                 value > 300 ? '#f16913' :
                 value > 200 ? '#fd8d3c' :
                 value > 100 ? '#fdae6b' :
                 value > 0   ? '#fdd0a2' :
                               '#feedde';
        case 'pm25':
          return value > 700 ? '#99000d' :
                 value > 500 ? '#cb181d' :
                 value > 300 ? '#ef3b2c' :
                 value > 200 ? '#fb6a4a' :
                 value > 100 ? '#fc9272' :
                 value > 0   ? '#fcbba1' :
                               '#fee5d9';
        case 'covnm':
          return value > 7000 ? '#252525' :
                 value > 6000 ? '#525252' :
                 value > 4000 ? '#737373' :
                 value > 3000 ? '#969696' :
                 value > 1000 ? '#bdbdbd' :
                 value > 0    ? '#d9d9d9' :
                                '#f7f7f7';
        case 'so2':
          return value > 300 ? '#4a1486' :
                 value > 200 ? '#6a51a3' :
                 value > 100 ? '#807dba' :
                 value > 50  ? '#9e9ac8' :
                 value > 25  ? '#bcbddc' :
                 value > 0   ? '#dadaeb' :
                               '#f2f0f7';
        case 'nh3':
          return value > 1000 ? '#005a32' :
                 value > 400  ? '#238b45' :
                 value > 300  ? '#41ab5d' :
                 value > 200  ? '#74c476' :
                 value > 100  ? '#a1d99b' :
                 value > 0    ? '#c7e9c0' :
                                '#edf8e9';
        case 'co':
          return value > 7000 ? '#7a0177' :
                 value > 5000 ? '#ae017e' :
                 value > 3000 ? '#dd3497' :
                 value > 2000 ? '#f768a1' :
                 value > 1000 ? '#fa9fb5' :
                 value > 0    ? '#fcc5c0' :
                                '#feebe2';
      }
    }
  },
  mounted() {
    this.setupLeafletMap();
  }
});
</script>

<style>
#emissions-map {
 width: 100%;
 height: 100%;
}

#emissions-map .legend {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 5px;
}

#emissions-map .legend h4 {
  font-size: 13px;
  margin: 0 0 10px 0;
  text-align: center;
}

#emissions-map .legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}
</style>
