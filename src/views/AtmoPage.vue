<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Indice ATMO" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
      <ion-loading :is-open="!isMapLoaded && !isModalOpened" message="Veuillez patienter..."></ion-loading>
      <ion-searchbar placeholder="Entrez une commune..." autocomplete="on" v-model="userInput" @ionChange="getSuggestions()"></ion-searchbar>
      <ion-list id="suggestions" v-if="userInput && cities.length > 0">
        <div v-for="city in cities" :key="city.code">
          <ion-item :button="true" @click="showDetails(city)">
            <ion-label class="ion-text-wrap">
              <h3>{{ city.nom }}</h3>
              <p>{{ city.departement.nom }}</p>
            </ion-label>
            <ion-icon :icon="locationOutline" slot="end"></ion-icon>
          </ion-item>
        </div>
      </ion-list>
      <ion-segment :value="day" @ionChange="!isModalOpened ? { ionChange: getDayAndDate($event) } : null">
        <ion-segment-button value="today">
          <ion-label>Aujourd'hui</ion-label>
        </ion-segment-button>
        <ion-segment-button value="tomorrow">
          <ion-label>Demain</ion-label>
        </ion-segment-button>
        <ion-segment-button value="dayAfterTomorrow" v-if="j2isAvailable">
          <ion-label>Après-demain</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-accordion-group>
        <ion-accordion>
          <ion-item slot="header">
            <ion-label>Commentaire régional</ion-label>
          </ion-item>
          <ion-item slot="content">
            <ion-label id="comment-content" class="ion-text-wrap" v-if="regionalComments">{{ regionalComments[currentDate] }}</ion-label>
          </ion-item>
        </ion-accordion>
      </ion-accordion-group>
      <AtmoMap :date="currentDate" v-if="currentDate" @map-ready="mapIsReady()" @click-on-city="showDetailsFromMap" />
    </ion-content>
    <ion-modal class="main-modal" :is-open="isModalOpened" v-if="selectedCity">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Détails</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="hideDetails()">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content color="light" fullscreen>
        <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
        <ion-item>
          <ion-label class="ion-text-wrap">
            <h3>{{ selectedCity.nom }}</h3>
            <p>{{ selectedCity.departement.nom }}</p>
          </ion-label>
          <ion-icon :icon="locationOutline" slot="end"></ion-icon>
        </ion-item>
        <ion-segment :value="day" @ionChange="changeDateInDetails($event)">
          <ion-segment-button value="today">
            <ion-label>Aujourd'hui</ion-label>
          </ion-segment-button>
          <ion-segment-button value="tomorrow">
            <ion-label>Demain</ion-label>
          </ion-segment-button>
          <ion-segment-button value="dayAfterTomorrow" v-if="j2isAvailable">
            <ion-label>Après-demain</ion-label>
          </ion-segment-button>
        </ion-segment>
        <GaugeChart :index="indexLevel" v-if="indexLevel" :key="key" />
        <ion-list>
          <ion-item v-for="subIndex in subIndices" :key="subIndex.pollutantCode">
            <ion-label>
              <h3 v-html="subIndex.pollutantShortName"></h3>
            </ion-label>
            <ion-badge slot="end" :class="$style[subIndex.styleClass]">{{ subIndex.indexLabel }}</ion-badge>
          </ion-item>
        </ion-list>
        <ion-text>
          <h2>Recommandations</h2>
        </ion-text>
        <ion-list>
          <ion-item v-for="recommendation in recommendations" :key="recommendation.ordre" lines="none">
            <ion-thumbnail slot="start">
              <img :src="recommendation.picto_url" :alt="recommendation.titre">
            </ion-thumbnail>
            <ion-label class="ion-text-wrap">
              <h3>{{ recommendation.titre }}</h3>
              <p>{{ recommendation.description }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonSearchbar, IonIcon, IonList, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSegment, IonSegmentButton, IonProgressBar, IonLoading, IonAccordionGroup, IonAccordion, IonThumbnail, IonAlert } from '@ionic/vue';
import { close, locationOutline } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import AtmoMap from '@/components/AtmoMap.vue';
import GaugeChart from '@/components/GaugeChart.vue';
import axios from 'axios';
import { format, add } from 'date-fns';

interface myData {
  isAlertDisplayed: boolean;
  userInput: string;
  cities: [];
  isModalOpened: boolean;
  selectedCity: any;
  isDataLoaded: boolean;
  isMapLoaded: boolean;
  j2isAvailable: boolean;
  key: number;
  day: string;
  currentDate: string;
  regionalComments: any;
  indexLevel: string;
  subIndices: Array<{
    pollutantCode: string,
    pollutantName: string,
    pollutantShortName: string,
    indexLabel: string,
    indexImg: string,
    styleClass: string
  }>;
  recommendations: Array<{
    titre: string;
    description: string;
    picto_url: string;
    lien: null;
    ordre: number;
  }>;
}

