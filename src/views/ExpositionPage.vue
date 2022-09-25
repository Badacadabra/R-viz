<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Exposition chronique" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
      <ion-loading :is-open="!isChartLoaded" message="Veuillez patienter..."></ion-loading>
      <ion-segment :value="scope" v-model="scope">
        <ion-segment-button value="city" layout="icon-start">
          <ion-label>Commune</ion-label>
          <ion-icon :icon="storefrontOutline"></ion-icon>
        </ion-segment-button>
        <ion-segment-button value="epci" layout="icon-start">
          <ion-label>EPCI</ion-label>
          <ion-icon :icon="businessOutline"></ion-icon>
        </ion-segment-button>
        <ion-segment-button value="department" layout="icon-start">
          <ion-label>Département</ion-label>
          <ion-icon :icon="trailSignOutline"></ion-icon>
        </ion-segment-button>
      </ion-segment>
      <ion-searchbar placeholder="Entrez une commune..." autocomplete="on" v-model="userInput" v-if="scope === 'city'" @ionChange="getSuggestions()"></ion-searchbar>
      <ion-list id="suggestions" v-if="cities.length !== 0">
        <div v-for="city in cities" :key="city.code">
          <ion-item :button="true" @click="selectCity(city)">
            <ion-label class="ion-text-wrap">
              <h3>{{ city.nom }}</h3>
              <p>{{ city.departement.nom }}</p>
            </ion-label>
            <ion-icon :icon="locationOutline" slot="end"></ion-icon>
          </ion-item>
        </div>
      </ion-list>
      <ion-item v-if="scope === 'epci'">
        <ion-label>Nom</ion-label>
        <ion-select ok-text="OK" cancel-text="Annuler" :value="selectedEpci" v-model="selectedEpci">
          <ion-select-option v-for="epci in epciList" :key="epci.code_territoire" :value="epci.code_territoire" class="radio-wrap">{{ epci.nom_territoire }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if="scope === 'department'">
        <ion-label>Nom</ion-label>
        <ion-select interface="popover" :value="selectedDepartment" v-model="selectedDepartment">
          <ion-select-option value="04">Alpes-de-Haute-Provence</ion-select-option>
          <ion-select-option value="06">Alpes-Maritimes</ion-select-option>
          <ion-select-option value="13">Bouches-du-Rhône</ion-select-option>
          <ion-select-option value="05">Hautes-Alpes</ion-select-option>
          <ion-select-option value="83">Var</ion-select-option>
          <ion-select-option value="84">Vaucluse</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-chip :disabled="true" v-if="scope === 'city' && selectedCity">
        <ion-icon :icon="locationOutline"></ion-icon>
        <ion-label>{{ selectedCity.nom }}</ion-label>
      </ion-chip>
      <ion-item id="select-pollutant">
        <ion-label>Polluant</ion-label>
        <ion-select interface="popover" :value="selectedPollutant" v-model="selectedPollutant">
          <ion-select-option value="PM10">PM10</ion-select-option>
          <ion-select-option value="PM2.5">PM2.5</ion-select-option>
          <ion-select-option value="O3">O₃</ion-select-option>
          <ion-select-option value="NO2">NO₂</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item id="select-threshold">
        <ion-label>Seuil</ion-label>
        <ion-select interface="popover" :value="selectedThreshold" v-model="selectedThreshold">
          <ion-select-option value="VL">Valeur limite</ion-select-option>
          <ion-select-option value="VC">Valeur cible</ion-select-option>
          <ion-select-option value="LD">Ligne directrice</ion-select-option>
          <ion-select-option value="Veg">Végétation</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-button color="secondary" expand="block" @click="displayData()">Visualiser les données</ion-button>
      <ion-item id="previz" v-if="!expositionApiData">
        <ion-icon :icon="barChart"></ion-icon>
      </ion-item>
      <ExpositionChart :api="expositionApiData" :pollutant="selectedPollutant" :threshold="selectedThreshold" :scope="scope" :city="selectedCity" :epci="selectedEpci" :department="selectedDepartment" v-if="expositionApiData && selectedPollutant && selectedThreshold && scope" :key="key" @chart-ready="chartIsReady()" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonSegment, IonSegmentButton, IonSearchbar, IonList, IonItem, IonLabel, IonIcon, IonChip, IonSelect, IonSelectOption, IonProgressBar, IonLoading, IonAlert } from '@ionic/vue';
