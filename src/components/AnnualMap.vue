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
      selectedPollutantId: 'icair365',
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
          hideElementsWithSelectors: ['.leaflet-control-zoom', '.leaflet-control-simpleMapScreenshoter', '.menu', '.year']
        }).addTo(this.map);
      }

      // Map controls
      const ctrl = L.control as any,
            menu = ctrl({ position: 'topright' }),
            o3Submenu = ctrl({ position: 'topright' }),
            pm10Submenu = ctrl({ position: 'topright' }),
            mainLegend = ctrl({ position: 'topleft' }),
            watermark = ctrl({ position: 'bottomright' });

      menu.onAdd = () => {
        let div = L.DomUtil.create('div', 'menu');

        div.innerHTML = `<button id="icair365" class="active pollutantSelector">ICAIR 365</button>
                         <button id="o3" class="pollutantSelector">O₃</button>
                         <button id="no2_moyan" class="pollutantSelector">NO₂</button>
                         <button id="pm25_moyan" class="pollutantSelector">PM2.5</button>
                         <button id="pm10" class="pollutantSelector">PM10</button>`;

        return div;
      };

      o3Submenu.onAdd = () => {
        let div = L.DomUtil.create('div', 'o3Submenu');

        div.style.display = 'none';

        div.innerHTML = `<button id="o3_p932m8hj" class="active o3SubSelector">O₃ p932m8hj</button>
                         <button id="o3_pic" class="o3SubSelector">O₃ pic</button>`;

        return div;
      };

      pm10Submenu.onAdd = () => {
        let div = L.DomUtil.create('div', 'pm10Submenu');

        div.style.display = 'none';

        div.innerHTML = `<button id="pm10_moyan" class="active pm10SubSelector">PM10 moyan</button>
                         <button id="pm10_p90j" class="pm10SubSelector">PM10 p90j</button>`;

        return div;
      };

      mainLegend.onAdd = () => {
        let div = L.DomUtil.create('div', 'mainLegend');

        div.innerHTML += '<div></div>';
        div.innerHTML += `<img src="https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=12&LAYER=mod_sudpaca_${this.selectedYear}:mod_sudpaca_${this.selectedYear}_${this.selectedPollutantId}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true" alt="Légende">`;

        return div;
      };

      watermark.onAdd = () => {
        let div = L.DomUtil.create('div', 'watermark');

        div.innerHTML += '<img src="/app/assets/img/logo-atmosud.png" alt="AtmoSud" style="display:none;">';

        return div;
      };

      menu.addTo(this.map);
      o3Submenu.addTo(this.map);
      pm10Submenu.addTo(this.map);
      mainLegend.addTo(this.map);
      watermark.addTo(this.map);

      // Event listeners
      const mainButtons = this.$refs.annualMap.querySelectorAll('.pollutantSelector'),
            mainLegendUnit = this.$refs.annualMap.querySelector('.mainLegend div'),
            mainLegendImg = this.$refs.annualMap.querySelector('.mainLegend img'),
            watermarkImg = this.$refs.annualMap.querySelector('.watermark img'),
            o3SubmenuDiv = this.$refs.annualMap.querySelector('.o3Submenu'),
            pm10SubmenuDiv = this.$refs.annualMap.querySelector('.pm10Submenu'),
            o3SubButtons = this.$refs.annualMap.querySelectorAll('.o3SubSelector'),
            pm10SubButtons = this.$refs.annualMap.querySelectorAll('.pm10SubSelector');

      for (let button of mainButtons) {
        button.addEventListener('click', (e) => {
          for (let btn of mainButtons) {
            btn.classList.remove('active');
          }

          (e.target as HTMLElement).classList.add('active');

          if ((e.target as HTMLElement).id === 'o3') {
            o3SubmenuDiv.style.display = 'block';
            pm10SubmenuDiv.style.display = 'none';
            this.selectedPollutantId = o3SubmenuDiv.querySelector('.active').id;
          } else if ((e.target as HTMLElement).id === 'pm10') {
            pm10SubmenuDiv.style.display = 'block'; 
            o3SubmenuDiv.style.display = 'none';
            this.selectedPollutantId = pm10SubmenuDiv.querySelector('.active').id;
          } else {
            o3SubmenuDiv.style.display = 'none';
            pm10SubmenuDiv.style.display = 'none';

            this.selectedPollutantId = (e.target as HTMLElement).id;
          }

          this.map.removeLayer(this.currentLayer);
          this.addRaster(false);

          if (this.selectedPollutantId === 'icair365') {
            mainLegendUnit.textContent = '';
          } else {
            mainLegendUnit.textContent = 'µg/m³';
          }

          mainLegendImg.src = `https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=12&LAYER=mod_sudpaca_${this.selectedYear}:mod_sudpaca_${this.selectedYear}_${this.selectedPollutantId}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true`;
        });
      }

      const subButtonsEventHandler = pollutantButtons => {
        for (let button of pollutantButtons) {
          button.addEventListener('click', (e) => {
            console.log('Bouton OK');

            for (let btn of pollutantButtons) {
              btn.classList.remove('active');
            }

            (e.target as HTMLElement).classList.add('active');

            this.selectedPollutantId = (e.target as HTMLElement).id;

            this.map.removeLayer(this.currentLayer);
            this.addRaster(false);

            mainLegendImg.src = `https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=12&LAYER=mod_sudpaca_${this.selectedYear}:mod_sudpaca_${this.selectedYear}_${this.selectedPollutantId}&legend_options=fontColor:0x000000;dx:5;dy:0;mx:0;my:0;&TRANSPARENT=true`;
          });
        }
      }

      subButtonsEventHandler(o3SubButtons);
      subButtonsEventHandler(pm10SubButtons);

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
  width: 90%;
  height: 550px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
}

#annual-map .menu,
#annual-map .o3Submenu,
#annual-map .pm10Submenu,
#annual-map .pollutantSelector,
#annual-map .o3SubSelector,
#annual-map .pm10SubSelector {
  background-color: white;
  border-radius: 20px;
}

#annual-map .pollutantSelector,
#annual-map .o3SubSelector,
#annual-map .pm10SubSelector {
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

#annual-map .leaflet-right .leaflet-control {
  margin-left: 0;
}

.mainLegend {
  margin-left: 5px !important;
}

.mainLegend div {
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.mainLegend img {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
}

@media screen and (min-width: 993px) {
  #annual-map {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }
}

@media screen and (max-width: 992px) {
  #annual-map .mainLegend {
    margin-top: 50px;
  }
}
</style>
