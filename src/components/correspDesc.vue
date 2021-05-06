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
    <BContainer>
      <BRow>
        <BCol>
          <h2>{{ label.letterRecords }}</h2>
          {{ label.step3Desc }}
        </BCol>
      </BRow>
      <BRow class="mt-3">
        <BCol class="text-center">
          {{ (
            /* eslint-disable vue/this-in-template */
            (filteredCorrespDesc.results.length &lt; 10)
              ? (((filteredCorrespDesc.results.length === 0) ? 0 : 1) + '-' + filteredCorrespDesc.results.length)
              : ((((this.page*10)-10)+1) + '-' + (((this.page*10) > filteredCorrespDesc.results.length)
                ? filteredCorrespDesc.results.length
                : (this.page*10)))
          ) + '/' + filteredCorrespDesc.results.length
          }}
          <BBadge
            v-if="filter.text !== ''"
            class="csOrange"
          >
            {{ label.filtered }}
          </BBadge>
        </BCol>
      </BRow>
      <BRow class="mt-3">
        <BCol>
          <BButton
            v-if="collapsed"
            size="sm"
            v-on:click="toggleAll"
          >
            <i class="fa fa-angle-double-right" /> {{ label.expandAll }}
          </BButton>
          <BButton
            v-if="!collapsed"
            size="sm"
            v-on:click="toggleAll"
          >
            <i class="fa fa-angle-double-down" /> {{ label.collapseAll }}
          </BButton>
        </BCol>
        <BCol>
          <BPagination
            v-model="page"
            align="center"
            size="sm"
            v-bind:total-rows="filteredCorrespDesc.results.length"
            v-bind:per-page="10"
            v-on:change="closeAll"
          />
        </BCol>
        <BCol>
          <BInputGroup
            size="sm"
            prepend="Filter"
          >
            <BFormSelect v-model="filter.type">
              <option value="name">
                {{ label.byName }}
              </option>
              <option value="place">
                {{ label.byPlace }}
              </option>
              <option value="date">
                {{ label.byDate }}
              </option>
              <option value="key">
                {{ label.byKey }}
              </option>
              <option value="id">
                {{ label.byID }}
              </option>
            </BFormSelect>
            <BFormInput v-model="filter.text" />
          </BInputGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol role="tablist">
          <BCard
            v-for="(item, k) in filteredCorrespDesc.paginatedResults"
            v-bind:id="item.id"
            v-bind:key="'cd_' + item.id"
            no-body
            class="mb-2"
          >
            <BCardHeader
              header-tag="header"
              role="tab"
              class="bg-white border-0"
            >
              <BRow>
                <BCol cols="1">
                  <BButtonToolbar>
                    <BButtonGroup>
                      <BButton
                        v-bind:class="item.visible ? 'collapsed' : null"
                        v-bind:aria-controls="'collapse' + k"
                        v-bind:aria-expanded="item.visible ? 'true' : 'false'"
                        class="border-right"
                        size="sm"
                        v-on:click="item.visible = !item.visible"
                      >
                        <i
                          class="fa"
                          v-bind:class="(item.visible) ? 'fa-angle-up' : 'fa-angle-down'"
                        />
                      </BButton>
                      <BButton
                        v-if="correspDesc.length > 1"
                        size="sm"
                        class="border-left"
                        v-on:click="rmCorrespDescItem(item.id)"
                      >
                        <i class="fa fa-trash-alt" />
                      </BButton>
                    </BButtonGroup>
                  </BButtonToolbar>
                </BCol>
                <BCol
                  class="float-left"
                  v-html="item.header"
                />
              </BRow>
            </BCardHeader>
            <BCollapse
              v-bind:id="'collapse' + k"
              v-model="item.visible"
              role="tabpanel"
            >
              <BCardBody class="correspDescCardBody">
                <BFormGroup
                  v-bind:label-cols="2"
                  v-bind:label="label.key"
                  v-bind:label-for="'correspDescKey' + item.id"
                  label-size="sm"
                  class="mb-1"
                >
                  <BFormInput
                    v-bind:id="'correspDescKey' + item.id"
                    v-model="item.key"
                    size="sm"
                    v-on:keyup.native="setHeader(item.id)"
                  />
                </BFormGroup>
                <BRow>
                  <BCol sm="2" />
                  <BCol class="p-px-11">
                    <BButton
                      size="sm"
                      class="mb-1"
                      v-on:click="item.refHidden = !item.refHidden"
                    >
                      <i
                        class="fa"
                        v-bind:class="(item.refHidden) ? 'fa-angle-down' : 'fa-angle-up'"
                      /> {{ label.reflink }}
                    </BButton>
                  </BCol>
                </BRow>
                <BFormGroup
                  v-if="!item.refHidden"
                  v-bind:label-cols="2"
                  v-bind:label="label.reflink"
                  v-bind:invalid-feedback="label.errorURLFormat"
                  label-size="sm"
                  label-for="correspDescRef"
                >
                  <BFormInput
                    id="correspDescRef"
                    v-model="item.ref"
                    size="sm"
                    type="url"
                    v-bind:state="state[item.id].urlToXml"
                    v-on:blur.native="state[item.id].urlToXml = setState('urlToXml', item.id)"
                  />
                </BFormGroup>
                <BFormGroup
                  v-if="$parent.biblData[0].text !== ''"
                  v-bind:label-cols="2"
                  v-bind:label="label.bibliography"
                  label-size="sm"
                  label-for="correspDescBibl"
                >
                  <BFormSelect
                    v-model="item.bibl"
                    size="sm"
                  >
                    <option
                      v-for="bib in $parent.biblData"
                      v-bind:key="'bib_' + item.id + bib.id"
                      v-bind:value="bib.id"
                    >
                      {{ (String(bib.text).length>100) ? String(bib.text).slice(0,100) + ' ...' : bib.text }}
                    </option>
                  </BFormSelect>
                </BFormGroup>
                <BRow>
                  <BCol
                    v-for="(tpe, tKey) in type"
                    v-bind:key="'t_' + item.id + tKey"
                  >
                    <h3>{{ label[tpe] }}</h3>
                    <BCard
                      v-for="(s, key) in item[tpe].persName"
                      v-bind:key="'ps_' + item.id + key"
                      no-body
                      class="mb-2"
                    >
                      <BCardHeader>
                        <BRow align-h="between">
                          <BCol cols="3">
                            <BButton
                              v-if="item[tpe].persName.length > 1"
                              size="sm"
                              v-on:click="rmPerson(tpe, item.id, key)"
                            >
                              <i class="fa fa-trash-alt" />
                            </BButton>
                          </BCol>
                          <BCol>
                            <BRow align-h="end">
                              <BCol cols="3">
                                <BFormCheckbox
                                  v-bind:id="tpe + 'Conjecture' + item.id + key"
                                  v-model="s.conjecture"
                                  unchecked-value="false"
                                  class="labelOnTop float-right"
                                >
                                  {{ label.conjecture }}
                                </BFormCheckbox>
                              </BCol>
                              <BCol cols="3">
                                <BFormCheckbox
                                  v-bind:id="tpe + 'Uncertain' + item.id + key"
                                  v-model="s.uncertain"
                                  unchecked-value="false"
                                  class="labelOnTop float-right"
                                >
                                  {{ label.uncertain }}
                                </BFormCheckbox>
                              </BCol>
                              <BCol cols="3">
                                <BFormCheckbox
                                  v-bind:id="tpe + 'Unknown' + item.id + key"
                                  v-model="s.unknown"
                                  class="labelOnTop float-right"
                                  v-on:change="setIdUnknown(tpe, item.id, key)"
                                >
                                  {{ label.unknown }}
                                </BFormCheckbox>
                              </BCol>
                            </BRow>
                          </BCol>
                        </BRow>
                      </BCardHeader>
                      <BCardBody>
                        <BFormGroup
                          label-size="sm"
                          v-bind:label="label.name"
                          v-bind:label-for="tpe + 'PersName' + key"
                          v-bind:invalid-feedback="label.errorMetaEditor"
                          class="labelOnTop"
                        >
                          <BFormInput
                            v-bind:id="tpe + 'PersName' + key"
                            v-model="s.text"
                            v-bind:state="state[item.id][tpe][key].name"
                            size="sm"
                            v-on:blur.native="addPersonToPool(tpe, item.id, key); state[item.id][tpe][key].name = setState(tpe + 'Name', item.id, key)"
                            v-on:keyup.native="onInput(tpe, item.id, key, false);"
                            v-on:keydown.esc.native="s.open = false"
                            v-on:keydown.down.native="moveDown(tpe, item.id, key)"
                            v-on:change="setHeader(item.id)"
                            v-on:keydown.up.native="moveUp(tpe, item.id, key)"
                            v-on:keydown.enter.native="select(tpe, item.id, key)"
                          />
                        </BFormGroup>
                        <BListGroup v-if="s.open && s.text.length > 2">
                          <BListGroupItem
                            v-for="(suggestion, suKey) in filterNames(tpe, item.id, key)"
                            v-bind:key="'pss_' + item.id + suKey"
                            v-bind:class="{'highlighted': suKey === s.highlighted}"
                            button
                            v-on:mousedown="select(tpe, item.id, key)"
                            v-on:mouseenter="s.highlighted = suKey"
                          >
                            {{ suggestion }}
                          </BListGroupItem>
                        </BListGroup>
                        <BFormGroup
                          label-size="sm"
                          v-bind:label="label[tpe + 'Authority']"
                          v-bind:label-for="tpe + 'PersID' + item.id + key"
                          class="labelOnTop"
                        >
                          <BInputGroup>
                            <BFormInput
                              v-bind:id="tpe + 'PersID' + item.id + key"
                              v-bind:ref="tpe + 'PersID' + item.id + key"
                              v-model="s.ref"
                              v-bind:state="state[item.id][tpe][key].id"
                              size="sm"
                              v-on:blur.native="addPersNorm(tpe, item.id, key); item[tpe].persName[key].gnd.open = false; state[item.id][tpe][key].id = setState(tpe + 'Authority', item.id, key)"
                              v-on:keydown.esc.native="item[tpe].persName[key].gnd.open = false"
                            />
                            <BInputGroupAppend>
                              <BButton
                                v-bind:id="tpe + 'GetGndBtn' + item.id + key"
                                variant="secondary"
                                v-bind:disabled="s.text === '' || s.unknown === true"
                                v-bind:title="label.gndBtnTitle"
                                target="_blank"
                                class="text-white"
                                v-on:click="getGnd(tpe, item.id, key)"
                              >
                                <i class="fa fa-address-card" />
                              </BButton>
                            </BInputGroupAppend>
                            <div class="invalid-feedback">
                              {{ label.errorAuthorityID }}
                            </div>
                          </BInputGroup>
                        </BFormGroup>
                        <BListGroup v-if="item[tpe].persName[key].gnd.open">
                          <BListGroupItem
                            v-for="(suggestion, kee) in item[tpe].persName[key].gnd.suggestions"
                            v-bind:key="'gnd_' + item.id + kee"
                            v-bind:class="{'highlighted': kee === item[tpe].persName[key].gnd.highlighted}"
                            button
                            v-on:mousedown="selectGnd(tpe, item.id, key, suggestion)"
                            v-on:mouseenter="item[tpe].persName[key].gnd.highlighted = kee"
                          >
                            {{ suggestion.label }}
                          </BListGroupItem>
                          <BListGroupItem
                            v-if="item[tpe].persName[key].gnd.suggestions.length > 9"
                            key="gndMore"
                            button
                            class="bg-secondary text-white"
                            v-on:mousedown="getMoreGnd(tpe, item.id, key)"
                          >
                            {{ label.more }}
                          </BListGroupItem>
                          <BListGroupItem
                            v-if="item[tpe].persName[key].gnd.suggestions.length === 0"
                            key="gndNoMatches"
                            button
                          >
                            {{ label.gndNoMatches }}
                          </BListGroupItem>
                        </BListGroup>
                        <BFormCheckbox
                          v-bind:id="tpe + 'Organisation' + item.id + key"
                          v-model="s.organisation"
                          class="labelOnTop"
                          v-on:input="addOrg(tpe, item.id, key)"
                        >
                          {{ label.org }}
                        </BFormCheckbox>
                      </BCardBody>
                    </BCard>
                    <BButton
                      size="sm"
                      variant="secondary"
                      v-on:click="addPerson(tpe, item.id);"
                    >
                      <i class="fas fa-plus-circle" /> {{ label['add' + tpe.charAt(0).toUpperCase() + tpe.slice(1)] }}
                    </BButton>
                    <BCard
                      v-for="(place, key) in item[tpe].placeName"
                      v-bind:key="'pl_' + item.id + key"
                      no-body
                      class="mb-2"
                    >
                      <BCardHeader>
                        <BRow align-h="between">
                          <BCol cols="2">
                            <BButton
                              v-if="item[tpe].placeName.length > 1"
                              size="sm"
                              v-on:click="rmPlace(tpe, item.id, key)"
                            >
                              <i class="fa fa-trash-alt" />
                            </BButton>
                          </BCol>
                          <BCol>
                            <BRow align-h="end">
                              <BCol cols="3">
                                <BFormCheckbox
                                  v-bind:id="tpe + 'PlaceConjecture' + item.id + key"
                                  v-model="place.conjecture"
                                  v-bind:disabled="place.text === ''"
                                  unchecked-value="false"
                                  class="labelOnTop float-right"
                                >
                                  {{ label.conjecture }}
                                </BFormCheckbox>
                              </BCol>
                              <BCol cols="3">
                                <BFormCheckbox
                                  v-bind:id="tpe + 'PlaceUncertain' + item.id + key"
                                  v-model="place.uncertain"
                                  v-bind:disabled="place.text === ''"
                                  unchecked-value="false"
                                  class="labelOnTop float-right"
                                >
                                  {{ label.uncertain }}
                                </BFormCheckbox>
                              </BCol>
                            </BRow>
                          </BCol>
                        </BRow>
                      </BCardHeader>
                      <BCardBody>
                        <BFormGroup
                          label-size="sm"
                          v-bind:label-for="tpe + 'Place' + item.id + key"
                          v-bind:label="label.place"
                          class="labelOnTop"
                        >
                          <BFormInput
                            v-bind:id="tpe + 'Place' + item.id + key"
                            v-model="place.text"
                            size="sm"
                            v-on:blur.native="addPlaceToPool(tpe, item.id, key)"
                            v-on:keyup.native="onInput(tpe, item.id, key, true);"
                            v-on:keydown.esc.native="place.open = false"
                            v-on:keydown.down.native="moveDown(tpe, item.id, key, true)"
                            v-on:keydown.up.native="moveUp(tpe, item.id, key, true)"
                            v-on:keydown.enter.native="select(tpe, item.id, key, true)"
                          />
                        </BFormGroup>
                        <BListGroup v-if="place.open && place.text.length > 2">
                          <BListGroupItem
                            v-for="(suggestion, suKey) in filterNames(tpe, item.id, key, true)"
                            v-bind:key="'psp_' + item.id + suKey"
                            button
                            v-bind:class="{'highlighted': suKey === place.highlighted}"
                            v-on:mousedown="select(tpe, item.id, key, true)"
                            v-on:mouseenter="place.highlighted = suKey"
                          >
                            {{ suggestion }}
                          </BListGroupItem>
                        </BListGroup>
                        <BFormGroup
                          label-size="sm"
                          v-bind:label="label.placeAuthority"
                          class="labelOnTop"
                          v-bind:label-for="tpe + 'PlaceID' + item.id + key"
                        >
                          <BInputGroup>
                            <BFormInput
                              v-bind:id="tpe + 'PlaceID' + item.id + key"
                              v-bind:ref="tpe + 'PlaceID' + item.id + key"
                              v-model="place.ref"
                              v-bind:state="state[item.id][tpe + 'Place'][key].id"
                              size="sm"
                              class="no-right-border"
                              v-on:blur.native="addPlaceNorm(tpe, item.id, key); place.geo.open = false; state[item.id][tpe + 'Place'][key].id = setState(tpe + 'PlaceAuthority', item.id, key)"
                              v-on:keydown.esc.native="place.geo.open = false"
                            />
                            <BInputGroupAppend>
                              <BFormSelect
                                v-model="place.geo.parameter"
                                size="sm"
                                v-bind:disabled="place.text === ''"
                              >
                                <option value="P">
                                  {{ label.geodataP }}
                                </option>
                                <!-- <option value="A">{{ label.geodataA }}</option> -->
                                <!-- <option value="H">{{ label.geodataH }}</option> -->
                                <option value="T">
                                  {{ label.geodataT }}
                                </option>
                                <!-- <option value="V">{{ label.geodataV }}</option> -->
                                <!-- <option value="L">{{ label.geodataL }}</option> -->
                                <option value="S">
                                  {{ label.geodataS }}
                                </option>
                              </BFormSelect>
                              <BButton
                                variant="secondary"
                                v-bind:disabled="place.text === ''"
                                class="text-white"
                                v-on:click="getGeodata(tpe, item.id, key)"
                              >
                                <i class="fa fa-globe" />
                              </BButton>
                            </BInputGroupAppend>
                            <div class="invalid-feedback">
                              {{ label.errorGeoNames }}
                            </div>
                          </BInputGroup>
                        </BFormGroup>
                        <BListGroup v-if="place.geo.open">
                          <BListGroupItem
                            v-for="(suggestion, suKey) in place.geo.suggestions"
                            v-bind:key="'geo_' + item.id + suKey"
                            button
                            v-bind:class="{'highlighted': suKey === place.geo.highlighted}"
                            v-on:mousedown="selectGeoname(tpe, item.id, key, suggestion)"
                            v-on:mouseenter="place.geo.highlighted = suKey"
                          >
                            {{ suggestion.name }}, {{ suggestion.adminName1 }} ({{ suggestion.countryCode }})
                          </BListGroupItem>
                        </BListGroup>
                      </BCardBody>
                    </BCard>
                    <BButton
                      size="sm"
                      variant="secondary"
                      v-on:click="addPlace(tpe, item.id);"
                    >
                      <i class="fas fa-plus-circle" /> {{ label.addPlace }}
                    </BButton>
                    <BCard no-body>
                      <BCardHeader>
                        <BRow>
                          <BCol v-bind:cols="(item[tpe].date === 'nba' || item[tpe].date === 'na' || item[tpe].date === '') ? '12' : '5'">
                            <BFormSelect
                              v-model="item[tpe].date"
                              size="sm"
                            >
                              <option value="">
                                {{ label.dateForm }}
                              </option>
                              <option value="when">
                                {{ label.dateWhen }}
                              </option>
                              <option value="nba">
                                {{ label.dateNba }}
                              </option>
                              <option value="span">
                                {{ label.dateSpan }}
                              </option>
                              <option value="na">
                                {{ label.noDate }}
                              </option>
                            </BFormSelect>
                          </BCol>
                          <BCol
                            v-if="(item[tpe].date !== 'nba' && item[tpe].date !== 'na' && item[tpe].date !== '')"
                            v-bind:cols="(item[tpe].date === 'nba' || item[tpe].date === 'na' || item[tpe].date === '') ? '0' : '7'"
                          >
                            <BRow align-h="end">
                              <BCol
                                cols="7"
                                class="pr-0 pt-1"
                              >
                                <BFormCheckbox
                                  v-bind:id="tpe + 'DateConjecture' + item.id"
                                  v-model="item[tpe].dateCert.conjecture"
                                  class="labelOnTop float-right"
                                >
                                  {{ label.conjecture }}
                                </BFormCheckbox>
                              </BCol>
                              <BCol class="pt-1">
                                <BFormCheckbox
                                  v-bind:id="tpe + 'DateUncertain' + item.id"
                                  v-model="item[tpe].dateCert.uncertain"
                                  class="labelOnTop float-right"
                                >
                                  {{ label.uncertain }}
                                </BFormCheckbox>
                              </BCol>
                            </BRow>
                          </BCol>
                        </BRow>
                      </BCardHeader>
                      <BCardBody>
                        <BAlert
                          variant="warning"
                          v-bind:show="item[tpe].date === ''"
                          size="sm"
                        >
                          {{ label.selectDateForm }}
                        </BAlert>
                        <BFormGroup
                          v-if="item[tpe].date === 'when'"
                          description="YYYY-MM-DD"
                          class="labelOnTop"
                          v-bind:invalid-feedback="label.errorDate"
                        >
                          <BFormInput
                            v-bind:id="tpe + 'DateWhen' + item.id"
                            v-model="item[tpe].when"
                            size="sm"
                            v-bind:class="(valiDateWarn(item[tpe].when) && state[item.id][tpe + 'Date'].when !== false) ? 'input-warning' : ''"
                            v-bind:state="(state[item.id][tpe + 'Date'].when) ? (valiDateWarn(item[tpe].when) ? '' : true) : state[item.id][tpe + 'Date'].when"
                            v-on:blur.native="state[item.id][tpe + 'Date'].when = setState('when' + tpe.charAt(0).toUpperCase() + tpe.slice(1), item.id); ee(item[tpe].when, item[tpe])"
                          />
                          <div
                            v-if="valiDateWarn(item[tpe].when)"
                            class="input-warning feedback-warning"
                          >
                            {{ label.feedbackWarning }}
                          </div>
                        </BFormGroup>
                        <BFormGroup
                          v-if="item[tpe].date === 'nba'"
                          description="YYYY-MM-DD"
                          class="labelOnTop"
                          v-bind:label="label.dateNb"
                          v-bind:label-for="tpe + 'DateNb' + item.id"
                          v-bind:invalid-feedback="label.errorDate"
                        >
                          <BFormInput
                            v-bind:id="tpe + 'DateNb' + item.id"
                            v-model="item[tpe].notBefore"
                            size="sm"
                            v-bind:class="(valiDateWarn(item[tpe].notBefore) && state[item.id][tpe + 'Date'].notBefore !== false) ? 'input-warning' : ''"
                            v-bind:state="(state[item.id][tpe + 'Date'].notBefore) ? (valiDateWarn(item[tpe].notBefore) ? '' : true) : state[item.id][tpe + 'Date'].notBefore"
                            v-on:blur.native="state[item.id][tpe + 'Date'].notBefore = setState('notBefore' + tpe.charAt(0).toUpperCase() + tpe.slice(1), item.id)"
                          />

                          <div
                            v-if="valiDateWarn(item[tpe].notBefore)"
                            class="input-warning feedback-warning"
                          >
                            {{ label.feedbackWarning }}
                          </div>
                        </BFormGroup>
                        <BFormGroup
                          v-if="item[tpe].date === 'nba'"
                          description="YYYY-MM-DD"
                          class="labelOnTop"
                          v-bind:label="label.dateNa"
                          v-bind:label-for="tpe + 'DateNa' + item.id"
                          v-bind:invalid-feedback="label.errorDate"
                        >
                          <BFormInput
                            v-bind:id="tpe +'DateNa' + item.id"
                            v-model="item[tpe].notAfter"
                            size="sm"
                            v-bind:class="(valiDateWarn(item[tpe].notAfter) && state[item.id][tpe + 'Date'].notAfter !== false) ? 'input-warning' : ''"
                            v-bind:state="(state[item.id][tpe + 'Date'].notAfter) ? (valiDateWarn(item[tpe].notAfter) ? '' : true) : state[item.id][tpe + 'Date'].notAfter"
                            v-on:blur.native="state[item.id][tpe + 'Date'].notAfter = setState('notAfter' + tpe.charAt(0).toUpperCase() + tpe.slice(1), item.id)"
                          />
                          <div
                            v-if="valiDateWarn(item[tpe].notAfter)"
                            class="input-warning feedback-warning"
                          >
                            {{ label.feedbackWarning }}
                          </div>
                        </BFormGroup>
                        <BFormGroup
                          v-if="item[tpe].date === 'span'"
                          description="YYYY-MM-DD"
                          class="labelOnTop"
                          v-bind:label="label.from"
                          v-bind:label-for="tpe + 'DateFrom' + item.id"
                          v-bind:invalid-feedback="label.errorDate"
                        >
                          <BFormInput
                            v-bind:id="tpe + 'DateFrom' + item.id"
                            v-model="item[tpe].spanFrom"
                            size="sm"
                            v-bind:class="(valiDateWarn(item[tpe].spanFrom) && state[item.id][tpe + 'Date'].spanFrom !== false) ? 'input-warning' : ''"
                            v-bind:state="(state[item.id][tpe + 'Date'].spanFrom) ? (valiDateWarn(item[tpe].spanFrom) ? '' : true) : state[item.id][tpe + 'Date'].spanFrom"
                            v-on:blur.native="state[item.id][tpe + 'Date'].from = setState('spanFrom' + tpe.charAt(0).toUpperCase() + tpe.slice(1), item.id)"
                          />
                          <div
                            v-if="valiDateWarn(item[tpe].spanFrom)"
                            class="input-warning feedback-warning"
                          >
                            {{ label.feedbackWarning }}
                          </div>
                        </BFormGroup>
                        <BFormGroup
                          v-if="item[tpe].date === 'span'"
                          description="YYYY-MM-DD"
                          class="labelOnTop"
                          v-bind:label="label.to"
                          v-bind:label-for="tpe + 'DateTo' + item.id"
                          v-bind:invalid-feedback="label.errorDate"
                        >
                          <BFormInput
                            v-bind:id="tpe + 'DateTo' + item.id"
                            v-model="item[tpe].spanTo"
                            size="sm"
                            v-bind:class="(valiDateWarn(item[tpe].spanTo) && state[item.id][tpe + 'Date'].spanTo !== false) ? 'input-warning' : ''"
                            v-bind:state="(state[item.id][tpe + 'Date'].spanTo) ? (valiDateWarn(item[tpe].spanTo) ? '' : true) : state[item.id][tpe + 'Date'].spanTo"
                            v-on:blur.native="state[item.id][tpe + 'Date'].to = setState('spanTo' + tpe.charAt(0).toUpperCase() + tpe.slice(1), item.id)"
                          />
                          <div
                            v-if="valiDateWarn(item[tpe].spanTo)"
                            class="input-warning feedback-warning"
                          >
                            {{ label.feedbackWarning }}
                          </div>
                        </BFormGroup>
                        <BButton
                          size="sm"
                          class="mb-1"
                          v-on:click="item[tpe].dateAsTextHidden = !item[tpe].dateAsTextHidden"
                        >
                          <i
                            class="fa"
                            v-bind:class="(item[tpe].dateAsTextHidden) ? 'fa-angle-down' : 'fa-angle-up'"
                          /> {{ label.dateText }}
                        </BButton>
                        <BFormInput
                          v-if="!item[tpe].dateAsTextHidden"
                          v-bind:id="tpe + 'DateText' + item.id"
                          v-model="item[tpe].dateAsText"
                          size="sm"
                        />
                      </BCardBody>
                    </BCard>
                  </BCol>
                </BRow>
              </BCardBody>
            </BCollapse>
          </BCard>
        </BCol>
      </BRow>
      <BRow class="mt-2">
        <BCol>
          <BButton
            size="sm"
            variant="secondary"
            v-on:click="addCorrespDescItem"
          >
            <i class="fas fa-plus-circle" /> {{ label.addCdItem }}
          </BButton>
        </BCol>
        <BCol>
          <BPagination
            v-model="page"
            align="center"
            size="sm"
            class="mb-0"
            v-bind:total-rows="filteredCorrespDesc.results.length"
            v-bind:per-page="10"
          />
        </BCol>
        <BCol />
      </BRow>
    </BContainer>
    <div id="fullscreen">
      <div id="bluescreen">
        <p>
          A letter has been detected and windows has been shutdown to prevent
          damage to your computer.
        </p>
        <p>
          The system encountered an uncorrectable error.
        </p>
        <p>
          REQUEST_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING.
        </p>
        <p>
          If this is the first time you've seen this screen,
          restart your life. If this screen appears again, follow these steps:
        </p>
        <p>
          Check to make sure any new hardware or software is properly installed.
          If this is a new installation, ask your hardware or software manufacturer
          for any updates you might need.
        </p>
        <p>
          If problems continue disable or remove any newly installed hardware
          or software. Disable BRAIN memory options such as caching or shadowing.
          If you need to use Safe Mode to remove or disable components, restart
          yourself, press F8 to select Advanced Startup Options, and then
          select Safe Mode.
        </p>
        <p>
          You can simply press Esc or F11 to escape this answer but you
          should be aware of your universal ignorance.
        </p>
        <p>
          Technical information:
        </p>
        <p>
          ***ANSWER: <span id="ee_answer">
            42
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      default: () => [],
    },
    correspDescState: {
      type: Array,
      twoWays: true,
      default: () => [],
    },
  },
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
  methods: {

    blinker() {
      document.getElementById('ee_answer').style.display = 'none';
      setTimeout(() => { document.getElementById('ee_answer').style.display = 'inline'; }, 500);
    },

    ee(value, item) {
      if (value === '7502019' && item.persName[0].text === 'Deep Thought') {
        setInterval(this.blinker, 1000);
        const fullscreen = document.getElementById('fullscreen');
        if (fullscreen.requestFullscreen) {
          fullscreen.requestFullscreen();
        } else if (fullscreen.mozRequestFullScreen) {
          fullscreen.mozRequestFullScreen();
        } else if (fullscreen.webkitRequestFullScreen) {
          fullscreen.webkitRequestFullScreen();
        } else if (fullscreen.msRequestFullscreen) {
          fullscreen.msRequestFullscreen();
        }
      }
    },

    valiDateWarn(value) {
      const date = value.split('-');
      if (parseInt(date[0], 10) > 1999) {
        return true;
      }
      return false;
    },
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
        } ${
          (this.correspDesc[id].sender.persName.length > 1) ? 'et al.' : ''
        }</small>` : '';
      this.correspDesc[id].header += (this.correspDesc[id].receiver.persName[0].text)
        ? `<span class="badge badge-secondary mr-1">${
          this.label.headTo
        }</span><small class="mr-2 ml-1">${
          this.correspDesc[id].receiver.persName[0].text
        } ${
          (this.correspDesc[id].receiver.persName.length > 1) ? 'et al.' : ''
        }</small>` : '';
    },

    // Set Norm-ID for unknown person
    setIdUnknown(target, id, key) {
      this.$nextTick(() => {
        if (this.correspDesc[id][target].persName[key].unknown) {
          this.correspDesc[id][target].persName[key].ref = (
            this.correspDesc[id][target].persName[key].ref.trim() !== ''
          ) ? this.correspDesc[id][target].persName[key].ref : this.uriUnknown;
          this.correspDesc[id][target].persName[key].text = (
            this.correspDesc[id][target].persName[key].text.trim() !== ''
          ) ? this.correspDesc[id][target].persName[key].text : this.label.unknown;
          this.state[id][target][key].id = (this.correspDesc[id][target].persName[key].ref.trim() !== '');
          this.state[id][target][key].name = (this.correspDesc[id][target].persName[key].text.trim() !== '');
        } else {
          this.correspDesc[id][target].persName[key].ref = (
            this.correspDesc[id][target].persName[key].ref.trim() !== ''
            && this.correspDesc[id][target].persName[key].ref !== this.uriUnknown
          ) ? this.correspDesc[id][target].persName[key].ref : '';
          this.correspDesc[id][target].persName[key].text = (
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
              if (
                this.correspDesc[id][target].persName[persKey].ref !== ''
                && (this.correspDesc[j][e].persName[i].ref === this.correspDesc[id][target].persName[persKey].ref)
              ) {
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

            this.setHeader(id);
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
      this.$nextTick(() => {
        window.location.hash = `#${(this.nextKey - 1)}`;
        document.getElementById(`correspDescKey${(this.nextKey - 1)}`).focus();
      });
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
};

</script>
