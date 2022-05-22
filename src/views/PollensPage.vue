<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Pollens" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
      <ion-searchbar placeholder="Entrez une commune..." autocomplete="on" v-model="userInput" @ionChange="getSuggestions()"></ion-searchbar>
      <ion-list id="suggestions" v-if="cities.length !== 0">
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
      <img id="rnsa" src="/assets/img/logo-rnsa.svg">
      <ion-item id="previz" v-if="!selectedCity">
        <ion-icon :icon="flower"></ion-icon>
      </ion-item>
      <ion-card v-else>
        <ion-card-header>
          <ion-card-subtitle>Risque allergique à {{ selectedCity.nom }}</ion-card-subtitle>
          <svg id="main-flower" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 299.36 297.95">
            <path :fill="indexColor" stroke="#000" d="M160.53,286.57a48.9,48.9,0,0,0,9.21-2.87,50.67,50.67,0,0,0,20.74-16.64c.36-.45,2.56-3.89,3.21-3.77a59.27,59.27,0,0,0,69.53-69.42,59.27,59.27,0,0,0,0-98.26,59.27,59.27,0,0,0-69.46-69.5A59.28,59.28,0,0,0,95.64,26,59.27,59.27,0,0,0,26.19,95.37,59.26,59.26,0,0,0,26,193.62a59.26,59.26,0,0,0,69.39,69.57c.26-.05,2.92,4,3.28,4.4,6,7.34,13.51,13.54,22.56,16.74a71.08,71.08,0,0,0,21.53,3.58A75.72,75.72,0,0,0,160.53,286.57ZM240,172.26l-15.43,5.59,6.94,14.87a29.29,29.29,0,0,1-39,38.91l-14.86-7-5.6,15.42a29.39,29.39,0,0,1-27.53,19.28h0A29.4,29.4,0,0,1,117,240l-5.57-15.44L96.6,231.53a29.3,29.3,0,0,1-38.9-39l7-14.86-15.42-5.61A29.29,29.29,0,0,1,49.34,117l15.44-5.57L57.85,96.55A29.29,29.29,0,0,1,96.76,57.63l14.8,6.89,5.62-15.32a29.29,29.29,0,0,1,55,.1l5.6,15.43,14.86-7a29.29,29.29,0,0,1,38.93,39l-7,14.86,15.43,5.6a29.29,29.29,0,0,1,0,55.07Z" transform="translate(0 0)"></path>
          </svg>
          <ion-card-title>{{ indexLevel }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none">
            <ion-label id="period" class="ion-text-wrap">{{ period }}</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-list v-if="taxons.length > 0">
        <ion-item v-for="(taxon, i) in taxons" :key="i">
          <ion-label>
            <h3>{{ taxon.label }}</h3>
          </ion-label>
          <ion-badge slot="end" :class="$style[taxon.styleClass]">{{ taxon.indexTxt }}</ion-badge>
        </ion-item>
      </ion-list>
      <ion-text v-if="recommendations.length > 0">
        <h2>Recommandations</h2>
      </ion-text>
      <ion-list v-if="recommendations.length > 0">
        <ion-item v-for="(recommendation, i) in recommendations" :key="i" lines="none">
          <ion-thumbnail slot="start">
            <img :src="recommendation.picto_url">
          </ion-thumbnail>
          <ion-label class="ion-text-wrap">
            <h3>{{ recommendation.titre }}</h3>
            <p>{{ recommendation.description }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonProgressBar, IonSearchbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonIcon, IonBadge, IonThumbnail, IonAlert } from '@ionic/vue';
import { flower } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import axios from 'axios';

interface myData {
  isAlertDisplayed: boolean;
  userInput: string;
  isDataLoaded: boolean;
  cities: [];
  selectedCity: any;
  indexLevel: string;
  indexColor: string;
  period: string;
  taxons: Array<{
    label: string;
    indexNb: number;
    indexTxt: string;
    styleClass: string;
  }>;
  recommendations: Array<{
    titre: string;
    description: string;
    picto_url: string;
    lien: null;
  }>;
}

export default defineComponent({
  name: 'PollensPage',
  components: {
    IonContent,
    IonPage,
    IonProgressBar,
    IonSearchbar,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonThumbnail,
    IonAlert,
    HeadingBar
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      userInput: '',
      isDataLoaded: true,
      cities: [],
      selectedCity: null,
      indexLevel: '',
      indexColor: '',
      period: '',
      taxons: [],
      recommendations: []
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
            this.isDataLoaded = true;
          })
          .catch(() => {
            this.isAlertDisplayed = true;
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
    showDetails(city: any): void {
      this.selectedCity = city;
      this.cities = [];
      this.userInput = '';

      axios.get(`https://preprod-api.atmosud.org/siam/v1/communes/${this.selectedCity.code}`)
        .then(response => {
          let mainIndex = response.data.data.legendes.indice_pollen.find(i => i.indice === response.data.data.pollens.indice_pollen);

          this.indexLevel = mainIndex.qualificatif;
          this.indexColor = mainIndex.couleur;

          this.period = response.data.data.pollens.periode_validite;

          let arr = [] as any;

          for (let taxon of response.data.data.pollens.taxons) {
            let obj = {} as any;

            obj.label = taxon.label;

            let pollen = response.data.data.legendes.indice_pollen.find(p => p.indice === taxon.indice);

            obj.indexNb = pollen.indice;
            obj.indexTxt = pollen.qualificatif;

            switch (pollen.qualificatif) {
              case 'Nul':
                obj.styleClass = 'zero';
                break;
              case 'Faible':
                obj.styleClass = 'low';
                break;
              case 'Moyen':
                obj.styleClass = 'medium';
                break;
              case 'Elevé':
                obj.styleClass = 'high';
                break;
            }

            arr.push(obj);
          }

          this.recommendations = response.data.data.pollens.recommandations;
          this.taxons = arr;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    }
  },
  setup() {
    return {
      flower
    };
  }
});
</script>

<style>
#rnsa {
  width: 80%;
  display: block;
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

#main-flower {
  width: 30%;
  margin: auto;
  display: block;
}

#period {
  text-align: center;
}

#suggestions {
  position: absolute;
  top: 115px;
  left: 0;
  right: 0;
  z-index: 9999;
  background: initial;
}

.ios #suggestions {
  top: 103px;
}
</style>

<style module scoped>
.zero {
  --color: black;
  --background: #fff;
  border: solid 1px black;
}

.low {
  --background: #377d22;
}

.medium {
  --color: black;
  --background: #fffd54;
}

.high {
  --background: #ea3522;
}

ion-progress-bar {
  position: absolute;
  z-index: 9999;
}

ion-card-header {
  padding-bottom: 0;
}

ion-card-title {
  text-align: center;
}

ion-card-subtitle {
  text-align: center;
  margin-bottom: 20px;
}
</style>
