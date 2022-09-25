<template>
  <div id="atmo-map" ref="atmoMap"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getPlatforms } from '@ionic/vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import axios from 'axios';
import { format } from 'date-fns';

interface myData {
  map: any;
  center: [number, number];
  currentLayer: any;
  currentDate: string;
  screenshoter: any;
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
      currentDate: this.date,
      screenshoter: null
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
      this.map = L.map('atmo-map', {
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
          hideElementsWithSelectors: ['.leaflet-control-zoom', '.leaflet-control-simpleMapScreenshoter']
        }).addTo(this.map);
      }

      // Map controls
      const ctrl = L.control as any,
            legend = ctrl({ position: 'topleft' }),
            watermark = ctrl({ position: 'bottomright' });

      axios.get('https://api.atmosud.org/siam/v1/accueil')
        .then(response => {
          legend.onAdd = () => {
            let div = L.DomUtil.create('div', 'legend');

            response.data.data.legendes.indice_atmo.forEach(i => {
              div.innerHTML += '<div>';
              div.innerHTML += `<div class="legend-color" style="background-color:${i.couleur};"></div>`;
              div.innerHTML += `<span>${i.qualificatif}</span>`;
              div.innerHTML += '</div>';
            });

            return div;
          };

          legend.addTo(this.map);
        });

      watermark.onAdd = () => {
        let div = L.DomUtil.create('div', 'watermark');

        div.innerHTML += '<img src="/app/assets/img/logo-atmosud.png" alt="AtmoSud" style="display:none;">';

        return div;
      };

      watermark.addTo(this.map);

      const watermarkImg = this.$refs.atmoMap.querySelector('.watermark img');

      this.map.on('simpleMapScreenshoter.click', () => {
        this.map.dragging.disable();
        watermarkImg.style.display = 'block';
      });

      this.map.on('simpleMapScreenshoter.done', () => {
        this.map.dragging.enable();
        watermarkImg.style.display = 'none';
      });

      // Data
      this.addChoropleth();
    },
    addChoropleth(): void {
      const reqPolygons = axios.get('https://geo.api.gouv.fr/communes?codeRegion=93&format=geojson&geometry=contour');
      const reqColors = axios.get('https://api.atmosud.org/siam/v1/accueil');

      /* function getColor(atmo) {
        return atmo === 0 ? '#dddddd' : // Indisponible
          atmo === 1 ? '#50F0E6' : // Bon
          atmo === 2 ? '#50CCAA' : // Moyen
          atmo === 3 ? '#F0E641' : // Dégradé
          atmo === 4 ? '#FF5050' : // Mauvais
          atmo === 5 ? '#960032' : // Très mauvais
          atmo === 6 ? '#872181' : // Extrêmement mauvais
          atmo === 7 ? '#888888' : ''; // Événement
      } */

      axios.all([reqPolygons, reqColors]).then(axios.spread((...responses) => {
        const resPolygons = responses[0];
        const resColors = responses[1];

        /* let newGeoJson = resPolygons.data;

        for (let feature of newGeoJson.features) {
          feature.properties.iqa = Math.trunc(resColors.data.data.cartes.communes[feature.properties.code][this.currentDate].indice_atmo);
        } */

        this.currentLayer = L.geoJSON(resPolygons.data, {
          style: () => {
            return {
              /* fillColor: getColor(feature.properties.iqa),
              fillOpacity: 1, */
              color: 'white',
              weight: 1
            }
          },
          onEachFeature: (feature, layer: any) => {
            let color = resColors.data.data.legendes.indice_atmo.find(i => i.indice === Math.trunc(resColors.data.data.cartes.communes[feature.properties.code][this.currentDate].indice_atmo)).couleur;

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

      // Export
      if (getPlatforms().includes('desktop')) {
        this.screenshoter.options.screenName = `indice-atmo_${format(new Date(this.currentDate), 'dd-MM-yyyy')}`;
      }
    }
  },
  mounted() {
    this.setupLeafletMap();
  }
});
</script>

<style>
#atmo-map {
  width: 100%;
  height: 90%;
}

#atmo-map .legend {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  padding: 5px;
}

#atmo-map .legend-color {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 10px;
}
</style>
