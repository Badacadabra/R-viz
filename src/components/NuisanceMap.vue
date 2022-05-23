<template>
  <ion-alert
    :is-open="isAlertDisplayed"
    header="Erreur de connexion"
    message="Impossible de récupérer les données."
    :buttons="['OK']"
    @didDismiss="hideAlert()"
  ></ion-alert>
  <div id="nuisance-map"></div>
  <ion-modal class="main-modal" :is-open="isModalOpened">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Déclaration</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="hideDetails()">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <div v-for="declaration in details" :key="declaration.id">
        <div v-if="declaration.id === selectedDeclarationId">
          <ion-list>
            <ion-list-header>
              <ion-label>
                <h2>Informations</h2>
              </ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>
                <h3>Type</h3>
                <p>{{ declaration.type }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Date de perception</h3>
                <p>{{ declaration.perceptionDate }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Date de déclaration</h3>
                <p>{{ declaration.declarationDate }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Département</h3>
                <p>{{ declaration.department }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Code postal</h3>
                <p>{{ declaration.zipCode }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Ville</h3>
                <p>{{ declaration.city }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-list>
            <ion-list-header>
              <ion-label>
                <h2>Données</h2>
              </ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Avez-vous des symptômes ?</h3>
                <p>{{ declaration.siOuiQuelsSymptomes || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Description des éventuels autres symptômes</h3>
                <p>{{ declaration.descriptionDesEventuelsAutresSymptomes || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Durée de la nuisance</h3>
                <p>{{ declaration.dureeDeLaNuisance || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Niveau de gêne</h3>
                <p>{{ declaration.niveauDeGene || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Origine de la nuisance</h3>
                <p>{{ declaration.origineDeLaNuisance || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Description de l'origine de la nuisance</h3>
                <p>{{ declaration.descriptionDeLorigineDeLaNuisance || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Source industrielle potentielle de la nuisance</h3>
                <p>{{ declaration.sourceIndustriellePotentielleDeLaNuisance || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item v-if="declaration.type === 'Odeur'">
              <ion-label class="ion-text-wrap">
                <h3>Apparentement de l'odeur</h3>
                <p>{{ declaration.apparentementDeLodeur || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item v-if="declaration.type === 'Odeur'">
              <ion-label class="ion-text-wrap">
                <h3>Si autre apparentement d'odeur</h3>
                <p>{{ declaration.siAutreApparentementDodeur || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <h3>Remarque ou commentaire</h3>
                <p>{{ declaration.remarqueCommentaire || "Non disponible" }}</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Photographie</h3>
                <p v-if="declaration.photoUrl === ''">Non disponible</p>
                <img v-else :src="declaration.photoUrl" alt="Photographie">
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getPlatforms } from '@ionic/vue';
import { IonModal, IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonIcon, IonAlert } from '@ionic/vue';
import { close } from 'ionicons/icons';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as Vector from 'esri-leaflet-vector';
import { MarkerClusterGroup } from 'leaflet.markercluster/src';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface myData {
  isAlertDisplayed: boolean;
  startDate: string;
  endDate: string;
  map: any;
  center: [number, number];
  clusters: any;
  counter: any;
  numberOfReports: number;
  isModalOpened: boolean;
  index: number;
  selectedDeclarationId: number;
  details: Array<{
    id: number,
    type: string,
    perceptionDate: string,
    declarationDate: string,
    department: string,
    zipCode: string,
    city: string,
    siOuiQuelsSymptomes: string,
    descriptionDesEventuelsAutresSymptomes: string,
    dureeDeLaNuisance: string,
    niveauDeGene: string,
    origineDeLaNuisance: string,
    descriptionDeLorigineDeLaNuisance: string,
    sourceIndustriellePotentielleDeLaNuisance: string,
    apparentementDeLodeur?: string,
    siAutreApparentementDodeur?: string,
    remarqueCommentaire: string,
    photoUrl: string
  }>;
}

export default defineComponent({
  name: 'NuisanceMap',
  props: {
    start: String,
    end: String
  },
  components: {
    IonModal,
    IonButtons,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonIcon,
    IonAlert
  },
  data(): myData {
    return{
      isAlertDisplayed: false,
      startDate: this.start,
      endDate: this.end,
      map: null,
      center: [43.938, 6.022], // Entrevennes
      clusters: null,
      counter: null,
      numberOfReports: 0,
      isModalOpened: false,
      index: 1,
      selectedDeclarationId: 0,
      details: []
    }
  },
  watch: {
    start(newDate): void {
      this.updateMap('start', newDate);
    },
    end(newDate): void {
      this.updateMap('end', newDate);
    }
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
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
      this.map = L.map('nuisance-map', {
        zoomControl,
        minZoom: zoomLevel,
        maxZoom: 17,
        attributionControl: false,
        tap: false
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

      // Clustering
      this.clusters = new MarkerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50
      });

      // Event handling
      this.map.on('popupopen', () => {
        const legend: HTMLElement = document.querySelector('.counter');
        legend.style.display = 'none';

        setTimeout(() => { // Necessary to fix a problem when the user clicks on a marker when a popup is already opened
          const button: HTMLElement = document.querySelector('button.details');
          button.onclick = this.showDetails;
        }, 300);
      });

      this.map.on('popupclose', () => {
        const legend: HTMLElement = document.querySelector('.counter');
        legend.style.display = 'block';
      });

      // Data
      this.addReportsToMap('Odeur');
      this.addReportsToMap('Bruit');
      this.addReportsToMap('Visuel');
      this.addReportsToMap('Brûlage');
    },
    addReportsToMap(type: string): void {
      let iconFile = '',
          url = '';

      switch (type) {
        case 'Odeur':
          iconFile = '/app/assets/img/odeur.png';
          url = 'https://www.signalair.eu/fr/flux/geojson/gq1jrnp9';
          break;
        case 'Bruit':
          iconFile = '/app/assets/img/son.png';
          url = 'https://www.signalair.eu/fr/flux/geojson/yq7b5jal';
          break;
        case 'Visuel':
          iconFile = '/app/assets/img/visuel.png';
          url = 'https://www.signalair.eu/fr/flux/geojson/28qg73y9';
          break;
        case 'Brûlage':
          iconFile = '/app/assets/img/brulage.png';
          url = 'https://www.signalair.eu/fr/flux/geojson/yib5aa1n';
          break;
      }

      let myIcon = L.icon({
        iconUrl: iconFile,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      axios.get(`${url}/${this.startDate}/${this.endDate}`)
        .then(response => {
          L.geoJSON(response.data, {
            pane: 'icons',
            pointToLayer: (feature, latlng) => {
              return L.marker(latlng, {icon: myIcon});
            },
            onEachFeature: (feature, layer) => {
              this.clusters.addLayer(layer);

              let props = feature.properties,
                  // Perception date/time formatting
                  perceptionDatetime = props.date.split(" "),
                  perceptionDate = perceptionDatetime[0],
                  perceptionTime = perceptionDatetime[1],
                  perceptionDateObj = new Date(perceptionDate),
                  perceptionDateISO = perceptionDateObj.toISOString(),
                  perceptionDateISOSplit1 = perceptionDateISO.split("T")[0],
                  perceptionDateISOSplit2 = perceptionDateISOSplit1.split("-"),
                  perceptionTimeSplit = perceptionTime.split(":"),
                  // Declaration date/time formatting
                  declarationDatetime = props.created_at.split(" "),
                  declarationDate = declarationDatetime[0],
                  declarationTime = declarationDatetime[1],
                  declarationDateObj = new Date(declarationDate),
                  declarationDateISO = declarationDateObj.toISOString(),
                  declarationDateISOSplit1 = declarationDateISO.split("T")[0],
                  declarationDateISOSplit2 = declarationDateISOSplit1.split("-"),
                  declarationTimeSplit = declarationTime.split(":"),
                  // ...
                  depCode = props.citycode.substr(0,2),
                  depName = "";

              switch (depCode) {
                case '04':
                  depName = 'Alpes-de-Haute-Provence';
                  break;
                case '05':
                  depName = 'Hautes-Alpes';
                  break;
                case '06':
                  depName = 'Alpes-Maritimes';
                  break;
                case '13':
                  depName = 'Bouches-du-Rhône';
                  break;
                case '83':
                  depName = 'Var';
                  break;
                case '84':
                  depName = 'Vaucluse';
                  break;
              }

              let details = {
                id: this.index,
                type,
                perceptionDate: `${perceptionDateISOSplit2[2]}/${perceptionDateISOSplit2[1]}/${perceptionDateISOSplit2[0]} à ${perceptionTimeSplit[0]} h ${perceptionTimeSplit[1]}`,
                declarationDate: `${declarationDateISOSplit2[2]}/${declarationDateISOSplit2[1]}/${declarationDateISOSplit2[0]} à ${declarationTimeSplit[0]} h ${declarationTimeSplit[1]}`,
                department: depName,
                zipCode: props.zipcode,
                city: props.city,
                siOuiQuelsSymptomes: props['si-oui-quels-symptomes-'],
                descriptionDesEventuelsAutresSymptomes: props['description-des-eventuels-autres-symptomes'],
                dureeDeLaNuisance: props['duree-de-la-nuisance'],
                niveauDeGene: props['niveau-de-gene'],
                origineDeLaNuisance: props['origine-de-la-nuisance'],
                descriptionDeLorigineDeLaNuisance: props['description-de-lorigine-de-la-nuisance'],
                sourceIndustriellePotentielleDeLaNuisance: props['source-industrielle-potentielle-de-la-nuisance-declaratif-'],
                apparentementDeLodeur: props['apparentement-de-lodeur'],
                siAutreApparentementDodeur: props['si-autre-apparentement-dodeur'],
                remarqueCommentaire: props['remarque-commentaire'],
                photoUrl: props.photographie
              };

              this.details.push(details);

              const html = `<h4>${type}</h4>
                            <hr>
                            <p>Perception le ${perceptionDateISOSplit2[2]}/${perceptionDateISOSplit2[1]}/${perceptionDateISOSplit2[0]} à ${perceptionTimeSplit[0]} h ${perceptionTimeSplit[1]}</p>
                            <button id="details-${this.index}" class="details">Détails</button>`

              layer.bindPopup(html);
              this.index++;
              this.numberOfReports++;
            }
          });

          // Number of reports
          const ctrl = L.control as any;

          if (this.counter) {
            this.map.removeControl(this.counter);
          }

          this.counter = ctrl({ position: 'topleft' });

          this.counter.onAdd = () => {
            let div = L.DomUtil.create('div', 'counter');

            div.innerHTML += this.numberOfReports > 1 ? `${this.numberOfReports} signalements` : `${this.numberOfReports} signalement`;

            return div;
          };

          this.counter.addTo(this.map);
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });

      this.map.addLayer(this.clusters);
    },
    updateMap(limit: string, date: string): void {
      if (limit === 'start') {
        this.startDate = date;
      } else {
        this.endDate = date;
      }

      this.map.removeLayer(this.clusters);
      this.numberOfReports = 0;

      this.clusters = new MarkerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50
      });

      this.addReportsToMap('Odeur');
      this.addReportsToMap('Bruit');
      this.addReportsToMap('Visuel');
      this.addReportsToMap('Brûlage');
    },
    showDetails(e: Event): void {
      this.selectedDeclarationId = parseInt((e.target as HTMLElement).id.split('-')[1]);
      this.isModalOpened = true;
    },
    hideDetails(): void {
      this.isModalOpened = false;
    }
  },
  setup() {
    return {
      close
    };
  },
  mounted() {
    this.setupLeafletMap();
  }
});
</script>

<style>
#nuisance-map {
 width: 100%;
 height: 75%;
}

#nuisance-map .leaflet-popup-content-wrapper, #nuisance-map .leaflet-popup-tip {
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  border-radius: 5px;
}

#nuisance-map .leaflet-popup-content h4 {
  font-size: 1.3em;
  margin-bottom: 5px;
}

#nuisance-map .leaflet-popup-content hr {
  border: solid 1px #e9e9ed;
}

#nuisance-map .leaflet-popup-content p {
  margin: 10px 0;
}

#nuisance-map .counter {
  background-color: white;
  border-radius: 5px;
  padding: 5px;
}

#nuisance-map button.details {
  color: black;
  background-color: #e9e9ed;
  width: 180px;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
}

ion-list-header {
  padding-left: 0;
}
</style>
