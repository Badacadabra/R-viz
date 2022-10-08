<template>
  <div id="forecasts-map" ref="forecastsMap"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getPlatforms } from '@ionic/vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { format } from 'date-fns';

interface myData {
  map: any;
  center: [number, number];
  currentLayer: any;
  currentDate: string;
  selectedPollutantId: string;
  screenshoter: any;
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
      selectedPollutantId: 'multi',
      screenshoter: null
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
      this.map = L.map('forecasts-map', {
        zoomControl,
        minZoom: zoomLevel,
        maxZoom: 17,
        scrollWheelZoom: false,
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
          hideElementsWithSelectors: ['.leaflet-control-zoom', '.leaflet-control-simpleMapScreenshoter', '.menu']
        }).addTo(this.map);
      }

      // Map controls
      const ctrl = L.control as any,
            menu = ctrl({ position: 'topright' }),
            legend = ctrl({ position: 'topleft' }),
            watermark = ctrl({ position: 'bottomright' });

      menu.onAdd = () => {
        let div = L.DomUtil.create('div', 'menu');

        div.innerHTML += `<button id="multi" class="active pollutantSelector">Multi-polluant</button>
                          <button id="o3" class="pollutantSelector">O₃</button>
                          <button id="no2" class="pollutantSelector">NO₂</button>
                          <button id="pm2_5" class="pollutantSelector">PM2.5</button>
                          <button id="pm10" class="pollutantSelector">PM10</button>`;

        return div;
      };

      legend.onAdd = () => {
        let div = L.DomUtil.create('div', 'legend');

        div.innerHTML += '<div></div>';
        div.innerHTML += `<img src="https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=12&LAYER=azurjour:paca-${this.selectedPollutantId}-${this.currentDate}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true" alt="Légende">`;

        return div;
      };

      watermark.onAdd = () => {
        let div = L.DomUtil.create('div', 'watermark');

        div.innerHTML += '<img src="/app/assets/img/logo-atmosud.png" alt="AtmoSud" style="display:none;">';

        return div;
      };

      menu.addTo(this.map);
      legend.addTo(this.map);
      watermark.addTo(this.map);

      // Event listeners
      const buttons = this.$refs.forecastsMap.querySelectorAll('.pollutantSelector'),
            legendUnit = this.$refs.forecastsMap.querySelector('.legend div'),
            legendImg = this.$refs.forecastsMap.querySelector('.legend img'),
            watermarkImg = this.$refs.forecastsMap.querySelector('.watermark img');

      for (let button of buttons) {
        button.addEventListener('click', (e) => {
          for (let btn of buttons) {
            btn.classList.remove('active');
          }

          (e.target as HTMLElement).classList.add('active');
          this.selectedPollutantId = (e.target as HTMLElement).id;
          this.map.removeLayer(this.currentLayer);
          this.addRaster();

          if (this.selectedPollutantId === 'multi') {
            legendUnit.textContent = '';
          } else {
            legendUnit.textContent = 'µg/m³';
          }

          legendImg.src = `https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=12&LAYER=azurjour:paca-${this.selectedPollutantId}-${this.currentDate}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true`;
        });
      }

      this.map.on('click', e => {
        this.$emit('clickOnMap', e.latlng.lat, e.latlng.lng);
      });

      this.map.on('simpleMapScreenshoter.click', () => {
        this.map.dragging.disable();
        watermarkImg.style.display = 'block';
      });

      this.map.on('simpleMapScreenshoter.done', () => {
        this.map.dragging.enable();
        watermarkImg.style.display = 'none';
      });

      // WMS/WMTS
      this.addRaster();
    },
    addRaster(): void {
      this.currentLayer = L.tileLayer.wms('https://geoservices.atmosud.org/geoserver/wms?', {
        layers: `azurjour:paca-${this.selectedPollutantId}-${this.currentDate}`,
        format: 'image/png',
        version: '1.1.1',
        crs: L.CRS.EPSG4326,
        transparent: true,
        minZoom: 7,
        opacity: 0.7
      }).addTo(this.map);

      // Export
      if (getPlatforms().includes('desktop')) {
        this.screenshoter.options.screenName = `previsions-detaillees_${format(new Date(this.currentDate), 'dd-MM-yyyy')}_${this.selectedPollutantId}`;
      }
    }
  },
  mounted() {
    this.setupLeafletMap();
  }
});
</script>

<style>
#forecasts-map {
  width: 90%;
  height: 550px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
}

#forecasts-map .menu, #forecasts-map .pollutantSelector {
  background-color: white;
  border-radius: 20px;
}

#forecasts-map .pollutantSelector {
  padding: 10px;
}

#forecasts-map .active {
  color: white;
  background-color: var(--ion-color-secondary) !important;
}

#forecasts-map .leaflet-top.leaflet-right {
  width: 100%;
  display: flex;
  justify-content: center;
}

#forecasts-map .leaflet-right .leaflet-control {
  margin-left: 0;
}

.legend div {
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.legend img {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
}

@media screen and (max-width: 992px) {
  .legend {
    margin-top: 50px !important;
    margin-left: 5px !important;
  }
}

@media screen and (min-width: 993px) {
  #forecasts-map {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
