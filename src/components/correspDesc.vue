<!--

Copyright (C) 2018 Berlin-Brandenburg Academy of Sciences and Humanities.

CMIF Creator is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

CMIF Creator is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with CMIF Creator.  If not, see <http://www.gnu.org/licenses/>.

-->
<template>
  <div class="correspDescData">
    <b-container>
      <b-row>
        <b-col>
          <h2>{{ label.letterRecords }}</h2>
          {{ label.step3Desc }}
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col class="text-center">
        {{ (
            (filteredCorrespDesc.results.length < 10)
            ? (((filteredCorrespDesc.results.length === 0) ? 0 : 1) + '-' + filteredCorrespDesc.results.length)
            : ((((this.page*10)-10)+1) + '-' + (((this.page*10) > filteredCorrespDesc.results.length)
                                                 ? filteredCorrespDesc.results.length
                                                 : (this.page*10)))
          ) + '/' + filteredCorrespDesc.results.length
        }}
        <b-badge v-if="filter.text !== ''"
                 class="csOrange">{{ label.filtered }}</b-badge>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <b-button size="sm"
                    v-on:click="toggleAll"
                    v-if="collapsed">
            <i class="fa fa-angle-double-right"></i> {{ label.expandAll }}
          </b-button>
          <b-button size="sm"
                    v-on:click="toggleAll"
                    v-if="!collapsed">
            <i class="fa fa-angle-double-down"></i> {{ label.collapseAll }}
          </b-button>
        </b-col>
        <b-col>
          <b-pagination align="center"
                        size="sm"
                        v-bind:total-rows="filteredCorrespDesc.results.length"
                        v-model="page"
                        v-bind:per-page="10"
                        v-on:change="closeAll"></b-pagination>
        </b-col>
        <b-col>
          <b-input-group size="sm"
                         prepend="Filter">
            <b-form-select v-model="filter.type">
              <option value="name">{{ label.byName }}</option>
              <option value="place">{{ label.byPlace }}</option>
              <option value="date">{{ label.byDate }}</option>
              <option value="key">{{ label.byKey }}</option>
              <option value="id">{{ label.byID }}</option>
            </b-form-select>
            <b-form-input v-model="filter.text"></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col role="tablist">
          <b-card no-body v-for="(item, k) in filteredCorrespDesc.paginatedResults"
                  v-bind:key="'cd_' + item.id"
                  v-bind:id="item.id"
                  class="mb-2">
            <b-card-header header-tag="header"
                           role="tab"
                           class="bg-white border-0">
              <b-row>
                <b-col cols="1">
                  <b-button-toolbar>
                    <b-button-group>
                      <b-button v-on:click="item.visible = !item.visible"
                                v-bind:class="item.visible ? 'collapsed' : null"
                                class="border-right"
                                v-bind:aria-controls="'collapse' + k"
                                v-bind:aria-expanded="item.visible ? 'true' : 'false'"
                                size="sm">
                        <i class="fa"
                           v-bind:class="(item.visible) ? 'fa-angle-up' : 'fa-angle-down'"></i>
                      </b-button>
                      <b-button v-on:click="rmCorrespDescItem(item.id)"
                                v-if="correspDesc.length > 1"
                                size="sm"
                                class="border-left">
                        <i class="fa fa-trash-alt"></i>
                      </b-button>
                    </b-button-group>
                  </b-button-toolbar>
                </b-col>
                <b-col class="float-left"
                       v-html="item.header">
                </b-col>
              </b-row>
            </b-card-header>
            <b-collapse v-bind:id="'collapse' + k"
                        v-model="item.visible" role="tabpanel">
              <b-card-body class="correspDescCardBody">
                <b-form-group horizontal
                              v-bind:label-cols="2"
                              label-size="sm"
                              v-bind:label="label.key"
                              v-bind:label-for="'correspDescKey' + item.id"
                              class="mb-1">
                  <b-form-input v-bind:id="'correspDescKey' + item.id"
                                v-model="item.key"
                                v-on:keyup.native="setHeader(item.id)"
                                size="sm"
                                ></b-form-input>
                </b-form-group>
                <b-row>
                  <b-col sm="2"></b-col>
                  <b-col class="p-px-11">
                    <b-button size="sm"
                              class="mb-1"
                              v-on:click="item.refHidden = !item.refHidden">
                      <i class="fa"
                         v-bind:class="(item.refHidden) ? 'fa-angle-down' : 'fa-angle-up'"></i> {{ label.urlToXml }}
                    </b-button>
                  </b-col>
                </b-row>
                <b-form-group horizontal
                              v-bind:label-cols="2"
                              label-size="sm"
                              v-bind:label="label.urlToXml"
                              label-for="correspDescRef"
                              v-if="!item.refHidden"
                              v-bind:invalid-feedback="label.errorURLFormat">
                  <b-form-input id="correspDescRef"
                                v-model="item.ref"
                                size="sm"
                                type="url"
                                v-on:blur.native="state[item.id].urlToXml = setState('urlToXml', item.id)"
                                v-bind:state="state[item.id].urlToXml"
                                ></b-form-input>
                </b-form-group>
                <b-form-group horizontal
                              v-bind:label-cols="2"
                              label-size="sm"
                              v-bind:label="label.bibliography"
                              label-for="correspDescBibl"
                              v-if="$parent.biblData[0].text !== ''">
                  <b-form-select v-model="item.bibl"
                                 size="sm">
                    <option v-for="bib in $parent.biblData"
                            v-bind:key="'bib_' + item.id + bib.id"
                            v-bind:value="bib.id">
                            {{ (String(bib.text).length>100) ? String(bib.text).slice(0,100) + ' ...' : bib.text }}
                    </option>
                  </b-form-select>
                </b-form-group>
                <b-row>
                  <b-col v-for="(type, tKey) in type"
                         v-bind:key="'t_' + item.id + tKey">
                    <h3>{{ label[type] }}</h3>
                    <b-card no-body v-for="(s, key) in item[type].persName"
                            v-bind:key="'ps_' + item.id + key"
                            class="mb-2">
                      <b-card-header>
                        <b-row align-h="between">
                          <b-col cols="2">
                            <b-button v-on:click="rmPerson(type, item.id, key)"
                                      size="sm"
                                      v-if="item[type].persName.length > 1">
                              <i class="fa fa-trash-alt"></i>
                            </b-button>
                          </b-col>
                          <b-col class="text-right">
                            <b-form-checkbox v-bind:id="type + 'Conjecture' + item.id + key"
                                             v-model="s.conjecture"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.conjecture }}</b-form-checkbox>
                            <b-form-checkbox v-bind:id="type + 'Uncertain' + item.id + key"
                                             v-model="s.uncertain"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.uncertain }}</b-form-checkbox>
                            <b-form-checkbox v-bind:id="type + 'Unknown' + item.id + key"
                                             v-model="s.unknown"
                                             v-on:change="setIdUnknown(type, item.id, key)"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.unknown }}</b-form-checkbox>
                           </b-col>
                        </b-row>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-size="sm"
                                      v-bind:label="label.name"
                                      class="labelOnTop"
                                      v-bind:label-for="type + 'PersName' + key"
                                      v-bind:invalid-feedback="label.errorMetaEditor">
                          <b-form-input v-bind:id="type + 'PersName' + key"
                                        v-bind:state="state[item.id][type][key].name"
                                        v-model="s.text"
                                        size="sm"
                                        v-on:blur.native="addPersonToPool(type, item.id, key); state[item.id][type][key].name = setState(type + 'Name', item.id, key)"
                                        v-on:keyup.native="onInput(type, item.id, key, false); setHeader(item.id);"
                                        v-on:keydown.esc.native="s.open = false"
                                        v-on:keydown.down.native="moveDown(type, item.id, key)"
                                        v-on:keydown.up.native="moveUp(type, item.id, key)"
                                        v-on:keydown.enter.native="select(type, item.id, key)"
                                        ></b-form-input>
                        </b-form-group>
                        <b-list-group v-if="s.open && s.text.length > 2">
                          <b-list-group-item button v-for="(suggestion, suKey) in filterNames(type, item.id, key)"
                                             v-bind:key="'pss_' + item.id + suKey"
                                             v-bind:class="{'highlighted': suKey === s.highlighted}"
                                             v-on:mousedown="select(type, item.id, key)"
                                             v-on:mouseenter="s.highlighted = suKey">
                              {{ suggestion }}
                          </b-list-group-item>
                        </b-list-group>
                        <b-form-group label-size="sm"
                                      v-bind:label="label[type + 'Authority']"
                                      class="labelOnTop"
                                      v-bind:label-for="type + 'PersID' + item.id + key">
                          <b-input-group>
                            <b-form-input v-bind:id="type + 'PersID' + item.id + key"
                                          v-bind:ref="type + 'PersID' + item.id + key"
                                          v-model="s.ref"
                                          size="sm"
                                          v-on:blur.native="addPersNorm(type, item.id, key); item[type].persName[key].gnd.open = false; state[item.id][type][key].id = setState(type + 'Authority', item.id, key)"
                                          v-on:keydown.esc.native="item[type].persName[key].gnd.open = false"
                                          v-bind:state="state[item.id][type][key].id"
                                          ></b-form-input>
                            <b-input-group-append>
                              <b-btn variant="secondary"
                                     v-bind:id="type + 'GetGndBtn' + item.id + key"
                                     v-on:click="getGnd(type, item.id, key)"
                                     v-bind:disabled="s.text === '' || s.unknown === true"
                                     v-bind:title="label.gndBtnTitle"
                                     target="_blank"
                                     class="text-white">
                                <i class="fa fa-address-card"></i>
                              </b-btn>
                            </b-input-group-append>
                            <div class="invalid-feedback">{{ label.errorAuthorityID }}</div>
                          </b-input-group>
                        </b-form-group>
                        <b-list-group v-if="item[type].persName[key].gnd.open">
                          <b-list-group-item button v-for="(suggestion, k) in item[type].persName[key].gnd.suggestions"
                                             v-bind:key="'gnd_' + item.id + k"
                                             v-bind:class="{'highlighted': k === item[type].persName[key].gnd.highlighted}"
                                             v-on:mousedown="selectGnd(type, item.id, key, suggestion)"
                                             v-on:mouseenter="item[type].persName[key].gnd.highlighted = k">
                              {{ suggestion.label }}
                          </b-list-group-item>
                          <b-list-group-item button key="gndMore"
                                             v-if="item[type].persName[key].gnd.suggestions.length > 9"
                                             class="bg-secondary text-white"
                                             v-on:mousedown="getMoreGnd(type, item.id, key)">
                              {{ label.more }}
                          </b-list-group-item>
                          <b-list-group-item button key="gndNoMatches"
                                             v-if="item[type].persName[key].gnd.suggestions.length === 0">
                              {{ label.gndNoMatches }}
                          </b-list-group-item>
                        </b-list-group>
                        <b-form-checkbox v-bind:id="type + 'Organisation' + item.id + key"
                                         v-model="s.organisation"
                                         v-on:input="addOrg(type, item.id, key)"
                                         value="true"
                                         class="labelOnTop"
                                         unchecked-value="false">{{ label.org }}</b-form-checkbox>
                      </b-card-body>
                    </b-card>
                    <b-button v-on:click="addPerson(type, item.id);"
                              size="sm"
                              variant="secondary">
                      <i class="fas fa-plus-circle"></i> {{ label['add' + type.charAt(0).toUpperCase() + type.slice(1)] }}
                    </b-button>
                    <b-card no-body
                            v-for="(place, key) in item[type].placeName"
                            v-bind:key="'pl_' + item.id + key"
                            class="mb-2">
                      <b-card-header>
                        <b-row align-h="between">
                          <b-col cols="2">
                            <b-button v-on:click="rmPlace(type, item.id, key)"
                                      size="sm"
                                      v-if="item[type].placeName.length > 1">
                              <i class="fa fa-trash-alt"></i>
                            </b-button>
                          </b-col>
                          <b-col class="text-right">
                            <b-form-checkbox v-bind:id="type + 'PlaceConjecture' + item.id + key"
                                             v-bind:disabled="place.text === ''"
                                             v-model="place.conjecture"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.conjecture }}</b-form-checkbox>
                            <b-form-checkbox v-bind:id="type + 'PlaceUncertain' + item.id + key"
                                             v-bind:disabled="place.text === ''"
                                             v-model="place.uncertain"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.uncertain }}</b-form-checkbox>
                          </b-col>
                        </b-row>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-size="sm"
                                      v-bind:label="label.place"
                                      class="labelOnTop"
                                      v-bind:label-for="type + 'Place' + item.id + key">
                          <b-form-input v-bind:id="type + 'Place' + item.id + key"
                                        v-model="place.text"
                                        size="sm"
                                        v-on:blur.native="addPlaceToPool(type, item.id, key)"
                                        v-on:keyup.native="onInput(type, item.id, key, true);"
                                        v-on:keydown.esc.native="place.open = false"
                                        v-on:keydown.down.native="moveDown(type, item.id, key, true)"
                                        v-on:keydown.up.native="moveUp(type, item.id, key, true)"
                                        v-on:keydown.enter.native="select(type, item.id, key, true)"
                                        ></b-form-input>
                        </b-form-group>
                        <b-list-group v-if="place.open && place.text.length > 2">
                          <b-list-group-item button v-for="(suggestion, suKey) in filterNames(type, item.id, key, true)"
                                             v-bind:key="'psp_' + item.id + suKey"
                                             v-bind:class="{'highlighted': suKey === place.highlighted}"
                                             v-on:mousedown="select(type, item.id, key, true)"
                                             v-on:mouseenter="place.highlighted = suKey">
                              {{ suggestion }}
                          </b-list-group-item>
                        </b-list-group>
                        <b-form-group label-size="sm"
                                      v-bind:label="label.placeAuthority"
                                      class="labelOnTop"
                                      v-bind:label-for="type + 'PlaceID' + item.id + key">
                          <b-input-group>
                            <b-form-input v-bind:id="type + 'PlaceID' + item.id + key"
                                          v-bind:ref="type + 'PlaceID' + item.id + key"
                                          v-bind:state="state[item.id][type + 'Place'][key].id"
                                          v-model="place.ref"
                                          v-on:blur.native="addPlaceNorm(type, item.id, key); place.geo.open = false; state[item.id][type + 'Place'][key].id = setState(type + 'PlaceAuthority', item.id, key)"
                                          v-on:keydown.esc.native="place.geo.open = false"
                                          size="sm"
                                          class="no-right-border"
                                          ></b-form-input>
                            <b-input-group-append>
                              <b-form-select size="sm"
                                          v-bind:disabled="place.text === ''"
                                          v-model="place.geo.parameter">
                                <option value="P">{{ label.geodataP }}</option>
                                <!-- <option value="A">{{ label.geodataA }}</option> -->
                                <!-- <option value="H">{{ label.geodataH }}</option> -->
                                <option value="T">{{ label.geodataT }}</option>
                                <!-- <option value="V">{{ label.geodataV }}</option> -->
                                <!-- <option value="L">{{ label.geodataL }}</option> -->
                                <option value="S">{{ label.geodataS }}</option>
                              </b-form-select>
                              <b-btn variant="secondary"
                                     v-bind:disabled="place.text === ''"
                                     v-on:click="getGeodata(type, item.id, key)"
                                     class="text-white">
                                <i class="fa fa-globe"></i>
                              </b-btn>
                            </b-input-group-append>
                            <div class="invalid-feedback">{{ label.errorGeoNames }}</div>
                          </b-input-group>
                        </b-form-group>
                        <b-list-group v-if="place.geo.open">
                          <b-list-group-item button v-for="(suggestion, suKey) in place.geo.suggestions"
                                             v-bind:key="'geo_' + item.id + suKey"
                                             v-bind:class="{'highlighted': suKey === place.geo.highlighted}"
                                             v-on:mousedown="selectGeoname(type, item.id, key, suggestion)"
                                             v-on:mouseenter="place.geo.highlighted = suKey">
                              {{ suggestion.name }}, {{ suggestion.adminName1 }} ({{ suggestion.countryCode }})
                          </b-list-group-item>
                        </b-list-group>
                      </b-card-body>
                    </b-card>
                    <b-button v-on:click="addPlace(type, item.id);"
                              size="sm"
                              variant="secondary">
                      <i class="fas fa-plus-circle"></i> {{ label.addPlace }}
                    </b-button>
                    <b-card no-body>
                      <b-card-header>
                        <b-row>
                          <b-col v-bind:cols="(item[type].date === 'nba' || item[type].date === 'na' || item[type].date === '') ? '12' : '5'">
                            <b-form-select v-model="item[type].date"
                                           size="sm">
                              <option value="">{{ label.dateForm }}</option>
                              <option value="when">{{ label.dateWhen }}</option>
                              <option value="nba">{{ label.dateNba }}</option>
                              <option value="span">{{ label.dateSpan }}</option>
                              <option value="na">{{ label.noDate }}</option>
                            </b-form-select>
                          </b-col>
                          <b-col class="text-right"
                                 v-bind:cols="(item[type].date === 'nba' || item[type].date === 'na' || item[type].date === '') ? '0' : '7'"
                                 v-if="(item[type].date !== 'nba' && item[type].date !== 'na' && item[type].date !== '')">
                            <b-form-checkbox v-bind:id="type + 'DateUncertain' + item.id"
                                             v-model="item[type].dateCert.uncertain"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.conjecture }}</b-form-checkbox>
                            <b-form-checkbox v-bind:id="type + 'DateConjecture' + item.id"
                                             v-model="item[type].dateCert.conjecture"
                                             value="true"
                                             class="labelOnTop"
                                             unchecked-value="false">{{ label.uncertain }}</b-form-checkbox>
                          </b-col>
                        </b-row>
                      </b-card-header>
                      <b-card-body>
                        <b-alert variant="warning"
                                 v-bind:show="item[type].date === ''" size="sm">
                        {{ label.selectDateForm }}
                        </b-alert>
                        <b-form-group v-if="item[type].date === 'when'"
                                      description="YYYY-MM-DD"
                                      class="labelOnTop"
                                      v-bind:invalid-feedback="label.errorDate">
                          <b-form-input size="sm"
                                        v-bind:id="type + 'DateWhen' + item.id"
                                        v-on:blur.native="state[item.id][type + 'Date'].when = setState('when' + type.charAt(0).toUpperCase() + type.slice(1), item.id)"
                                        v-bind:state="state[item.id][type + 'Date'].when"
                                        v-model="item[type].when">
                          </b-form-input>
                        </b-form-group>
                        <b-form-group v-if="item[type].date === 'nba'"
                                      description="YYYY-MM-DD"
                                      class="labelOnTop"
                                      v-bind:label="label.dateNb"
                                      v-bind:label-for="type + 'DateNb' + item.id"
                                      v-bind:invalid-feedback="label.errorDate">
                          <b-form-input size="sm"
                                        v-bind:id="type + 'DateNb' + item.id"
                                        v-on:blur.native="state[item.id][type + 'Date'].notBefore = setState('notBefore' + type.charAt(0).toUpperCase() + type.slice(1), item.id)"
                                        v-bind:state="state[item.id][type + 'Date'].notBefore"
                                        v-model="item[type].notBefore">
                          </b-form-input>
                        </b-form-group>
                        <b-form-group v-if="item[type].date === 'nba'"
                                      description="YYYY-MM-DD"
                                      class="labelOnTop"
                                      v-bind:label="label.dateNa"
                                      v-bind:label-for="type + 'DateNa' + item.id"
                                      v-bind:invalid-feedback="label.errorDate">
                          <b-form-input size="sm"
                                        v-bind:id="type +'DateNa' + item.id"
                                        v-on:blur.native="state[item.id][type + 'Date'].notAfter = setState('notAfter' + type.charAt(0).toUpperCase() + type.slice(1), item.id)"
                                        v-bind:state="state[item.id][type + 'Date'].notAfter"
                                        v-model="item[type].notAfter">
                          </b-form-input>
                        </b-form-group>
                        <b-form-group v-if="item[type].date === 'span'"
                                      description="YYYY-MM-DD"
                                      class="labelOnTop"
                                      v-bind:label="label.from"
                                      v-bind:label-for="type + 'DateFrom' + item.id"
                                      v-bind:invalid-feedback="label.errorDate">
                          <b-form-input size="sm"
                                        v-bind:id="type + 'DateFrom' + item.id"
                                        v-on:blur.native="state[item.id][type + 'Date'].from = setState('spanFrom' + type.charAt(0).toUpperCase() + type.slice(1), item.id)"
                                        v-bind:state="state[item.id][type + 'Date'].from"
                                        v-model="item[type].spanFrom">
                          </b-form-input>
                        </b-form-group>
                        <b-form-group v-if="item[type].date === 'span'"
                                      description="YYYY-MM-DD"
                                      class="labelOnTop"
                                      v-bind:label="label.to"
                                      v-bind:label-for="type + 'DateTo' + item.id"
                                      v-bind:invalid-feedback="label.errorDate">
                          <b-form-input size="sm"
                                        v-bind:id="type + 'DateTo' + item.id"
                                        v-on:blur.native="state[item.id][type + 'Date'].to = setState('spanTo' + type.charAt(0).toUpperCase() + type.slice(1), item.id)"
                                        v-bind:state="state[item.id][type + 'Date'].to"
                                        v-model="item[type].spanTo">
                          </b-form-input>
                        </b-form-group>
                        <b-button size="sm"
                                  class="mb-1"
                                  v-on:click="item[type].dateAsTextHidden = !item[type].dateAsTextHidden">
                          <i class="fa"
                             v-bind:class="(item[type].dateAsTextHidden) ? 'fa-angle-down' : 'fa-angle-up'"></i> {{ label.dateText }}
                        </b-button>
                        <b-form-input size="sm"
                                      v-bind:id="type + 'DateText' + item.id"
                                      v-model="item[type].dateAsText"
                                      v-if="!item[type].dateAsTextHidden">
                        </b-form-input>
                      </b-card-body>
                    </b-card>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-button v-on:click="addCorrespDescItem"
                    size="sm"
                    variant="secondary">
            <i class="fas fa-plus-circle"></i> {{ label.addCdItem }}
          </b-button>
        </b-col>
        <b-col>
          <b-pagination align="center"
                        size="sm"
                        class="mb-0"
                        v-bind:total-rows="filteredCorrespDesc.results.length"
                        v-model="page"
                        v-bind:per-page="10">
          </b-pagination>
        </b-col>
        <b-col>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'correspDescData',
  data() {
    return {
      label: this.labels,

      page: 1,
      filter: this.filterSpecs,

      type: ['sender', 'receiver'],

      collapsed: (this.correspDescData.length > 1),

      nextKey: (this.correspDescData.length > 1) ? (this.correspDescData.length) : 1,
      correspDesc: this.correspDescData,

      persons: this.pArrays.persons,
      places: this.pArrays.places,

      uriUnknown: 'http://correspSearch.net/unknown',

      state: this.correspDescState,
    };
  },
  props: {
    labels: {
      type: Object,
      default: () => ({}),
    },
    pArrays: {
      type: Object,
      twoWays: true,
      default: () => ({
        persons: [],
        places: [],
      }),
    },
    filterSpecs: {
      type: Object,
      default() {
        return {
          type: 'name',
          text: '',
        };
      },
    },
    correspDescData: {
      type: Array,
      twoWays: true,
    //  default() {
    //    return this.$parent.correspDescData;
    //  },
    },
    correspDescState: {
      type: Array,
      twoWays: true,
    },
  },
  methods: {
    // Wrapper for debug console
    console(string) {
      console.log(string);
    },
    // Validate Entries
    setState(item, id, key) {
      if (item === 'urlToXml') {
        if (this.correspDesc[id].ref !== '') {
          return this.$parent.check('url', this.correspDesc[id].ref);
        }
      }
      if (item === 'senderName' || item === 'receiverName') {
        if (
          this.correspDesc[id][item.replace('Name', '')].persName[key].text === ''
        ) {
          return false;
        }
      }
      if (item === 'senderAuthority' || item === 'receiverAuthority') {
        if (this.correspDesc[id][item.replace('Authority', '')].persName[key].ref !== '') {
          return this.$parent.check('person', this.correspDesc[id][item.replace('Authority', '')].persName[key].ref);
        }
      }
      if (item === 'senderPlaceAuthority' || item === 'receiverPlaceAuthority') {
        if (this.correspDesc[id][item.replace('PlaceAuthority', '')].placeName[key].ref !== '') {
          return this.$parent.check('place', this.correspDesc[id][item.replace('PlaceAuthority', '')].placeName[key].ref);
        }
      }
      if (
        item.includes('when')
        || item.includes('notBefore')
        || item.includes('notAfter')
        || item.includes('spanFrom')
        || item.includes('spanTo')
      ) {
        if (this.correspDesc[id][(item.includes('Sender') ? 'sender' : 'receiver')][item.replace(/Receiver|Sender/g, '')] !== '') {
          return this.$parent.check('date', this.correspDesc[id][(item.includes('Sender') ? 'sender' : 'receiver')][item.replace(/Receiver|Sender/g, '')]);
        }
      }
      return null;
    },

    // Change header of items according to content
    setHeader(id) {
      this.correspDesc[id].header = (this.correspDesc[id].key)
        ? `<span class="badge badge-info mr-1">${
          this.correspDesc[id].key
        }</span>` : '';
      this.correspDesc[id].header += (this.correspDesc[id].sender.persName[0].text)
        ? `<span class="badge badge-secondary mr-1">${
          this.label.headBy
        }</span><small class="mr-2 ml-1">${
          this.correspDesc[id].sender.persName[0].text
        }</small>` : '';
      this.correspDesc[id].header += (this.correspDesc[id].receiver.persName[0].text)
        ? `<span class="badge badge-secondary mr-1">${
          this.label.headTo
        }</span><small class="mr-2 ml-1">${
          this.correspDesc[id].receiver.persName[0].text
        }</small>` : '';
    },

    // Set Norm-ID for unknown person
    setIdUnknown(target, id, key) {
      this.$nextTick(() => {
        if (this.correspDesc[id][target].persName[key].unknown === 'true') {
          this.correspDesc[id][target].persName[key].ref =
          (
            this.correspDesc[id][target].persName[key].ref.trim() !== ''
          ) ? this.correspDesc[id][target].persName[key].ref : this.uriUnknown;
          this.correspDesc[id][target].persName[key].text =
          (
            this.correspDesc[id][target].persName[key].text.trim() !== ''
          ) ? this.correspDesc[id][target].persName[key].text : this.label.unknown;
          this.state[id][target][key].id = (this.correspDesc[id][target].persName[key].ref.trim() !== '');
          this.state[id][target][key].name = (this.correspDesc[id][target].persName[key].text.trim() !== '');
        } else {
          this.correspDesc[id][target].persName[key].ref =
          (
            this.correspDesc[id][target].persName[key].ref.trim() !== ''
            && this.correspDesc[id][target].persName[key].ref !== this.uriUnknown
          ) ? this.correspDesc[id][target].persName[key].ref : '';
          this.correspDesc[id][target].persName[key].text =
          (
            this.correspDesc[id][target].persName[key].text.trim() !== ''
            && this.correspDesc[id][target].persName[key].text !== this.label.unknown
          ) ? this.correspDesc[id][target].persName[key].text : '';
          this.state[id][target][key].id = (this.correspDesc[id][target].persName[key].ref.trim() === '') ? null : true;
          this.state[id][target][key].name = (this.correspDesc[id][target].persName[key].text.trim() !== '');
        }
      });
    },

    // Get Keys from ID
    getRealKey(id) {
      for (let i = 0; i < this.correspDesc.length; i += 1) {
        if (this.correspDesc[i].id === id) return i;
      }
      return 0;
    },

    // Wrapper for async requests
    async asyncDataRequest(request) {
      const response = await fetch(request);
      const data = await response.json();
      return data;
    },

    // getGND from lobid
    getGnd(target, id, key) {
      const filterType = (this.correspDesc[id][target].persName[key].organisation === 'true') ? 'CorporateBody' : 'Person';
      this.asyncDataRequest(`https://lobid.org/gnd/search?q=${this.correspDesc[id][target].persName[key].text}&format=json:suggest&filter=type:${filterType}`)
        .then((data) => {
          this.correspDesc[id][target].persName[key].gnd.suggestions = data;
          this.correspDesc[id][target].persName[key].gnd.all = data.length;
          this.correspDesc[id][target].persName[key].gnd.open = true;
          this.$nextTick(() => {
            this.$refs[`${target}PersID${id}${key}`][0].$el.focus();
          });
        });
      /*
      const xhr = new XMLHttpRequest();
      const filterType = (this.correspDesc[id][target].persName[key].organisation === 'true') ? 'CorporateBody' : 'Person';
      xhr.open('GET', `https://lobid.org/gnd/search?q=${this.correspDesc[id][target].persName[key].text}&format=json:suggest&filter=type:${filterType}`);
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.correspDesc[id][target].persName[key].gnd.suggestions = JSON.parse(xhr.responseText);
          this.correspDesc[id][target].persName[key].gnd.all = JSON.parse(xhr.responseText).length;
          this.correspDesc[id][target].persName[key].gnd.open = true;
          this.$nextTick(() => {
            this.$refs[`${target}PersID${id}${key}`][0].$el.focus();
          });
        } else {
          console.error(xhr.status);
        }
      };
      xhr.send();
      */
    },

    // Add link to Lobid to Dropdown
    getMoreGnd(target, id, key) {
      const term = this.correspDesc[id][target].persName[key].text;
      const filter = (this.correspDesc[id][target].persName[key].organisation === 'true') ? 'CorporateBody' : 'Person';
      window.open(`https://lobid.org/gnd/search?q=${term}&filter=type:${filter}`, '_blank');
    },

    // Select-Routine for Gnd-Suggestions
    selectGnd(target, id, key, gndData) {
      for (let i = 0; i < this.persons.length; i += 1) {
        if (this.persons[i].text === this.correspDesc[id][target].persName[key].text) {
          this.persons[i].ref = gndData.id;
        }
      }
      this.correspDesc[id][target].persName[key].ref = gndData.id;
      this.correspDesc[id][target].persName[key].gnd.suggestions = [];
      this.correspDesc[id][target].persName[key].gnd.open = false;
      this.correspDesc[id][target].persName[key].gnd.highlighted = 0;

      this.correspDesc[id][target].persName[key].selected = true;
    },

    // Get Data from Geonames
    getGeodata(target, id, key) {
      this.asyncDataRequest(`https://correspsearch.net/api/v1.1/services/getGeonames.xql?q=${this.correspDesc[id][target].placeName[key].text}&fc=${this.correspDesc[id][target].placeName[key].geo.parameter}`)
      .then((json) => {
        this.correspDesc[id][target].placeName[key].geo.suggestions = json.geonames;
        this.correspDesc[id][target].placeName[key].geo.all = json.totalResultsCount;
        if (json.totalResultsCount > 0) {
          this.correspDesc[id][target].placeName[key].geo.open = true;
        }
        this.$nextTick(() => {
          this.$refs[`${target}PlaceID${id}${key}`][0].$el.focus();
        });
      });
      /*
      const xhr = new XMLHttpRequest();
      let json = '';
      // TODO: Parameter hinzufügen
      xhr.open('GET', `https://correspsearch.net/api/v1.1/services/getGeonames.xql?q=${this.correspDesc[id][target].placeName[key].text}&fc=${this.correspDesc[id][target].placeName[key].geo.parameter}`);
      xhr.onload = () => {
        if (xhr.status === 200) {
          json = JSON.parse(xhr.responseText);
          this.correspDesc[id][target].placeName[key].geo.suggestions = json.geonames;
          this.correspDesc[id][target].placeName[key].geo.all = json.totalResultsCount;
          if (json.totalResultsCount > 0) {
            this.correspDesc[id][target].placeName[key].geo.open = true;
          }
          this.$nextTick(() => {
            this.$refs[`${target}PlaceID${id}${key}`][0].$el.focus();
          });
        } else {
          console.error(xhr.status);
        }
      };
      xhr.send();
      */
    },

    // Select-Routine for Geoname-Suggestions
    selectGeoname(target, id, key, geoData) {
      for (let i = 0; i < this.places.length; i += 1) {
        if (this.places[i].text === this.correspDesc[id][target].placeName[key].text) {
          this.places[i].ref = `http://www.geonames.org/${geoData.geonameId}`;
        }
      }
      this.correspDesc[id][target].placeName[key].ref = `http://www.geonames.org/${geoData.geonameId}`;
      this.correspDesc[id][target].placeName[key].geo.suggestions = [];
      this.correspDesc[id][target].placeName[key].geo.open = false;
      this.correspDesc[id][target].placeName[key].geo.highlighted = 0;

      this.correspDesc[id][target].placeName[key].selected = true;
    },

    // Filter Names and Places for Suggestions
    filterNames(target, id, key, place = false) {
      const results = [];
      if (!place) {
        const persName = this.correspDesc[id][target].persName[key].text;
        const regEx = new RegExp(persName.toUpperCase(), 'i');
        for (let i = 0; i < this.persons.length; i += 1) {
          if (
            this.persons[i].text.toUpperCase().match(regEx)
        //  && this.persons[i].text.toUpperCase() !== persName.toUpperCase()
            && this.persons[i].text !== ''
          ) {
            results.push(this.persons[i].text);
          }
        }
      } else if (this.correspDesc[id][target].placeName[key].text) {
        const placeName = this.correspDesc[id][target].placeName[key].text;
        const regEx = new RegExp(placeName.toUpperCase(), 'i');
        for (let i = 0; i < this.places.length; i += 1) {
          if (
            this.places[i].text !== undefined
            //  && this.places[i].text.toUpperCase() !== placeName.toUpperCase()
            && this.places[i].text !== ''
            && this.places[i].text.toUpperCase().match(regEx)
          ) {
            results.push(this.places[i].text);
          }
        }
      }
      return results;
    },

    // Change pers or org according to input
    addOrg(target, id, persKey) {
      if (this.correspDesc[id][target].persName[persKey].text) {
        for (let i = 0; i < this.persons.length; i += 1) {
          if (this.persons[i].text === this.correspDesc[id][target].persName[persKey].text) {
            this.persons[i].org = this.correspDesc[id][target].persName[persKey].organisation;
          }
        }
      }
      // ** Set other entries accordingly **
      // Optional: Comment out to increase performance
      if (this.correspDesc[id][target].persName[persKey].text) {
        for (let j = 0; j < this.correspDesc.length; j += 1) {
          this.type.forEach((e) => {
            for (let i = 0; i < this.correspDesc[j][e].persName.length; i += 1) {
              if (this.correspDesc[j][e].persName[i].text === this.correspDesc[id][target].persName[persKey].text) {
                this.correspDesc[j][e].persName[i].organisation = this.correspDesc[id][target].persName[persKey].organisation;
              }
            }
          });
        }
      }
    },

    // Add Norm-ID for Person
    addPersNorm(target, id, persKey) {
      if (
        this.correspDesc[id][target].persName[persKey].text.trim() !== ''
        && this.correspDesc[id][target].persName[persKey].ref.trim() !== ''
      ) {
        for (let i = 0; i < this.persons.length; i += 1) {
          if (this.persons[i].text === this.correspDesc[id][target].persName[persKey].text) {
            if (this.persons[i].ref !== this.correspDesc[id][target].persName[persKey].ref) {
              this.persons[i].ref = this.correspDesc[id][target].persName[persKey].ref;
              break;
            }
          }
        }
      }
      // ** Set other entries accordingly **
      // Optional: Comment out to increase performance
      if (this.correspDesc[id][target].persName[persKey].text) {
        for (let j = 0; j < this.correspDesc.length; j += 1) {
          this.type.forEach((e) => { // eslint-disable-line
            for (let i = 0; i < this.correspDesc[j][e].persName.length; i += 1) {
              if (this.correspDesc[j][e].persName[i].text === this.correspDesc[id][target].persName[persKey].text
                  && this.correspDesc[j][e].persName[i].ref !== this.uriUnknown) {
                this.correspDesc[j][e].persName[i].ref = this.correspDesc[id][target].persName[persKey].ref;
              }
            }
          });
        }
      }

      if (this.correspDesc[id][target].persName[persKey].ref.trim() === '') {
        if (this.correspDesc[id][target].persName[persKey].unknown === 'true') this.$set(this.correspDesc[id][target].persName[persKey], 'unknown', false);
      }
    },

    // Add Person to Pool
    addPersonToPool(target, id, persKey) {
      if (this.correspDesc[id][target].persName[persKey].text !== this.label.unknown) {
        if (this.persons.length === 0) {
          this.persons.push({
            text: this.correspDesc[id][target].persName[persKey].text,
            ref: this.correspDesc[id][target].persName[persKey].ref,
            org: this.correspDesc[id][target].persName[persKey].organisation,
          });
        } else {
          let match = false;
          for (let i = 0; i < this.persons.length; i += 1) {
            match = (this.persons[i].text === this.correspDesc[id][target].persName[persKey].text);
            if (match) break;
          }
          if (!match) {
            this.persons.push({
              text: this.correspDesc[id][target].persName[persKey].text,
              ref: this.correspDesc[id][target].persName[persKey].ref,
              org: this.correspDesc[id][target].persName[persKey].organisation,
            });
          }
        }
      } else {
        this.correspDesc[id][target].persName[persKey].ref = this.uriUnknown;
        this.correspDesc[id][target].persName[persKey].unknown = true;
      }
      this.correspDesc[id][target].persName[persKey].open = false;
    },

    // Add Norm-ID for Place
    addPlaceNorm(target, id, key) {
      if (
        this.correspDesc[id][target].placeName[key].text.trim() !== ''
        && this.correspDesc[id][target].placeName[key].ref.trim() !== ''
      ) {
        for (let i = 0; i < this.places.length; i += 1) {
          if (this.places[i].text === this.correspDesc[id][target].placeName[key].text) {
            if (this.places[i].ref !== this.correspDesc[id][target].placeName[key].ref) {
              this.places[i].ref = this.correspDesc[id][target].placeName[key].ref;
              break;
            }
          }
        }
      }
      // ** Set other entries accordingly **
      // Optional: Comment out to increase performance
      if (this.correspDesc[id][target].placeName[key].text) {
        for (let j = 0; j < this.correspDesc.length; j += 1) {
          ['sender', 'receiver'].forEach((e) => {
            for (let i = 0; i < this.correspDesc[j][e].placeName.length; i += 1) {
              if (this.correspDesc[j][e].placeName[i].text === this.correspDesc[id][target].placeName[key].text) {
                this.correspDesc[j][e].placeName[i].ref = this.correspDesc[id][target].placeName[key].ref;
              }
            }
          });
        }
      }
    },

    // Add Place to Pool
    addPlaceToPool(target, id, key) {
      if (this.places.length === 0) {
        this.places.push({
          text: this.correspDesc[id][target].placeName[key].text,
          ref: this.correspDesc[id][target].placeName[key].ref,
        });
      } else {
        let match = false;
        for (let i = 0; i < this.places.length; i += 1) {
          match = (this.places[i].text === this.correspDesc[id][target].placeName[key].text);
          if (match) break;
        }
        if (!match) {
          this.places.push({
            text: this.correspDesc[id][target].placeName[key].text,
            ref: this.correspDesc[id][target].placeName[key].ref,
          });
        }
      }
      this.correspDesc[id][target].placeName[key].open = false;
    },

    // Event to trigger the Suggestions-List
    onInput(target, id, key, place = false) {
      if (!place) {
        if (this.correspDesc[id][target].persName[key].selected) {
          this.correspDesc[id][target].persName[key].selected = false;
        } else if (this.correspDesc[id][target].persName[key].text.length > 2) {
          if (this.persons.length > 0) {
            this.correspDesc[id][target].persName[key].open = !!(this.correspDesc[id][target].persName[key].text);
            this.correspDesc[id][target].persName[key].highlighted = (this.correspDesc[id][target].persName[key].highlighted === 0) ? 0 : this.correspDesc[id][target].persName[key].highlighted;
          }
        }
      }
      if (place) {
        if (this.correspDesc[id][target].placeName[key].text !== null) {
          if (this.correspDesc[id][target].placeName[key].selected) {
            this.correspDesc[id][target].placeName[key].selected = false;
          } else if (this.places.length > 0) {
            this.correspDesc[id][target].placeName[key].open = !!(this.correspDesc[id][target].placeName[key].text);
            this.correspDesc[id][target].placeName[key].highlighted = (this.correspDesc[id][target].placeName[key].highlighted === 0) ? 0 : this.correspDesc[id][target].placeName[key].highlighted;
          }
        }
        if (this.correspDesc[id][target].placeName[key].text === '') {
          this.correspDesc[id][target].placeName[key].conjecture = false;
          this.correspDesc[id][target].placeName[key].uncertain = false;
        }
      }
    },

    // Select from Suggestions-List
    select(target, id, key, place = false) {
      let fieldValue = '';
      let targetKey = -1;
      if (!place) {
        if (this.correspDesc[id][target].persName[key].text.length > 2) {
          const selected = this.filterNames(target, id, key)[this.correspDesc[id][target].persName[key].highlighted];
          fieldValue = this.correspDesc[id][target].persName[key].text;
          this.$nextTick(() => {
            for (let i = 0; i < this.persons.length; i += 1) {
              if (this.persons[i].text === fieldValue) targetKey = i;
              if (this.persons[i].text === selected) {
                this.correspDesc[id][target].persName[key].text = this.persons[i].text;
                this.correspDesc[id][target].persName[key].ref = this.persons[i].ref;
                this.correspDesc[id][target].persName[key].organisation = this.persons[i].org;
                this.correspDesc[id][target].persName[key].open = false;
                this.correspDesc[id][target].persName[key].selected = true;

                if (this.persons[i].ref) this.state[id][target][key].id = (this.setState(`${target}Authority`, id, key));
                this.correspDesc[id][target].persName[key].unknown = (this.persons[i].unknown);
              }
            }
            if (fieldValue !== this.correspDesc[id][target].persName[key].text
              && this.correspDesc[id][target].persName[key].text.includes(fieldValue)
              && targetKey > -1) this.persons.splice(targetKey, 1);
          });
        }
      } else if (this.correspDesc[id][target].placeName[key].text.length > 2) {
        const selected = this.filterNames(target, id, key, true)[this.correspDesc[id][target].placeName[key].highlighted];
        this.$nextTick(() => {
          for (let i = 0; i < this.places.length; i += 1) {
            if (this.places[i].text !== undefined && selected === this.places[i].text) {
              this.correspDesc[id][target].placeName[key].text = this.places[i].text;
              this.correspDesc[id][target].placeName[key].ref = this.places[i].ref;
              this.correspDesc[id][target].placeName[key].open = false;
              this.correspDesc[id][target].placeName[key].selected = true;

              if (this.places[i].ref) this.state[id][`${target}Place`][key].id = (this.setState(`${target}PlaceAuthority`, id, key));
              break;
            }
          }
        });
      }
    },

    // Move Up by Key-Input in List of Suggestions
    moveUp(target, id, key, place = false, geo = false) {
      if (!place) {
        if (this.correspDesc[id][target].persName[key].open) {
          this.correspDesc[id][target].persName[key].highlighted = ((this.correspDesc[id][target].persName[key].highlighted - 1) < 0)
            ? this.filterNames(target, id, key).length - 1
            : (this.correspDesc[id][target].persName[key].highlighted - 1) % this.filterNames(target, id, key).length;
        }
      } else if (this.correspDesc[id][target].placeName[key].open) {
        this.correspDesc[id][target].placeName[key].highlighted = ((this.correspDesc[id][target].placeName[key].highlighted - 1) < 0)
          ? this.filterNames(target, id, 0, true).length - 1
          : (this.correspDesc[id][target].placeName[key].highlighted - 1) % this.filterNames(target, id, key, true).length;
      } else if (geo) {
        if (this.correspDesc[id][target].placeName[key].geo.open) {
          this.correspDesc[id][target].placeName[key].geo.highlighted = ((this.correspDesc[id][target].placeName[key].geo.highlighted - 1) < 0)
            ? this.correspDesc[id][target].placeName[key].geo.all - 1
            : (this.correspDesc[id][target].placeName[key].geo.highlighted - 1) % this.correspDesc[id][target].placeName[key].geo.all;
        }
      }
    },

    // Move Down by Key-Input in List of Suggestions
    moveDown(target, id, key, place = false, geo = false) {
      if (!place) {
        if (this.correspDesc[id][target].persName[key].open) {
          this.correspDesc[id][target].persName[key].highlighted = (this.correspDesc[id][target].persName[key].highlighted + 1) % this.filterNames(target, id, key).length;
        }
      } else if (this.correspDesc[id][target].placeName[key].open) {
        this.correspDesc[id][target].placeName[key].highlighted = (this.correspDesc[id][target].placeName[key].highlighted + 1) % this.filterNames(target, id, key, true).length;
      } else if (geo) {
        if (this.correspDesc[id][target].placeName[key].geo.open) {
          this.correspDesc[id][target].placeName[key].geo.highlighted = (this.correspDesc[id][target].placeName[key].geo.highlighted + 1) % this.correspDesc[id][target].placeName[key].geo.all;
        }
      }
    },

    // Add new Person
    addPerson(target, key) {
      this.state[key][target].push({
        name: null,
        id: null,
      });
      this.correspDesc[key][target].persName.push({
        text: '',
        ref: '',

        conjecture: false,
        uncertain: false,
        unknown: false,

        organisation: false,

        // Autocomplete
        open: false,
        highlighted: 0,
        selected: false,

        gnd: {
          open: false,
          highlighted: 0,
          suggestions: [],
          all: 0,
        },
      });
    },

    // Delete Person
    rmPerson(target, id, key) {
      this.correspDesc[id][target].persName.splice(key, 1);
      this.state[id][target].splice(key, 1);
      for (let i = 0; i < this.correspDesc[id][target].persName.length; i += 1) {
        this.correspDesc[id][target].persName[i].selected = true;
      }
    },

    // Add new Person
    addPlace(target, key) {
      this.state[key][`${target}Place`].push({
        name: null,
        id: null,
      });
      this.correspDesc[key][target].placeName.push({
        text: '',
        ref: '',

        conjecture: false,
        uncertain: false,

        // Autocomplete
        open: false,
        highlighted: 0,
        selected: false,

        // Geonames Suggestions
        geo: {
          open: false,
          highlighted: 0,
          suggestions: [],
          all: 0,
          parameter: 'P',
        },
      });
    },

    // Delete Person
    rmPlace(target, id, key) {
      this.state[key][`${target}Place`].splice(key, 1);
      this.correspDesc[id][target].placeName.splice(key, 1);
      for (let i = 0; i < this.correspDesc[id][target].placeName.length; i += 1) {
        this.correspDesc[id][target].placeName[i].selected = true;
      }
    },

    // Add new correspDesc-Item
    addCorrespDescItem() {
      this.filter = {
        type: 'name',
        text: '',
      };
      this.state.push({
        urlToXml: null,
        sender: [
          {
            name: null,
            id: null,
          },
        ],
        receiver: [
          {
            name: null,
            id: null,
          },
        ],
        senderPlace: [
          {
            name: null,
            id: null,
          },
        ],
        receiverPlace: [
          {
            name: null,
            id: null,
          },
        ],
        senderDate: {
          when: null,
          notBefore: null,
          notAfter: null,
          from: null,
          to: null,
        },
        receiverDate: {
          when: null,
          notBefore: null,
          notAfter: null,
          from: null,
          to: null,
        },
      });
      this.correspDesc.push({
        id: this.nextKey,
        visible: true,

        header: '',

        ref: '',
        refHidden: true,

        key: '',

        bibl: 0,

        sender: {
          persName: [
            {
              text: '',
              ref: '',

              conjecture: false,
              uncertain: false,
              unknown: false,

              organisation: false,

              // Autocomplete
              open: false,
              highlighted: 0,
              selected: false,

              gnd: {
                open: false,
                highlighted: 0,
                suggestions: [],
                all: 0,
              },
            },
          ],
          placeName: [
            {
              text: '',
              ref: '',

              conjecture: false,
              uncertain: false,

              // Autocomplete
              open: false,
              highlighted: 0,
              selected: false,

              // Geonames Suggestions
              geo: {
                open: false,
                highlighted: 0,
                suggestions: [],
                all: 0,
                parameter: 'P',
              },
            },
          ],

          date: '',
          dateCert: {
            conjecture: false,
            uncertain: false,
          },
          when: '',
          notBefore: '',
          notAfter: '',
          spanFrom: '',
          spanTo: '',
          dateAsText: '',
          dateAsTextHidden: true,
        },
        receiver: {
          persName: [
            {
              text: '',
              ref: '',

              conjecture: false,
              uncertain: false,
              unknown: false,

              organisation: false,

              // Autocomplete
              open: false,
              highlighted: 0,
              selected: false,

              gnd: {
                open: false,
                highlighted: 0,
                suggestions: [],
                all: 0,
              },
            },
          ],
          placeName: [
            {
              text: '',
              ref: '',

              conjecture: false,
              uncertain: false,

              // Autocomplete
              open: false,
              highlighted: 0,
              selected: false,

              // Geonames Suggestions
              geo: {
                open: false,
                highlighted: 0,
                suggestions: [],
                all: 0,
                parameter: 'P',
              },
            },
          ],

          date: '',
          dateCert: {
            conjecture: false,
            uncertain: false,
          },
          when: '',
          notBefore: '',
          notAfter: '',
          spanFrom: '',
          spanTo: '',
          dateAsText: '',
          dateAsTextHidden: true,
        },
      });
      this.nextKey += 1;
      this.page = Math.ceil(this.correspDesc.length / 10);
      for (let i = 0; i < this.filteredCorrespDesc.paginatedResults.length - 1; i += 1) {
        this.filteredCorrespDesc.paginatedResults[i].visible = false;
      }
      setTimeout(() => {
        location.hash = `#${(this.nextKey - 1)}`;
        document.getElementById(`correspDescKey${(this.nextKey - 1)}`).focus();
      }, 1000);
    },

    // Delete correspDesc-Item
    rmCorrespDescItem(key) {
      for (let i = 0; i < this.correspDesc.length; i += 1) {
        if (key === this.correspDesc[i].id) {
          this.correspDesc.splice(i, 1);
          this.state.splice(i, 1);
          break;
        }
      }
      // Reorder ids according to Array key
      for (let i = 0; i < this.correspDesc.length; i += 1) {
        this.correspDesc[i].id = i;
      }
      this.nextKey = this.correspDesc.length;
    },

    // Collapse / Expand all Items
    toggleAll() {
      this.$nextTick(() => {
        for (let i = 0; i < this.filteredCorrespDesc.paginatedResults.length; i += 1) {
          this.filteredCorrespDesc.paginatedResults[i].visible = this.collapsed;
        }
        this.collapsed = !this.collapsed;
      });
    },

    // Close all Items
    closeAll() {
      this.$nextTick(() => {
        for (let i = 0; i < this.filteredCorrespDesc.paginatedResults.length; i += 1) {
          this.filteredCorrespDesc.paginatedResults[i].visible = false;
        }
        this.collapsed = true;
      });
    },
  },
  mounted() {
    // Exclude all checkboxes from tabbing, not implemented yet in bootstrap-vue
    document.querySelectorAll('input[type="checkbox"]').forEach((e) => {
      e.setAttribute('tabindex', '-1');
    });

    // Open correspDesc-Element if there is only one
    if (this.correspDesc.length === 1) this.correspDesc[0].visible = true;

    // Focus Key field

    if (this.filter.type !== 'id' && this.filter.type !== 'key') {
      this.$nextTick(() => { document.getElementById('correspDescKey0').focus(); });
    } else if (this.filter.type === 'key') {
      for (let i = 0; i < this.correspDesc.length; i += 1) {
        if (this.correspDesc[i].key === this.filter.text) {
          this.correspDesc[i].visible = true;
          break;
        }
      }
    } else {
      this.correspDesc[this.filter.text].visible = true;
    }
  },
  computed: {
    // Get filtered Results & Paginate them
    filteredCorrespDesc() {
      const results = [];
      if (this.filter.text === '') {
        this.correspDesc.forEach((e) => { results.push(e); });
      }
      if (this.filter.type === 'name' && this.filter.text !== '') {
        for (let i = 0; i < this.correspDesc.length; i += 1) {
          let match = false;
          for (let j = 0; j < this.correspDesc[i].sender.persName.length; j += 1) {
            if (this.correspDesc[i].sender.persName[j].text.toUpperCase().includes(this.filter.text.toUpperCase())) {
              results.push(this.correspDesc[i]);
              match = true;
            }
          }
          for (let j = 0; j < this.correspDesc[i].receiver.persName.length; j += 1) {
            if (this.correspDesc[i].receiver.persName[j].text.toUpperCase().includes(this.filter.text.toUpperCase())) {
              if (!match) {
                results.push(this.correspDesc[i]);
              }
            }
          }
        }
      }
      if (this.filter.type === 'place' && this.filter.text !== '') {
        for (let i = 0; i < this.correspDesc.length; i += 1) {
          let match = false;
          for (let j = 0; j < this.correspDesc[i].sender.placeName.length; j += 1) {
            if (this.correspDesc[i].sender.placeName[j].text
                && this.correspDesc[i].sender.placeName[j].text.toUpperCase().includes(this.filter.text.toUpperCase())) {
              results.push(this.correspDesc[i]);
              match = true;
            }
          }
          for (let j = 0; j < this.correspDesc[i].receiver.placeName.length; j += 1) {
            if (this.correspDesc[i].receiver.placeName[j].text !== undefined
                && this.correspDesc[i].receiver.placeName[j].text.toUpperCase().includes(this.filter.text.toUpperCase())) {
              if (!match) results.push(this.correspDesc[i]);
            }
          }
        }
      }
      if (this.filter.type === 'key' && this.filter.text !== '') {
        for (let i = 0; i < this.correspDesc.length; i += 1) {
          if (this.correspDesc[i].key === this.filter.text) {
            results.push(this.correspDesc[i]);
          }
        }
      }
      if (this.filter.type === 'id' && this.filter.text !== '') {
        results.push(this.correspDesc[this.filter.text]);
      }
      if (this.filter.type === 'date' && this.filter.text !== '') {
        for (let i = 0; i < this.correspDesc.length; i += 1) {
          let match = false;
          if (this.correspDesc[i].sender.when && this.correspDesc[i].sender.when.includes(this.filter.text)) {
            results.push(this.correspDesc[i]);
            match = true;
          }
          if (
            (
              this.correspDesc[i].sender.notBefore
              && this.correspDesc[i].sender.notBefore.includes(this.filter.text)
            ) || (
              this.correspDesc[i].sender.notAfter
              && this.correspDesc[i].sender.notAfter.includes(this.filter.text)
            ) || (this.correspDesc[i].sender.spanFrom
              && this.correspDesc[i].sender.spanFrom.includes(this.filter.text)
            ) || (this.correspDesc[i].sender.spanTo
              && this.correspDesc[i].sender.spanTo.includes(this.filter.text)
            ) || (
              this.correspDesc[i].sender.dateAsText
              && this.correspDesc[i].sender.dateAsText.includes(this.filter.text)
            )
          ) {
            if (!match) {
              results.push(this.correspDesc[i]);
              match = true;
            }
          }
          if (
            (
              this.correspDesc[i].receiver.when
              && this.correspDesc[i].receiver.when.includes(this.filter.text)
            ) || (this.correspDesc[i].receiver.notBefore
              && this.correspDesc[i].receiver.notBefore.includes(this.filter.text)
            ) || (this.correspDesc[i].receiver.notAfter
              && this.correspDesc[i].receiver.notAfter.includes(this.filter.text)
            ) || (this.correspDesc[i].receiver.spanFrom
              && this.correspDesc[i].receiver.spanFrom.includes(this.filter.text)
            ) || (this.correspDesc[i].receiver.spanTo
              && this.correspDesc[i].receiver.spanTo.includes(this.filter.text)
            ) || (this.correspDesc[i].receiver.dateAsText
              && this.correspDesc[i].receiver.dateAsText.includes(this.filter.text)
            )
          ) {
            if (!match) {
              results.push(this.correspDesc[i]);
              match = true;
            }
          }
        }
      }
      const paginatedResults = results.slice((this.page === 1) ? 0 : ((this.page - 1) * 10), ((this.page === 1) ? 0 : ((this.page - 1) * 10)) + 10);
      return {
        paginatedResults,
        results,
      };
    },
  },
};

</script>
