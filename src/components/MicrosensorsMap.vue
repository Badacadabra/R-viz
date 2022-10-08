<template>
  <div id="microsensors-map" ref="microsensorsMap"></div>
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
  numberOfMicrosensors: number;
  allMicrosensors: any;
  microsensorCampaignId: number;
  campaignName: string;
  markerGroup: any;
  counter: any;
  screenshoter: any;
}

export default defineComponent({
  name: 'MicrosensorsMap',
  props: {
    microsensors: Array,
    campaign: Number
  },
  data(): myData {
    return{
      map: null,
      center: [43.938, 6.022], // Entrevennes
      numberOfMicrosensors: 0,
      allMicrosensors: this.microsensors,
      microsensorCampaignId: this.campaign,
      campaignName: '',
      markerGroup: null,
      counter: null,
      screenshoter: null
    }
  },
  watch: {
    campaign(newCampaign): void {
      this.microsensorCampaignId = newCampaign;
      this.map.removeLayer(this.markerGroup);
      this.map.removeControl(this.counter);
      this.numberOfMicrosensors = 0;
      this.addMicrosensors();
    },
    microsensors(newMicrosensors): void {
      this.allMicrosensors = newMicrosensors;
      this.map.removeLayer(this.markerGroup);
      this.map.removeControl(this.counter);
      this.numberOfMicrosensors = 0;
      this.addMicrosensors();
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
      this.map = L.map('microsensors-map', {
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

      const watermarkImg = this.$refs.microsensorsMap.querySelector('.watermark img');

      this.map.on('simpleMapScreenshoter.click', () => {
        this.map.dragging.disable();
        watermarkImg.style.display = 'block';
      });

      this.map.on('simpleMapScreenshoter.done', () => {
        this.map.dragging.enable();
        watermarkImg.style.display = 'none';
      });

      // Data
      this.addMicrosensors();
    },
    addMicrosensors(): void {
      let firstIcon = L.icon({
        iconUrl: '/app/assets/img/capteur-diams.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      let secondIcon = L.icon({
        iconUrl: '/app/assets/img/capteur-nature4citylife.png',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      this.markerGroup = L.layerGroup().addTo(this.map);

      for (let microsensor of this.allMicrosensors) {
        let icon = null;

        if (microsensor.id_campagne === 12 && this.microsensorCampaignId === 12) {
          icon = firstIcon;
          this.addMarkers(microsensor, icon);
          this.campaignName = 'DIAMS';
        }

        if (microsensor.id_campagne === 5 && this.microsensorCampaignId === 5) {
          icon = secondIcon;
          this.addMarkers(microsensor, icon);
          this.campaignName = 'Nature4CityLife';
        }
      }

      // Number of microsensors
      const ctrl = L.control as any;

      this.counter = ctrl({ position: 'topleft' });

      this.counter.onAdd = () => {
        let div = L.DomUtil.create('div', 'counter');

        div.innerHTML += this.numberOfMicrosensors > 1 ? `${this.numberOfMicrosensors} microcapteurs` : `${this.numberOfMicrosensors} microcapteur`;

        return div;
      };

      this.counter.addTo(this.map);

      // Export
      if (getPlatforms().includes('desktop')) {
        this.screenshoter.options.screenName = `microcapteurs_${this.campaignName}`;
      }
    },
    addMarkers(microsensor: any, icon: any): void {
      let marker = L.marker([microsensor.lat, microsensor.lon], { icon }).addTo(this.markerGroup);
      marker.bindPopup(`<p>${microsensor.nom_site}</p>`);

      this.numberOfMicrosensors++;
    }
  },
  mounted() {
    this.setupLeafletMap();
  }
});
</script>

<style>
#microsensors-map {
  width: 90%;
  height: 350px;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
}

#microsensors-map .leaflet-popup-content-wrapper, #microsensors-map .leaflet-popup-tip {
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  border-radius: 5px;
}

#microsensors-map .leaflet-popup-content p {
  margin: 10px 0;
}

#microsensors-map .counter {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
}

@media screen and (min-width: 993px) {
  #microsensors-map {
    width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
