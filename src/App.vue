<template>
  <ion-app>
    <ion-split-pane content-id="main">
      <ion-menu side="start" content-id="main">
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>Catalogue de données</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list id="menu">
            <ion-item button @click="() => router.push('/atmo')">
              <ion-icon :icon="ellipseOutline" slot="start" size="large"></ion-icon>
              <ion-label>Indice ATMO</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/previsions')">
              <ion-icon :icon="layersOutline" slot="start" size="large"></ion-icon>
              <ion-label>Prévisions détaillées</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/pollens')">
              <ion-icon :icon="flowerOutline" slot="start" size="large"></ion-icon>
              <ion-label>Indice pollinique</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/mesures')">
              <ion-icon :icon="analyticsOutline" slot="start" size="large"></ion-icon>
              <ion-label>Mesures aux stations</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/episodes')">
              <ion-icon :icon="warningOutline" slot="start" size="large"></ion-icon>
              <ion-label>Épisodes de pollution</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/cartes')">
              <ion-icon :icon="mapOutline" slot="start" size="large"></ion-icon>
              <ion-label>Cartes annuelles</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/exposition')">
              <ion-icon :icon="bodyOutline" slot="start" size="large"></ion-icon>
              <ion-label>Exposition des populations</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/emissions')">
              <ion-icon :icon="cloudyOutline" slot="start" size="large"></ion-icon>
              <ion-label>Émissions polluantes</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/microcapteurs')">
              <ion-icon :icon="pulseOutline" slot="start" size="large"></ion-icon>
              <ion-label>Microcapteurs</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/nuisances')">
              <ion-icon :icon="flagOutline" slot="start" size="large"></ion-icon>
              <ion-label>Signalements de nuisances</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main"></ion-router-outlet>
      <ion-menu side="end" content-id="main">
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>Catalogue de services</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content :key="key">
          <div v-if="route.name === 'Home'">
            <ion-card class="services" href="https://api.atmosud.org" target="_blank">
              <ion-img src="/app/assets/img/api.png"></ion-img>
              <ion-card-header>
                <ion-card-title>APIs</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                APIs d'AtmoSud à destination des développeurs
              </ion-card-content>
            </ion-card>
            <ion-card class="services" href="https://cigale.atmosud.org/" target="_blank">
              <ion-img src="/app/assets/img/cigale.png"></ion-img>
              <ion-card-header>
                <ion-card-title>CIGALE</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Inventaires géolocalisés air-climat-énergie en Région Sud
              </ion-card-content>
            </ion-card>
            <ion-card class="services" href="https://www.signalair.eu/fr/" target="_blank">
              <ion-img src="/app/assets/img/signalair.png"></ion-img>
              <ion-card-header>
                <ion-card-title>SignalAir</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Application de signalement des nuisances
              </ion-card-content>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Atmo'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Flux de données</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                APIs REST pour les développeurs
              </ion-card-content>
              <ion-list>
                <ion-item href="https://api.atmosud.org/iqa/" target="_blank">
                  <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                  <ion-label>Ancien IQA (avant 2021)</ion-label>
                  <ion-note slot="end">api.atmosud.org</ion-note>
                </ion-item>
                <ion-item href="https://api.atmosud.org/iqa2021/" target="_blank">
                  <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                  <ion-label>Nouvel IQA (depuis 2021)</ion-label>
                  <ion-note slot="end">api.atmosud.org</ion-note>
                </ion-item>
              </ion-list>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Interface de téléchargement</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Téléchargement de l'historique des indices (2021) au format CSV
              </ion-card-content>
              <ion-item href="https://servicedata.atmosud.org/historique-indices" target="_blank">
                <ion-icon :icon="downloadOutline" slot="start" size="small"></ion-icon>
                <ion-label>Télécharger les données</ion-label>
                <ion-note slot="end">servicedata.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Forecasts'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Accès aux cartes</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Récupération des cartes quotidiennes à partir du GeoServer
              </ion-card-content>
              <ion-accordion-group value="first">
                <ion-accordion value="first">
                  <ion-item slot="header" color="light">
                    <ion-label>Aujourd'hui</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item :href="multiForecastsRasterUrlD0" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Multi-polluant</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="o3ForecastsRasterUrlD0" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Ozone</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="no2ForecastsRasterUrlD0" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Dioxyde d'azote</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="pm25ForecastsRasterUrlD0" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM2.5</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="pm10ForecastsRasterUrlD0" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM10</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="second">
                  <ion-item slot="header" color="light">
                    <ion-label>Demain</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item :href="multiForecastsRasterUrlD1" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Multi-polluant</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="o3ForecastsRasterUrlD1" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Ozone</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="no2ForecastsRasterUrlD1" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Dioxyde d'azote</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="pm25ForecastsRasterUrlD1" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM2.5</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="pm10ForecastsRasterUrlD1" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM10</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="third">
                  <ion-item slot="header" color="light">
                    <ion-label>Après-demain</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item :href="multiForecastsRasterUrlD2" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Multi-polluant</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="o3ForecastsRasterUrlD2" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Ozone</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="no2ForecastsRasterUrlD2" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Dioxyde d'azote</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="pm25ForecastsRasterUrlD2" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM2.5</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="pm10ForecastsRasterUrlD2" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM10</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Flux de données</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                API REST pour les développeurs
              </ion-card-content>
              <ion-item href="https://api.atmosud.org/prevision/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Prévisions de la qualité de l'air</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Pollens'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Données du RNSA</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Liens utiles
              </ion-card-content>
              <ion-item href="https://pollens.fr/" target="_blank">
                <ion-icon :icon="linkOutline" slot="start" size="small"></ion-icon>
                <ion-label>Site web du RNSA</ion-label>
                <ion-note slot="end">pollens.fr</ion-note>
              </ion-item>
              <ion-item href="https://rnsa-oberon.fr/" target="_blank">
                <ion-icon :icon="linkOutline" slot="start" size="small"></ion-icon>
                <ion-label>RNSA Oberon</ion-label>
                <ion-note slot="end">rnsa-oberon.fr</ion-note>
              </ion-item>
            </ion-card>
            <ion-card class="services" href="https://www.signalair.eu/fr/" target="_blank">
              <ion-img src="/app/assets/img/signalair.png"></ion-img>
              <ion-card-header>
                <ion-card-title>SignalAir</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Application de signalement des nuisances
              </ion-card-content>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Measurements'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Flux de données</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                API REST pour les développeurs
              </ion-card-content>
              <ion-item href="https://api.atmosud.org/observations/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Données de mesure</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Interface de téléchargement</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Téléchargement des données de mesure au format CSV
              </ion-card-content>
              <ion-item href="https://servicedata.atmosud.org/donnees-stations" target="_blank">
                <ion-icon :icon="downloadOutline" slot="start" size="small"></ion-icon>
                <ion-label>Télécharger les données</ion-label>
                <ion-note slot="end">servicedata.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Métadonnées</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Informations complémentaires
              </ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-label>
                    <h3>Couverture géographique</h3>
                    <p>Territoire de compétence</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Granularité de la couverture territoriale</h3>
                    <p>Point d'intérêt (POI)</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de création</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de publication ou de moissonnage du catalogue d'origine</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de dernière modification</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Fréquence de mise à jour</h3>
                    <p>Horaire | Journalière | Mensuelle | Annuelle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Type de données</h3>
                    <p>Données ouvertes, données intelligentes, données géographiques</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Propriétaire</h3>
                    <p>Service mesure d'AtmoSud</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>E-mail du propriétaire</h3>
                    <p><a href="mailto:opendata@atmosud.org">opendata@atmosud.org</a></p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Episodes'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Flux de données</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                APIs REST pour les développeurs
              </ion-card-content>
              <ion-item href="https://api.atmosud.org/episodes/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Dispositifs préfectoraux</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="https://api.atmosud.org/episodes/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Épisodes de pollution observés</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Interface de consultation et de téléchargement</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Voir et télécharger en CSV la liste des dispositifs préfectoraux
              </ion-card-content>
              <ion-item href="https://servicedata.atmosud.org/dispositifs-prefectoraux" target="_blank">
                <ion-icon :icon="downloadOutline" slot="start" size="small"></ion-icon>
                <ion-label>Dispositifs préfectoraux</ion-label>
                <ion-note slot="end">servicedata.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Métadonnées</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Informations complémentaires
              </ion-card-content>
              <ion-item>
                <ion-label>
                  <h3>Couverture géographique</h3>
                  <p>Territoire de compétence</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Granularité de la couverture principale</h3>
                  <p>Indéfinie</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Date de création</h3>
                  <p>YYYY-MM-DD</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Date de publication ou de moissonnage du catalogue d'origine</h3>
                  <p>YYYY-MM-DD</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Date de dernière modification</h3>
                  <p>YYYY-MM-DD</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Fréquence de mise à jour</h3>
                  <p>Journalière</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Type de données</h3>
                  <p>Données ouvertes, données intelligentes, données géographiques</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Propriétaire</h3>
                  <p>Service études d'AtmoSud</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>E-mail du propriétaire</h3>
                  <p><a href="mailto:opendata@atmosud.org">opendata@atmosud.org</a></p>
                </ion-label>
              </ion-item>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Maps'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Accès aux cartes</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Récupération des cartes annuelles à partir du GeoServer
              </ion-card-content>
              <ion-accordion-group>
                <ion-accordion v-for="(year, i) in annualMapsYears" :key="i">
                  <ion-item slot="header" color="light">
                    <ion-label>{{ year }}</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item :href="getAnnualRasterUrl('icair365', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>ICAIR 365</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="getAnnualRasterUrl('o3_p932m8hj', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Ozone (p932m8hj)</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="getAnnualRasterUrl('o3_pic', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Ozone (pic)</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="getAnnualRasterUrl('no2_moyan', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Dioxyde d'azote (moyan)</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="getAnnualRasterUrl('pm25_moyan', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM2.5 (moyan)</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="getAnnualRasterUrl('pm10_moyan', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM10 (moyan)</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                      <ion-item :href="getAnnualRasterUrl('pm10_p90j', year)" target="_blank">
                        <ion-icon :icon="imageOutline" slot="start" size="small"></ion-icon>
                        <ion-label>Particules PM10 (p90j)</ion-label>
                        <ion-note slot="end">geoservices.atmosud.org</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Nomenclature</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Description des différentes métriques, avec seuils et valeurs.
              </ion-card-content>
              <ion-accordion-group>
                <ion-accordion value="first">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS NO<sub>2</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="second">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 3 OMS NO<sub>2</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI3</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="third">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 2 OMS NO<sub>2</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fourth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite NO<sub>2</sub> (et Cible intermédiaire OMS 1)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1/VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fifth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible O<sub>3</sub> (sur 1 an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3p93</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="sixth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible O<sub>3</sub> (sur 3 ans)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3p93 3a</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="seventh">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS O<sub>3</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3 pic saisonnier</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="eighth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 2 OMS O<sub>3</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3 pic saisonnier</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="ninth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 1 OMS O<sub>3</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3 pic saisonnier</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="tenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="eleventh">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 4 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI4</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twelfth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 3 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI3</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="thirteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite PM10 (en moyenne annuelle)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fourteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 2 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fifteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 1 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="sixteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite PM10 (en moy. journalière, max 35 j/an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10p90</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="seventeenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="eighteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 4 OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI4</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="nineteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 3 OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI3</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentieth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite PM2.5 (et cible intermédiaire 2 OMS)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2/VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentyfirst">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 1 OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentysecond">
                  <ion-item slot="header" color="light">
                    <ion-label>Objectif à long terme écosystèmes O<sub>3</sub> (sur 1 an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">OLT</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentythird">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible écosystèmes O<sub>3</sub> (sur 1 an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentyfourth">
                  <ion-item slot="header" color="light">
                    <ion-label>Objectif à long terme écosystèmes O<sub>3</sub> (sur 5 ans)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40 5a</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">OLT</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentyfifth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible écosystèmes O<sub>3</sub> (sur 5 ans)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40 5a</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Métadonnées</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Informations complémentaires
              </ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-label>
                    <h3>Couverture géographique</h3>
                    <p>Territoire de compétence</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Granularité de la couverture territoriale</h3>
                    <p>Indéfinie</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de création</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de publication ou de moissonnage du catalogue d'origine</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de dernière modification</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Fréquence de mise à jour</h3>
                    <p>Annuelle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Type de données</h3>
                    <p>Données ouvertes, données géographiques</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Propriétaire</h3>
                    <p>Service modélisation d'AtmoSud</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>E-mail du propriétaire</h3>
                    <p><a href="mailto:opendata@atmosud.org">opendata@atmosud.org</a></p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Exposition'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Flux de données</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                APIs REST pour les développeurs
              </ion-card-content>
              <ion-item href="https://api.atmosud.org/exposition/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Exposition à la commune</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="#" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Exposition à l'unité urbaine</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="https://api.atmosud.org/exposition/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Exposition à l'EPCI</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="https://api.atmosud.org/exposition/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Exposition au département</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="#" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Exposition à la ZAS</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Nomenclature</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Description des différentes métriques, avec seuils et valeurs.
              </ion-card-content>
              <ion-accordion-group>
                <ion-accordion value="first">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS NO<sub>2</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="second">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 3 OMS NO<sub>2</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI3</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="third">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 2 OMS NO<sub>2</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fourth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite NO<sub>2</sub> (et Cible intermédiaire OMS 1)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">NO2moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1/VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fifth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible O<sub>3</sub> (sur 1 an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3p93</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="sixth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible O<sub>3</sub> (sur 3 ans)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3p93 3a</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="seventh">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS O<sub>3</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3 pic saisonnier</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="eighth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 2 OMS O<sub>3</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3 pic saisonnier</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="ninth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 1 OMS O<sub>3</sub></ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3 pic saisonnier</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="tenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="eleventh">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 4 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI4</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twelfth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 3 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI3</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="thirteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite PM10 (en moyenne annuelle)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fourteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 2 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="fifteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 1 OMS PM10</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="sixteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite PM10 (en moy. journalière, max 35 j/an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM10p90</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="seventeenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Ligne directrice OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">LD</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="eighteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 4 OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI4</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="nineteenth">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 3 OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI3</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentieth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur limite PM2.5 (et cible intermédiaire 2 OMS)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI2/VL</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentyfirst">
                  <ion-item slot="header" color="light">
                    <ion-label>Cible intermédiaire 1 OMS PM2.5</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">PM2.5moy</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">CI1</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentysecond">
                  <ion-item slot="header" color="light">
                    <ion-label>Objectif à long terme écosystèmes O<sub>3</sub> (sur 1 an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">OLT</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentythird">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible écosystèmes O<sub>3</sub> (sur 1 an)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentyfourth">
                  <ion-item slot="header" color="light">
                    <ion-label>Objectif à long terme écosystèmes O<sub>3</sub> (sur 5 ans)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40 5a</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">OLT</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
                <ion-accordion value="twentyfifth">
                  <ion-item slot="header" color="light">
                    <ion-label>Valeur cible écosystèmes O<sub>3</sub> (sur 5 ans)</ion-label>
                  </ion-item>
                  <div slot="content">
                    <ion-list>
                      <ion-item>
                        <ion-label>Métrique</ion-label>
                        <ion-note slot="end">O3aot40 5a</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Seuil</ion-label>
                        <ion-note slot="end">VC</ion-note>
                      </ion-item>
                      <ion-item>
                        <ion-label>Valeur</ion-label>
                        <ion-note slot="end">X</ion-note>
                      </ion-item>
                    </ion-list>
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Métadonnées</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Informations complémentaires
              </ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-label>
                    <h3>Couverture géographique</h3>
                    <p>Territoire de compétence</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Granularité de la couverture territoriale</h3>
                    <p>Indéfinie</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de création</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de publication ou de moissonnage du catalogue d'origine</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de dernière modification</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Fréquence de mise à jour</h3>
                    <p>Annuelle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Type de données</h3>
                    <p>Données ouvertes, données géographiques</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Propriétaire</h3>
                    <p>Service études d'AtmoSud</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>E-mail du propriétaire</h3>
                    <p><a href="mailto:opendata@atmosud.org">opendata@atmosud.org</a></p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Emissions'">
            <ion-card class="services" href="https://cigale.atmosud.org/" target="_blank">
              <ion-img src="/app/assets/img/cigale.png"></ion-img>
              <ion-card-header>
                <ion-card-title>CIGALE</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Inventaires géolocalisés air-climat-énergie en Région Sud
              </ion-card-content>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Métadonnées</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Informations complémentaires
              </ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-label>
                    <h3>Couverture géographique</h3>
                    <p>Territoire de compétence</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Granularité de la couverture territoriale</h3>
                    <p>Indéfinie</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de création</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de publication ou de moissonnage du catalogue d'origine</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Date de dernière modification</h3>
                    <p>YYYY-MM-DD</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Fréquence de mise à jour</h3>
                    <p>Annuelle</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Type de données</h3>
                    <p>Données ouvertes, données géographiques</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Propriétaire</h3>
                    <p>Service modélisation d'AtmoSud</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>E-mail du propriétaire</h3>
                    <p><a href="mailto:opendata@atmosud.org">opendata@atmosud.org</a></p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Microsensors'">
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Flux de données</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                APIs REST pour les développeurs
              </ion-card-content>
              <ion-item href="https://api.atmosud.org/observations/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Toutes les observations</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="https://api.atmosud.org/diams/public/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Mesures PMScan (DIAMS)</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
              <ion-item href="https://api.atmosud.org/diams/public/" target="_blank">
                <ion-icon :icon="serverOutline" slot="start" size="small"></ion-icon>
                <ion-label>Mesures Pollutrack (DIAMS)</ion-label>
                <ion-note slot="end">api.atmosud.org</ion-note>
              </ion-item>
            </ion-card>
            <ion-card color="primary">
              <ion-card-header>
                <ion-card-title>Campagnes de mesure</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Liens utiles vers les projets avec microcapteurs
              </ion-card-content>
              <ion-item href="https://www.airdiams.eu/" target="_blank">
                <ion-icon :icon="linkOutline" slot="start" size="small"></ion-icon>
                <ion-label>DIAMS</ion-label>
                <ion-note slot="end">www.airdiams.eu</ion-note>
              </ion-item>
              <ion-item href="https://www.nature4citylife.eu/" target="_blank">
                <ion-icon :icon="linkOutline" slot="start" size="small"></ion-icon>
                <ion-label>Nature for City Life</ion-label>
                <ion-note slot="end">www.nature4citylife.eu</ion-note>
              </ion-item>
            </ion-card>
          </div>
          <div v-else-if="route.name === 'Nuisance'">
            <ion-card class="services" href="https://www.signalair.eu/fr/" target="_blank">
              <ion-img src="/app/assets/img/signalair.png"></ion-img>
              <ion-card-header>
                <ion-card-title>SignalAir</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Application de signalement des nuisances
              </ion-card-content>
            </ion-card>
          </div>
        </ion-content>
      </ion-menu>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonNote, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/vue';
import { warningOutline, bodyOutline, flowerOutline, analyticsOutline, layersOutline, cloudyOutline, ellipseOutline, flagOutline, mapOutline, pulseOutline, serverOutline, downloadOutline, imageOutline, linkOutline } from 'ionicons/icons';
import { useRouter, useRoute } from 'vue-router';
import { format, add } from 'date-fns';

interface myData {
  key: number;
  multiForecastsRasterUrlD0: string;
  o3ForecastsRasterUrlD0: string;
  no2ForecastsRasterUrlD0: string;
  pm25ForecastsRasterUrlD0: string;
  pm10ForecastsRasterUrlD0: string;
  multiForecastsRasterUrlD1: string;
  o3ForecastsRasterUrlD1: string;
  no2ForecastsRasterUrlD1: string;
  pm25ForecastsRasterUrlD1: string;
  pm10ForecastsRasterUrlD1: string;
  multiForecastsRasterUrlD2: string;
  o3ForecastsRasterUrlD2: string;
  no2ForecastsRasterUrlD2: string;
  pm25ForecastsRasterUrlD2: string;
  pm10ForecastsRasterUrlD2: string;
  annualMapsYears: number[];
}

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAccordionGroup,
    IonAccordion,
    IonNote,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle
  },
  data(): myData {
    return {
      key: 0,
      multiForecastsRasterUrlD0: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-multi-${format(new Date(), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      o3ForecastsRasterUrlD0: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-o3-${format(new Date(), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      no2ForecastsRasterUrlD0: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-no2-${format(new Date(), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      pm25ForecastsRasterUrlD0: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-pm2_5-${format(new Date(), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      pm10ForecastsRasterUrlD0: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-pm10-${format(new Date(), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      multiForecastsRasterUrlD1: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-multi-${format(add(new Date(), { days: 1 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      o3ForecastsRasterUrlD1: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-o3-${format(add(new Date(), { days: 1 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      no2ForecastsRasterUrlD1: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-no2-${format(add(new Date(), { days: 1 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      pm25ForecastsRasterUrlD1: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-pm2_5-${format(add(new Date(), { days: 1 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      pm10ForecastsRasterUrlD1: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-pm10-${format(add(new Date(), { days: 1 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      multiForecastsRasterUrlD2: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-multi-${format(add(new Date(), { days: 2 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      o3ForecastsRasterUrlD2: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-o3-${format(add(new Date(), { days: 2 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      no2ForecastsRasterUrlD2: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-no2-${format(add(new Date(), { days: 2 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      pm25ForecastsRasterUrlD2: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-pm2_5-${format(add(new Date(), { days: 2 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      pm10ForecastsRasterUrlD2: `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-pm10-${format(add(new Date(), { days: 2 }), 'yyyy-MM-dd')}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png8&transparent=true`,
      annualMapsYears: [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012]
    }
  },
  methods: {
    getAnnualRasterUrl(metric: string, year: number): string {
      return `https://geoservices.atmosud.org/geoserver/mod_sudpaca_${year}/wms?service=WMS&version=1.1.0&request=GetMap&layers=mod_sudpaca_${year}:mod_sudpaca_${year}_${metric}&styles=&bbox=795487.5,6208487.5,1083487.5,6454487.5&width=768&height=656&srs=EPSG:2154&format=image/png8&transparent=true`;
    } 
  },
  watch: {
    'route.name'() {
      this.key++;
    }
  },
  setup() {
    const router = useRouter(),
          route = useRoute();

    return {
      router,
      route,
      warningOutline,
      bodyOutline,
      flowerOutline,
      analyticsOutline,
      layersOutline,
      cloudyOutline,
      ellipseOutline,
      flagOutline,
      mapOutline,
      pulseOutline,
      serverOutline,
      downloadOutline,
      imageOutline,
      linkOutline
    };
  }
});
</script>

<style>
@media screen and (max-width: 992px) {
  ion-menu {
    display: none;
  }
}
</style>
