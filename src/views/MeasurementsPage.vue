<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Mesures aux stations" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
      <ion-loading :is-open="!areChartsLoaded" message="Veuillez patienter..."></ion-loading>
      <ion-segment v-model="access">
        <ion-segment-button value="station" @click="accessStations()">
          <ion-label>Accès par station</ion-label>
        </ion-segment-button>
        <ion-segment-button value="pollutant" @click="accessPollutants()">
          <ion-label>Accès par polluant</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-chip outline color="dark" @click="showStations()" v-if="access === 'station'">
        <ion-icon :icon="radioOutline"></ion-icon>
        <ion-label>Voir toutes les stations</ion-label>
      </ion-chip>
      <ion-chip outline color="dark" @click="showPollutants()" v-else>
        <ion-icon :icon="flaskOutline"></ion-icon>
        <ion-label>Voir tous les polluants</ion-label>
      </ion-chip>
      <ion-modal class="main-modal" :is-open="isStationsModalOpened">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Stations</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="hideStations()">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content color="light" fullscreen>
          <div id="legend">
            <figure :class="{active: fixedActive, menu: true}" @click="displayStationsOnMap('fixed')">
              <img src="/app/assets/img/station-fixe-active.png" alt="Fixes">
              <figcaption>Fixes</figcaption>
            </figure>
            <figure :class="{active: temporaryActive, menu: true}" @click="displayStationsOnMap('temporary')">
              <img src="/app/assets/img/station-temporaire-active.png" alt="Temporaires">
              <figcaption>Temporaires</figcaption>
            </figure>
            <figure :class="{active: closedActive, menu: true}" @click="displayStationsOnMap('closed')">
              <img src="/app/assets/img/station-inactive.png" alt="Inactives">
              <figcaption>Inactives</figcaption>
            </figure>
          </div>
          <StationsMap :stations="stationsFromAccessByStation" :info="stationInfo" v-if="stationsFromAccessByStation.length > 0" />
          <ion-accordion-group>
            <ion-accordion v-for="station in stationsFromAccessByStation" :key="station.station_id">
              <ion-item slot="header" v-show="checkStation(station)">
                <ion-label class="ion-text-wrap">
                  <h3>{{ station.nom }}</h3>
                </ion-label>
              </ion-item>
              <ion-list class="details" slot="content" v-show="checkStation(station)">
                <ion-item lines="none">
                  <ion-label class="ion-text-wrap">
                    <p><strong>Identifiant :</strong> {{ station.station_id }}</p>
                    <p v-if="station.adresse"><strong>Adresse :</strong> {{ station.adresse }}</p>
                    <p v-if="station.departement_id"><strong>Département :</strong> {{ station.departement_id }}</p>
                    <p v-if="station.etat"><strong>État :</strong> {{ station.etat }}</p>
                    <p v-if="station.typologie"><strong>Typologie :</strong> {{ station.typologie }}</p>
                    <p v-if="station.type_mesure"><strong>Type de mesure :</strong> {{ station.type_mesure }}</p>
                    <p v-if="station.date_debut_mesure"><strong>Date de début de la mesure :</strong> {{ formatDate(station.date_debut_mesure) }}</p>
                    <p v-if="station.date_fin_mesure"><strong>Date de fin de la mesure :</strong> {{ formatDate(station.date_fin_mesure) }}</p>
                    <p v-if="station.latitude"><strong>Latitude :</strong> {{ station.latitude }}</p>
                    <p v-if="station.longitude"><strong>Longitude :</strong> {{ station.longitude }}</p>
                    <p><strong>Polluant<span v-if="station.polluants.length > 1">s</span> mesuré<span v-if="station.polluants.length > 1">s</span> :</strong> <span v-for="(pollutant, i) in station.polluants" :key="pollutant.polluant_id">{{ pollutant.acronyme }}<span v-if="i < station.polluants.length - 1">, </span></span></p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-accordion>
          </ion-accordion-group>
        </ion-content>
      </ion-modal>
      <ion-modal class="main-modal" :is-open="isPollutantsModalOpened">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Polluants</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="hidePollutants()">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content color="light" fullscreen>
          <ion-accordion-group>
            <ion-accordion v-for="pollutant in pollutantsFromAccessByPollutant" :key="pollutant.polluant_id">
              <ion-item slot="header">
                <ion-label class="ion-text-wrap">
                  <h3>{{ pollutant.label }}</h3>
                </ion-label>
              </ion-item>
              <ion-list class="details" slot="content">
                <ion-item lines="none">
                  <ion-label class="ion-text-wrap">
                    <p><strong>Identifiant :</strong> {{ pollutant.polluant_id }}</p>
                    <p v-if="pollutant.acronyme"><strong>Nom court :</strong> {{ pollutant.acronyme }}</p>
                    <p v-if="pollutant.unite"><strong>Unité de mesure :</strong> {{ pollutant.unite }}</p>
                    <p v-if="pollutant.famille_chimique"><strong>Famille chimique :</strong> {{ pollutantsLegend.famille_chimique.find(family => family.id === pollutant.famille_chimique).label }}</p>
                    <p v-if="pollutant.famille_reglementaire"><strong>Famille réglementaire :</strong> {{ pollutantsLegend.famille_reglementaire.find(family => family.id === pollutant.famille_reglementaire).label }}</p>
                    <p><strong>Station<span v-if="pollutant.stations.length > 1">s</span> mesurant ce polluant :</strong> <span v-for="(station, i) in pollutant.stations" :key="station.station_id">{{ station.nom }}<span v-if="i < pollutant.stations.length - 1">, </span></span></p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-accordion>
          </ion-accordion-group>
        </ion-content>
      </ion-modal>
      <ion-item v-if="access === 'station' && stationsFromAccessByStation.length > 0">
        <ion-label>Station</ion-label>
        <ion-select placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="selectedStation" @ionChange="selectStation($event)">
          <ion-select-option v-for="station in stationsFromAccessByStation" :key="station.station_id" :value="station.station_id" :class="station.nom ? (station.nom.length > 25 ? 'radio-wrap' : '') : ''">{{ station.nom }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if="access === 'station' && pollutantsFromAccessByStation.length > 0">
        <ion-label>Polluant(s)</ion-label>
        <ion-select multiple placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="selectedPollutants" @ionChange="changePollutantsInAccessByStation()">
          <ion-select-option v-for="pollutant in pollutantsFromAccessByStation" :key="pollutant.polluant_id" :value="pollutant" :class="pollutant.label.length > 50 ? 'checkbox-wrap' : ''">{{ pollutant.label }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if="access === 'pollutant' && pollutantsFromAccessByPollutant.length > 0">
        <ion-label>Polluant</ion-label>
        <ion-select placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="selectedPollutant" @ionChange="selectPollutant($event)">
          <ion-select-option v-for="pollutant in pollutantsFromAccessByPollutant" :key="pollutant.polluant_id" :value="pollutant" :class="pollutant.label.length > 30 ? 'radio-wrap' : ''">{{ pollutant.label }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if="access === 'pollutant' && stationsFromAccessByPollutant.length > 0">
        <ion-label>Station(s)</ion-label>
        <ion-select multiple placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="selectedStations" @ionChange="changeStationsInAccessByPollutant()">
          <ion-select-option v-for="station in stationsFromAccessByPollutant" :key="station.station_id" :value="station.station_id" :class="station.nom ? (station.nom.length > 25 ? 'checkbox-wrap' : '') : ''">{{ station.nom }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div id="buttons">
        <ion-button id="open-start-modal" color="secondary" fill="outline">
          <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
          Date de début
        </ion-button>
        <ion-modal class="datepicker" trigger="open-start-modal">
          <ion-content force-overscroll="false">
            <ion-datetime presentation="date" :max="endDate" :value="startDate" v-model="startDate"></ion-datetime>
          </ion-content>
        </ion-modal>
        <ion-button id="open-end-modal" color="secondary" fill="outline">
          <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
          Date de fin
        </ion-button>
        <ion-modal class="datepicker" trigger="open-end-modal">
          <ion-content force-overscroll="false">
            <ion-datetime presentation="date" :min="startDate" :max="today()" :value="endDate" v-model="endDate"></ion-datetime>
          </ion-content>
        </ion-modal>
      </div>
      <p id="period">Du <strong>{{ formatStartDate }}</strong> au <strong>{{ formatEndDate }}</strong></p>
      <ion-button id="measurements-btn" expand="block" color="secondary" @click="displayMeasurements()">Afficher les mesures</ion-button>
      <ion-item id="previz" v-if="!measurementsByStation && !measurementsByPollutant">
        <ion-icon :icon="analytics"></ion-icon>
      </ion-item>
      <div v-if="measurementsByStation">
        <ion-card v-for="(selectedPollutant, i) in selectedPollutants" :key="i">
          <ion-card-content>
            <MeasurementsChart :api="measurementsByStation" :station="selectedStation" :pollutant="selectedPollutant" :access="access" :key="key" />
          </ion-card-content>
        </ion-card>
      </div>
      <div v-if="measurementsByPollutant">
        <ion-card v-for="(selectedStation, i) in selectedStations" :key="i">
          <ion-card-content>
            <MeasurementsChart :api="measurementsByPollutant" :pollutant="selectedPollutant" :station="selectedStation" :access="access" :key="key" />
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonAlert, IonProgressBar, IonSegment, IonSegmentButton, IonItem, IonLabel, IonSelect, IonSelectOption, IonButtons, IonButton, IonIcon, IonDatetime, IonLoading, IonCard, IonCardContent, IonChip, IonModal, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
import { calendarOutline, analytics, radioOutline, flaskOutline, close } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import StationsMap from '@/components/StationsMap.vue';
import MeasurementsChart from '@/components/MeasurementsChart.vue';
import axios from 'axios';
import { format } from 'date-fns';

interface myData {
  isAlertDisplayed: boolean;
  isDataLoaded: boolean;
  access: string;
  startDate: string;
  endDate: string;
  stationsFromAccessByStation: [];
  pollutantsFromAccessByStation: [];
  stationsFromAccessByPollutant: [];
  pollutantsFromAccessByPollutant: [];
  pollutantsLegend: any;
  measurementsByStation: any;
  measurementsByPollutant: any;
  selectedStation: string;
  selectedPollutants: [];
  selectedPollutant: any;
  selectedStations: [];
  stationInfo: string;
  areChartsLoaded: boolean;
  isStationsModalOpened: boolean;
  isPollutantsModalOpened: boolean;
  fixedActive: boolean;
  temporaryActive: boolean;
  closedActive: boolean;
  key: number;
}

export default defineComponent({
  name: 'MeasurementsPage',
  components: {
    IonContent,
    IonPage,
    IonAlert,
    IonProgressBar,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonButton,
    IonIcon,
    IonDatetime,
    IonLoading,
    IonCard,
    IonCardContent,
    IonChip,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    HeadingBar,
    StationsMap,
    MeasurementsChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      isDataLoaded: false,
      access: 'station',
      startDate: '',
      endDate: '',
      stationsFromAccessByStation: [],
      pollutantsFromAccessByStation: [],
      stationsFromAccessByPollutant: [],
      pollutantsFromAccessByPollutant: [],
      pollutantsLegend: null,
      measurementsByStation: null,
      measurementsByPollutant: null,
      selectedStation: '',
      selectedPollutants: [],
      selectedPollutant: null,
      selectedStations: [],
      stationInfo: 'fixed',
      areChartsLoaded: true,
      isStationsModalOpened: false,
      isPollutantsModalOpened: false,
      fixedActive: true,
      temporaryActive: false,
      closedActive: false,
      key: 0
    };
  },
  computed: {
    formatStartDate(): string {
      return this.formatDate(this.startDate);
    },
    formatEndDate(): string {
      return this.formatDate(this.endDate);
    }
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
    formatDate(date: string): string {
      return format(new Date(date), 'dd/MM/yyyy');
    },
    today(): string {
      return format(new Date(), 'yyyy-MM-dd');
    },
    yesterday(): string {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      return format(date, 'yyyy-MM-dd');
    },
    checkStation(station: any): boolean {
      if (this.stationInfo === 'fixed' && station.type_mesure === 'Fixe' && station.etat === 'en service') {
        return true;
      } else if (this.stationInfo === 'temporary' && station.type_mesure === 'Temporaire' && station.etat === 'en service') {
        return true;
      } else if (this.stationInfo === 'closed' && station.etat === 'hors service') {
        return true;
      } else {
        return false;
      }
    },
    accessStations(): void {
      this.measurementsByStation = null;
      this.measurementsByPollutant = null;
      this.selectedPollutant = null;
      this.selectedStations = [];
      this.stationsFromAccessByPollutant = [];
    },
    accessPollutants(): void {
      this.measurementsByPollutant = null;
      this.measurementsByStation = null;
      this.selectedStation = '';
      this.selectedPollutants = [];
      this.pollutantsFromAccessByStation = [];
    },
    showStations(): void {
      this.isStationsModalOpened = true;
    },
    hideStations(): void {
      this.isStationsModalOpened = false;
    },
    showPollutants(): void {
      this.isPollutantsModalOpened = true;
    },
    hidePollutants(): void {
      this.isPollutantsModalOpened = false;
    },
    displayStationsOnMap(info: string): void {
      switch (info) {
        case 'fixed':
          this.fixedActive = true;
          this.temporaryActive = false;
          this.closedActive = false;
          break;
        case 'temporary':
          this.fixedActive = false;
          this.temporaryActive = true;
          this.closedActive = false;
          break;
        case 'closed':
          this.fixedActive = false;
          this.temporaryActive = false;
          this.closedActive = true;
          break;
      }

      this.stationInfo = info;
    },
    selectStation(e: CustomEvent): void {
      this.measurementsByStation = null;
      this.selectedPollutants = [];
      this.pollutantsFromAccessByStation = this.stationsFromAccessByStation.find(station => station.station_id === (e.target as any).value).polluants.sort((a, b) => a.label.localeCompare(b.label));
    },
    selectPollutant(e: CustomEvent): void {
      this.measurementsByPollutant = null;
      this.selectedStations = [];
      this.stationsFromAccessByPollutant = this.pollutantsFromAccessByPollutant.find(pollutant => pollutant.polluant_id === (e.target as any).value.polluant_id).stations.sort((a, b) => a.nom.localeCompare(b.nom));
    },
    changePollutantsInAccessByStation(): void {
      this.measurementsByStation = null;
    },
    changeStationsInAccessByPollutant(): void {
      this.measurementsByPollutant = null;
    },
    displayMeasurements(): void {
      this.areChartsLoaded = false;

      let url = '';

      if (this.access === 'station') {
        let selectedPollutantsIds = [];

        for (let selectedPollutant of this.selectedPollutants) {
          selectedPollutantsIds.push(selectedPollutant.polluant_id);
        }

        url = `https://preprod-api.atmosud.org/siam/v1/stations/mesures?date_debut=${this.startDate}&date_fin=${this.endDate}&station_id=${this.selectedStation}&polluant_id=${selectedPollutantsIds.toString()}`;
      } else {
        url = `https://preprod-api.atmosud.org/siam/v1/stations/mesures?date_debut=${this.startDate}&date_fin=${this.endDate}&polluant_id=${this.selectedPollutant.polluant_id}&station_id=${this.selectedStations.toString()}`;
      }

      axios.get(url)
        .then(response => {
          this.key++;

          if (this.access === 'station') {
            this.measurementsByStation = response.data;
          } else {
            this.measurementsByPollutant = response.data;
          }
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        })
        .then(() => {
          this.areChartsLoaded = true;
        });
    }
  },
  setup() {
    return {
      calendarOutline,
      analytics,
      radioOutline,
      flaskOutline,
      close
    };
  },
  beforeMount() {
    this.startDate = this.yesterday();
    this.endDate = this.today();
  },
  mounted() {
    const reqStations = axios.get('https://preprod-api.atmosud.org/siam/v1/stations');
    const reqPollutants = axios.get('https://preprod-api.atmosud.org/siam/v1/polluants');

    axios.all([reqStations, reqPollutants])
      .then(axios.spread((...responses) => {
        const resStations = responses[0];
        const resPollutants = responses[1];

        this.stationsFromAccessByStation = resStations.data.data.stations.sort((a, b) => a.nom ? a.nom.localeCompare(b.nom) : '');
        this.pollutantsFromAccessByPollutant = resPollutants.data.data.polluants.sort((a, b) => a.label ? a.label.localeCompare(b.label) : '');
        this.pollutantsLegend = resPollutants.data.data.legendes.polluants;
      }))
      .catch(() => {
        this.isAlertDisplayed = true;
      })
      .then(() => {
        this.isDataLoaded = true;
      });
  }
});
</script>

<style>
.radio-wrap.alert-tappable.sc-ion-alert-md {
  height: 80px;
}

.checkbox-wrap.alert-tappable.sc-ion-alert-md {
  height: 120px;
}

.alert-radio-label.sc-ion-alert-md,
.alert-checkbox-label.sc-ion-alert-md {
  white-space: normal;
}
</style>

<style scoped>
#buttons {
  display: flex;
  justify-content: center;
  padding: 10px;
}

#period {
  text-align: center;
  margin-top: 0;
}

#measurements-btn {
  width: 90%;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

#previz {
  --min-height: 300px;
  width: 90%;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  border: solid 2px #e8e9ec;
}

#previz ion-icon {
  color: #e8e9ec;
  font-size: 100px;
  margin: auto;
}

#legend {
  font-size: small;
  font-weight: bold;
  text-align: center;
  background-color: white;
  opacity: 1;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  margin: 0;
  width: 100%;
}

#legend figure {
  margin: 6px 12px;
  cursor: pointer;
}

#legend figure img {
  width: 52px;
}

.datepicker {
  --width: 290px;
  --height: 382px;
  --border-radius: 8px;
}

.details {
  background-color: #e8e9ec;
}

.details ion-item {
  --background: #e8e9ec;
}

.menu {
  border: solid 2px #fff;
  padding: 3px;
  border-radius: 10px;
}

.active {
  border-color: var(--ion-color-light);
}

ion-progress-bar {
  position: absolute;
  z-index: 9999;
}

ion-chip {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

ion-modal ion-datetime {
  height: 382px;
}

ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  border-left: solid 10px var(--ion-color-tertiary);
}
</style>
