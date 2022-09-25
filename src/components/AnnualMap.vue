<template>
  <div id="annual-map" ref="annualMap"></div>
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
  currentLayer: any;
  selectedYear: string;
  selectedPollutantId: string;
  legend: any;
  screenshoter: any;
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
      legend: null,
      screenshoter: null
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
          hideElementsWithSelectors: ['.leaflet-control-zoom', '.leaflet-control-simpleMapScreenshoter', '.menu', '.year']
        }).addTo(this.map);
      }

      // Map controls
      const ctrl = L.control as any,
            menu = ctrl({ position: 'topright' }),
            mainLegend = ctrl({ position: 'topleft' }),
            watermark = ctrl({ position: 'bottomright' });

      menu.onAdd = () => {
        let div = L.DomUtil.create('div', 'menu');

        div.innerHTML = `<button id="isa_an" class="active pollutantSelector">ISA</button>
                         <button id="o3_p932m8hj" class="pollutantSelector">O₃</button>
                         <button id="no2_moyan" class="pollutantSelector">NO₂</button>
                         <button id="pm25_moyan" class="pollutantSelector">PM2.5</button>
                         <button id="pm10_moyan" class="pollutantSelector">PM10</button>`;

        return div;
      };

      mainLegend.onAdd = () => {
        let div = L.DomUtil.create('div', 'mainLegend');

        div.innerHTML += '<div></div>';
        div.innerHTML += `<img src="https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=15&LAYER=mod_sudpaca_${this.selectedYear}:mod_sudpaca_${this.selectedYear}_${this.selectedPollutantId}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true" alt="Légende">`;

        return div;
      };

      watermark.onAdd = () => {
        let div = L.DomUtil.create('div', 'watermark');

        div.innerHTML += '<img src="/app/assets/img/logo-atmosud.png" alt="AtmoSud" style="display:none;">';

        return div;
      };

      menu.addTo(this.map);
      mainLegend.addTo(this.map);
      watermark.addTo(this.map);

      // Event listeners
      const buttons = this.$refs.annualMap.querySelectorAll('.pollutantSelector'),
            mainLegendUnit = this.$refs.annualMap.querySelector('.mainLegend div'),
            mainLegendImg = this.$refs.annualMap.querySelector('.mainLegend img'),
            watermarkImg = this.$refs.annualMap.querySelector('.watermark img');

      for (let button of buttons) {
        button.addEventListener('click', (e) => {
          for (let btn of buttons) {
            btn.classList.remove('active');
          }

          (e.target as HTMLElement).classList.add('active');
          this.selectedPollutantId = (e.target as HTMLElement).id;
          this.map.removeLayer(this.currentLayer);
          this.addRaster(false);

          if (this.selectedPollutantId === 'isa_an') {
            mainLegendUnit.textContent = '';
          } else {
            mainLegendUnit.textContent = 'µg/m³';
          }

          mainLegendImg.src = `https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=15&LAYER=mod_sudpaca_${this.selectedYear}:mod_sudpaca_${this.selectedYear}_${this.selectedPollutantId}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true`;
        });
      }

      this.map.on('simpleMapScreenshoter.click', () => {
        this.map.dragging.disable();
        watermarkImg.style.display = 'block';
      });

      this.map.on('simpleMapScreenshoter.done', () => {
        this.map.dragging.enable();
        watermarkImg.style.display = 'none';
      });

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

      // Export
      if (getPlatforms().includes('desktop')) {
        this.screenshoter.options.screenName = `carte-annuelle_${this.selectedYear}_${this.selectedPollutantId}`;
      }
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

.mainLegend div {
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.mainLegend img {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
}
</style>
