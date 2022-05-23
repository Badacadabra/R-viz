<template>
  <div id="microsensors-map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';

interface myData {
  map: any;
  center: [number, number];
  numberOfMicrosensors: number;
  allMicrosensors: any;
  microsensorCampaignId: number;
  markerGroup: any;
  counter: any;
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
      markerGroup: null,
      counter: null
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
      // Init map
      this.map = L.map('microsensors-map', {
        zoomControl: false,
        minZoom: 7,
        maxZoom: 17,
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
      this.map.createPane('background');
      this.map.getPane('background').style.zIndex = '100';

      this.map.createPane('labels');
      this.map.getPane('labels').style.zIndex = '200';

      // Light Gray Canvas Base + Reference (Esri)
      Vector.vectorTileLayer('291da5eab3a0412593b66d384379f89f', {
        pane: 'background'
      }).addTo(this.map);

      Vector.vectorTileLayer('1768e8369a214dfab4e2167d5c5f2454', {
         pane: 'labels'
      }).addTo(this.map);

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

        if (microsensor.id_campagne === 12 && this.microsensorCampaignId === 12) { // DIAMS
          icon = firstIcon;
          this.addMarkers(microsensor, icon);
        }

        if (microsensor.id_campagne === 5 && this.microsensorCampaignId === 5) { // Nature4CityLife
          icon = secondIcon;
          this.addMarkers(microsensor, icon);
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
 width: 100%;
 height: 350px;
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
</style>