import { storefrontOutline, businessOutline, trailSignOutline, locationOutline, barChart } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import ExpositionChart from '@/components/ExpositionChart.vue';
import axios from 'axios';

interface myData {
  isAlertDisplayed: boolean;
  scope: string;
  isDataLoaded: boolean;
  userInput: string;
  selectedCity: any;
  selectedEpci: string;
  cities: [];
  epciList: [];
  expositionApiData: any;
  selectedPollutant: string;
  selectedThreshold: string;
  selectedDepartment: string;
  isChartLoaded: boolean;
  key: number;
}

export default defineComponent({
  name: 'ExpositionPage',
  components: {
    IonContent,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonChip,
    IonSelect,
    IonSelectOption,
    IonProgressBar,
    IonLoading,
    IonAlert,
    HeadingBar,
    ExpositionChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      scope: 'city',
      isDataLoaded: true,
      userInput: '',
      selectedCity: null,
      selectedEpci: '200054807', // AMP
      cities: [],
      epciList: [],
      expositionApiData: null,
      selectedPollutant: 'PM10',
      selectedThreshold: 'VL',
      selectedDepartment: '13',
      isChartLoaded: true,
      key: 0
    };
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
    getSuggestions(): void {
      this.isDataLoaded = false;

      if (this.userInput.length > 2) {
        axios.get(`https://geo.api.gouv.fr/communes?nom=${this.escapeHtml(this.userInput)}&codeRegion=93&fields=departement&limit=7`)
          .then(response => {
            this.cities = response.data;
          })
          .catch(() => {
            this.isAlertDisplayed = true;
          })
          .then(() => {
            this.isDataLoaded = true;
          });
      } else {
        this.cities = [];
        this.isDataLoaded = true;
      }
    },
    escapeHtml(text: string): string {
      const map: {'&': string, '<': string, '>': string, ' ': string} = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        ' ': '+'
      };

      return text.replace(/[&<> ]/g, m => map[m]);
    },
    selectCity(city: any): void {
      this.selectedCity = city;
      this.cities = [];
      this.userInput = '';
    },
    displayData(): void {
      this.isChartLoaded = false;

      let url = '';

      if (this.scope === 'city') {
        url = `https://api.atmosud.org/exposition/commune/series_annuelles/${this.selectedCity.code}?format=json`;
      }

      if (this.scope === 'epci') {
        url = `https://api.atmosud.org/exposition/epci/series_annuelles/${this.selectedEpci}?format=json`;
      }

      if (this.scope === 'department') {
        url = `https://api.atmosud.org/exposition/departement/series_annuelles/${this.selectedDepartment}?format=json`;
      }

      axios.get(url)
        .then(response => {
          this.expositionApiData = response.data;
          this.key++;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        })
        .then(() => {
          this.isChartLoaded = true;
        });
    },
    chartIsReady(): void {
      this.isChartLoaded = true;
    }
  },
  setup() {
    return {
      storefrontOutline,
      businessOutline,
      trailSignOutline,
      locationOutline,
      barChart
    }
  },
  mounted() {
    this.selectedCity = {
      nom: 'Marseille',
      code: '13055',
      departement: {
        code: '13',
        nom: 'Bouches-du-Rhône'
      }
    };

    axios.get('https://api.atmosud.org/referentiel/territoires?rang=3')
      .then(response => {
        this.epciList = response.data.sort((a, b) => a.nom_territoire.localeCompare(b.nom_territoire));
      })
      .catch(() => {
        this.isAlertDisplayed = true;
      });
  },
  watch: {
    scope() {
      this.expositionApiData = null;
    }
  },
});
</script>

<style>
.radio-wrap.alert-tappable.sc-ion-alert-md {
  height: 80px;
}

.alert-radio-label.sc-ion-alert-md {
  white-space: normal;
}
</style>

<style scoped>
#select-pollutant {
  --background: #e8e9ec;
}

#select-threshold {
  --background: #e8e9ec;
}

#previz {
  --min-height: 300px;
  width: 90%;
  margin-top: 20px;
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

#suggestions {
  position: absolute;
  width: 100%;
  z-index: 9999;
  background: initial;
}

ion-progress-bar {
  position: absolute;
  z-index: 9999;
}

ion-chip {
  display: flex;
  justify-content: center;
  width: 80%;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}

ion-button {
  width: 80%;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>
