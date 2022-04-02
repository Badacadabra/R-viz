<template>
  <div id="annual-map" ref="annualMap"></div>
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
  currentLayer: any;
  selectedYear: string;
  selectedPollutantId: string;
  legend: any;
}

export default defineComponent({
  name: 'AnnualMap',
  props: {
    year: String
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      currentLayer: null,
      selectedYear: this.year,
      selectedPollutantId: 'isa_an',
      legend: null
    }
  },
  watch: {
    year(newYear): void {
      this.selectedYear = newYear;
      this.map.removeLayer(this.currentLayer);
      this.map.removeControl(this.legend);
      this.addRaster(true);
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
      this.map = L.map('annual-map', {
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

      // Map menu
      const ctrl = L.control as any,
            menu = ctrl({ position: 'topright' });

      menu.onAdd = () => {
        let div = L.DomUtil.create('div', 'menu');

        div.innerHTML = `<button id="isa_an" class="active pollutantSelector">ISA</button>
                         <button id="o3_p932m8hj" class="pollutantSelector">O₃</button>
                         <button id="no2_moyan" class="pollutantSelector">NO₂</button>
                         <button id="pm25_moyan" class="pollutantSelector">PM2.5</button>
                         <button id="pm10_moyan" class="pollutantSelector">PM10</button>`;

        return div;
      };

      menu.addTo(this.map);

      // Event listeners
      const buttons = this.$refs.annualMap.querySelectorAll('.pollutantSelector');

      for (let button of buttons) {
        button.addEventListener('click', (e) => {
          for (let btn of buttons) {
            btn.classList.remove('active');
          }

          (e.target as HTMLElement).classList.add('active');
          this.selectedPollutantId = (e.target as HTMLElement).id;
          this.map.removeLayer(this.currentLayer);
          this.addRaster(false);
        });
      }

      // WMS/WMTS
      this.addRaster(true);
    },
    addRaster(withLegend: boolean): void {
      if (withLegend) {
        // Legend
        const ctrl = L.control as any;

        this.legend = ctrl({ position: 'topleft' }),

        this.legend.onAdd = () => {
          let div = L.DomUtil.create('div', 'year');

          div.innerHTML = this.selectedYear;

          return div;
        };

        this.legend.addTo(this.map);
      }

      // Layer
      this.currentLayer = L.tileLayer.wms(`https://geoservices.atmosud.org/geoserver/mod_sudpaca_${this.selectedYear}/ows`, {
        layers: `mod_sudpaca_${this.selectedYear}:mod_sudpaca_${this.selectedYear}_${this.selectedPollutantId}`,
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
#annual-map {
 width: 100%;
 height: 90%;
}

#annual-map .menu, #annual-map .pollutantSelector {
  background-color: white;
  border-radius: 20px;
}

#annual-map .pollutantSelector {
  padding: 10px;
}

#annual-map .active {
  color: white;
  background-color: var(--ion-color-secondary) !important;
}

#annual-map .leaflet-top.leaflet-left .year {
  margin: 0;
  padding: 8px;
  margin-top: 10px;
  background-color: var(--ion-color-tertiary);
  border-radius: 0 5px 5px 0;
}

#annual-map .leaflet-top.leaflet-right {
  width: 100%;
  display: flex;
  justify-content: right;
}

#annual-map .leaflet-right .leaflet-control {
  margin-left: 0;
}
</style>