export default defineComponent({
  name: 'AtmoPage',
  components: {
    IonContent,
    IonPage,
    IonSearchbar,
    IonIcon,
    IonList,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonProgressBar,
    IonLoading,
    IonAccordionGroup,
    IonAccordion,
    IonThumbnail,
    IonAlert,
    HeadingBar,
    AtmoMap,
    GaugeChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      userInput: '',
      cities: [],
      isModalOpened: false,
      selectedCity: null,
      isDataLoaded: true,
      isMapLoaded: false,
      j2isAvailable: false,
      key: 0,
      day: 'today',
      currentDate: '',
      regionalComments: null,
      indexLevel: '',
      subIndices: [],
      recommendations: []
    }
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
            this.isDataLoaded = true;
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
    mapIsReady(): void {
      this.isMapLoaded = true;
    },
    updateMap():void {
      this.isMapLoaded = false;
    },
    getDayAndDate(e: CustomEvent): void {
      this.day = e ? (e.target as any).value : this.day;

      switch (this.day) {
        case 'today':
          this.currentDate = format(new Date(), 'yyyy-MM-dd');
          break;
        case 'tomorrow':
          this.currentDate = format(add(new Date(), { days: 1 }), 'yyyy-MM-dd');
          break;
        case 'dayAfterTomorrow':
          this.currentDate = format(add(new Date(), { days: 2 }), 'yyyy-MM-dd');
          break;
      }

      if (!this.selectedCity) {
        this.updateMap();
      }
    },
    getRegionalComments(): void {
      axios.get('https://api.atmosud.org/siam/v1/accueil')
        .then(response => {
          this.regionalComments = response.data.data.commentaires;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    },
    showDetails(city: any): void {
      this.selectedCity = city;
      this.changeDateInDetails();
    },
    showDetailsFromMap(inseeCode: string): void {
      axios.get(`https://geo.api.gouv.fr/communes?code=${inseeCode}&fields=departement`)
        .then(response => {
          this.selectedCity = response.data[0];
          this.changeDateInDetails();
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    },
    hideDetails(): void {
      this.isModalOpened = false;
      this.selectedCity = null;
    },
    changeDateInDetails(e: CustomEvent): void {
      this.isDataLoaded = false;
      this.getDayAndDate(e);

      axios.get(`https://api.atmosud.org/siam/v1/communes/${this.selectedCity.code}`)
        .then(response => {
          this.indexLevel = response.data.data.legendes.indice_atmo.find(i => i.indice === Math.trunc(response.data.data.indices_atmo[this.currentDate].indice_atmo)).qualificatif;

          let arr = [] as any;

          for (let subIndex of response.data.data.indices_atmo[this.currentDate].sous_indices) {
            let obj = {} as any;

            let pollutant = response.data.data.legendes.polluants.find(poll => poll.code_polluant_eu === subIndex.code_polluant_eu);

            obj.pollutantCode = pollutant.code_polluant_eu;
            obj.pollutantName = pollutant.label;
            obj.pollutantShortName = pollutant.acronyme;

            let index = response.data.data.legendes.indice_atmo.find(i => i.indice === Math.trunc(subIndex.indice_atmo));

            obj.indexLabel = index.qualificatif;
            obj.indexImg = index.picto_url;

            switch (index.qualificatif) {
              case 'Bon':
                obj.styleClass = 'good';
                break;
              case 'Moyen':
                obj.styleClass = 'medium';
                break;
              case 'Dégradé':
                obj.styleClass = 'degraded';
                break;
              case 'Mauvais':
                obj.styleClass = 'bad';
                break;
              case 'Très mauvais':
                obj.styleClass = 'veryBad';
                break;
              case 'Extrêmement mauvais':
                obj.styleClass = 'extremelyBad';
                break;
            }

            arr.push(obj);
          }

          this.recommendations = response.data.data.indices_atmo[this.currentDate].recommandations;

          this.key++;
          this.subIndices = arr;
          this.isDataLoaded = true;
          this.isModalOpened = true;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    },
    checkJ2(): void {
      const dayAfterTomorrow = format(add(new Date(), { days: 2 }), 'yyyy-MM-dd'),
            url = 'https://api.atmosud.org/siam/v1/accueil';

      axios.get(url)
        .then(response => {
          if (response.data.data.cartes.communes['13055'][dayAfterTomorrow]) {
            this.j2isAvailable = true;
          }
        });
    }
  },
  setup() {
    return {
      close,
      locationOutline
    };
  },
  mounted() {
    this.getDayAndDate();
    this.getRegionalComments();
    this.checkJ2();
  }
});
</script>

<style>
#suggestions {
  position: absolute;
  top: 115px;
  left: 0;
  right: 0;
  z-index: 9999;
  background: initial;
}

#comment-content {
  font-size: small;
}

.ios #suggestions {
  top: 103px;
}
</style>

<style module scoped>
.good {
  --background: #50f0e6;
}

.medium {
  --background: #50ccaa;
}

.degraded {
  --background: #f0e641;
}

.bad {
  --background: #ff5050;
}

.veryBad {
  --background: #960032;
}

.extremelyBad {
  --background: #872181;
}

ion-progress-bar {
  position: absolute;
  z-index: 9999;
}
</style>
