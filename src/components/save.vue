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
  <div class="save">
    <BContainer>
      <BRow>
        <BCol>
          {{ label.step4Desc }}
        </BCol>
      </BRow>
      <BRow class="mt-3">
        <BCol>
          <BListGroup>
            <BListGroupItem v-bind:variant="(validationResults.meta) ? 'success' : 'danger'">
              <h3>
                {{ labels.step1 }}:
                <BBadge
                  variant="light"
                  class="ml-1 mr-1"
                >
                  {{ metaFails.length }}
                </BBadge>
                {{ label.errors }}
                <i
                  v-if="validationResults.meta"
                  class="fas fa-check ml-3"
                />
              </h3>
              <ul v-if="metaFails.length > 0">
                <li
                  v-for="(item, errKey) in metaFails"
                  v-bind:key="'meta' + errKey"
                >
                  <span class="font-weight-bold mr-1">
                    {{ item.split(/:(.+)/)[0] }}:
                  </span>
                  {{ item.split(/:(.+)/)[1] }}
                </li>
              </ul>
              <BButton
                v-if="!validationResults.meta"
                size="sm"
                variant="danger"
                class="text-white"
                v-on:click="$parent.navigate('meta')"
              >
                <i class="fas fa-edit" /> {{ label.jumpToMeta }}
              </BButton>
            </BListGroupItem>
            <BListGroupItem v-bind:variant="(validationResults.bibl) ? 'success' : 'danger'">
              <h3>
                {{ labels.step2 }}:
                <BBadge
                  variant="light"
                  class="ml-1 mr-1"
                >
                  {{ biblFails.length }}
                </BBadge>
                {{ label.errors }}
                <i
                  v-if="validationResults.bibl"
                  class="fas fa-check ml-3"
                />
              </h3>
              <ul v-if="biblFails.length > 0">
                <li
                  v-for="(item, errKey) in biblFails"
                  v-bind:key="'bibl' + errKey"
                >
                  <span class="font-weight-bold mr-1">
                    {{ item.split(/:(.+)/)[0] }}:
                  </span>
                  {{ item.split(/:(.+)/)[1] }}
                </li>
              </ul>
              <BButton
                v-if="!validationResults.bibl"
                size="sm"
                class="text-white"
                variant="danger"
                v-on:click="$parent.navigate('bibl')"
              >
                <i class="fas fa-edit" /> {{ label.jumpToBibl }}
              </BButton>
            </BListGroupItem>
            <BListGroupItem v-bind:variant="(validationResults.correspDesc) ? 'success' : 'danger'">
              <h3>
                {{ labels.step3 }}:
                <BBadge
                  variant="light"
                  class="ml-1 mr-1"
                >
                  {{ correspDescFails.length }}
                </BBadge>
                {{ (correspDescFails.length === 1) ? label.letterError : label.letterErrors }}
                <i
                  v-if="validationResults.correspDesc"
                  class="fas fa-check ml-3"
                />
              </h3>
              <ul v-if="errorNoIds.place || errorNoIds.pers">
                <li v-if="errorNoIds.pers">
                  {{ label.errorNoPersId }}
                </li>
                <li v-if="errorNoIds.place">
                  {{ label.errorNoPlaceId }}
                </li>
              </ul>
              <BButton
                v-if="!validationResults.correspDesc"
                size="sm"
                class="text-white mb-3"
                variant="danger"
                v-on:click="$parent.navigate('correspDesc')"
              >
                <i class="fas fa-edit" /> {{ label.jumpToCd }}
              </BButton>
              <BListGroup v-if="correspDescFails.length > 0">
                <BListGroupItem
                  v-for="(item, errKey) in correspDescFails"
                  v-bind:key="'correspDesc' + errKey"
                  variant="danger"
                  class="danger-light"
                >
                  <span class="font-weight-bold">
                    {{ (item.key) ? label.letterKey : label.id }} {{ (!item.key) ? item.id : '' }}
                  </span>
                  <span
                    v-if="item.key !== ''"
                    class="font-weight-bold"
                  >
                    {{ item.key }}
                  </span>
                  <span v-if="item.sender !== ''">
                    {{ label.headBy }}
                  </span>
                  <span
                    v-if="item.sender !== ''"
                    class="font-weight-bold"
                  >
                    {{ item.sender }}
                  </span>
                  <span v-if="item.receiver !== ''">
                    {{ label.headTo }}
                  </span>
                  <span
                    v-if="item.receiver !== ''"
                    class="font-weight-bold"
                  >
                    {{ item.receiver }}
                  </span>
                  <ul v-if="item.fields.length">
                    <li
                      v-for="f in item.fields"
                      v-bind:key="item.fields.indexOf(f)"
                    >
                      <span class="font-weight-bold">
                        {{ f.split(/:(.+)/)[0] }}
                      </span>: {{ f.split(/:(.+)/)[1] }}
                    </li>
                  </ul>
                  <BButton
                    size="sm"
                    variant="danger"
                    class="text-white ml-1"
                    v-on:click="goToInvalidLetter(item.id, item.key)"
                  >
                    <i class="fas fa-edit" /> {{ label.jumpToLetter }}
                  </BButton>
                </BListGroupItem>
              </BListGroup>
            </BListGroupItem>
          </BListGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol class="mt-3">
          <BFormCheckbox
            id="downloadAsJSON"
            v-model="downloadType"
            value="json"
            unchecked-value="xml"
          >
            {{ label.downloadAsJson }}
          </BFormCheckbox>
          <BButton
            v-bind:href="downloadLink[downloadType]"
            v-bind:download="downloadFileName[downloadType]"
            class="text-white btn-block mt-3"
            size="lg"
          >
            {{ (validationResults.meta && validationResults.bibl && validationResults.correspDesc) ? label.download : label.draft }}
          </BButton>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>
export default {
  /* eslint-disable-next-line */
  name: 'Save',
  props: {
    labels: {
      type: Object,
      default: () => {},
    },
    metaData: {
      type: Object,
      default: () => {},
    },
    biblData: {
      type: Array,
      default: () => [],
    },
    correspDescData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      label: this.labels,

      meta: this.metaData,
      bibl: this.biblData,
      correspDesc: this.correspDescData,

      downloadLink: {
        json: '',
        xml: '',
      },
      downloadFileName: {
        json: '',
        xml: '',
      },
      downloadType: 'json',

      validationResults: {
        meta: false,
        bibl: false,
        correspDesc: false,
      },

      metaFails: [],
      biblFails: [],
      correspDescFails: [],
      errorNoIds: {
        pers: false,
        place: false,
      },
    };
  },

  mounted() {
    // Validate and save feedback
    this.validationResults.meta = this.validate('meta', true);
    this.validationResults.bibl = this.validate('bibl', true);
    this.validationResults.correspDesc = this.validate('correspDesc', true);

    this.prepare();
  },

  methods: {
    // Validate Values and in case of correspDesc Feedback, which fields are invalid
    validate(target, feedback = false) {
      let status = {
        meta: false,
        bibl: false,
        correspDesc: false,
      };
      switch (target) {
        case 'meta': {
          const fields = [];
          let state = true;
          if (this.meta.title === '') {
            fields.push(`${this.label.title}: ${this.label.errorMetaTitle}`);
            state = false;
          }
          this.meta.editor.forEach((e, i) => {
            if (e.name === '') {
              state = false;
              fields.push(`${this.label.editor} ${i + 1}: ${this.label.errorMetaEditor}`);
            }
            if (!this.$parent.check('email', e.email)) {
              state = false;
              if (e.email !== '') {
                fields.push(`${this.label.editor} ${i + 1}: ${this.label.errorMetaEmailFormat}`);
              } else {
                fields.push(`${this.label.editor} ${i + 1}: ${this.label.errorMetaEmailEmpty}`);
              }
            }
          });
          this.meta.publisher.forEach((e, i) => {
            if (e.name === '') {
              state = false;
              fields.push(`${this.label.publisher} ${(i + 1)}: ${this.label.errorMetaPublisher}`);
            }
            if (e.url !== '' && !this.$parent.check('url', e.url)) {
              state = false;
              fields.push(`${this.label.publisher} ${(i + 1)}: ${this.label.errorURLFormat}`);
            }
          });
          if (this.meta.url !== '' && !this.$parent.check('url', this.meta.url)) {
            state = false;
            fields.push(`${this.label.urlToXml}: ${this.label.errorURLFormat}`);
          }
          if (this.meta.licence === '') {
            fields.push(`${this.label.licence}: ${this.label.errorMetaLicence}`);
            state = false;
          }
          status.meta = (state);
          if (feedback) this.metaFails = fields;
          break;
        }
        case 'bibl': {
          const fields = [];
          let state = true;
          if (this.bibl.length > 0) {
            for (let i = 0; i < this.bibl.length; i += 1) {
              if (this.bibl[i].type === null) {
                if (this.bibl.length > 1) fields.push(`${this.label.bibInfo} ${i + 1}, ${this.label.bibType}: ${this.label.errorBiblType}`);
                else fields.push(`${this.label.bibType}: ${this.label.errorBiblType}`);
                state = false;
              }
              if (this.bibl[i].text === '') {
                if (this.bibl.length > 1) fields.push(`${this.label.bibInfo} ${i + 1}, ${this.label.bibTitle}: ${this.label.errorBibl}`);
                else fields.push(`${this.label.bibTitle}: ${this.label.errorBibl}`);
                state = false;
              }
              if (this.bibl[i].url !== '' && !this.$parent.check('url', this.bibl[i].url)
                && (this.bibl[i].type === 'online' || this.bibl[i].type === 'hybrid')) {
                if (this.bibl.length > 1) {
                  fields.push(`${this.label.bibInfo} ${i + 1}, ${this.label.bibUrl}: ${this.label.errorURLFormat}`);
                } else { fields.push(`${this.label.bibUrl}: ${this.label.errorURLFormat}`); }
                state = false;
              }
            }
            if (feedback) this.biblFails = fields;
            status.bibl = state;
          }
          break;
        }
        case 'correspDesc': {
          let state = true;
          let checkPersId = false;
          let checkPlaceId = false;
          for (let i = 0; i < this.correspDesc.length; i += 1) {
            let cdState = true;
            const fields = {
              id: this.correspDesc[i].id,
              key: (this.correspDesc[i].key),
              sender: this.correspDesc[i].sender.persName[0].text,
              receiver: this.correspDesc[i].receiver.persName[0].text,
              fields: [],
            };
            if (this.correspDesc[i].ref !== ''
              && !this.$parent.check('url', this.correspDesc[i].ref)) {
              state = false;
              cdState = false;
              fields.fields.push(`${this.labels.reflink}: ${this.labels.errorURLFormat}`);
            }
            ['sender', 'receiver'].forEach((t) => { // eslint-disable-line no-loop-func
              for (let j = 0; j < this.correspDesc[i][t].persName.length; j += 1) {
                if (this.correspDesc[i][t].persName[j].text === '') {
                  state = false;
                  cdState = false;
                  fields.fields.push(`${this.labels[t]} ${j + 1}, ${this.labels[t]}: ${this.labels.errorName}`);
                }
                if (
                  this.correspDesc[i][t].persName[j].ref !== ''
                  && this.correspDesc[i][t].persName[j].ref !== undefined
                  && !this.$parent.check('person', this.correspDesc[i][t].persName[j].ref)
                ) {
                  state = false;
                  cdState = false;
                  fields.fields.push(`${this.labels[t]} ${j + 1}, ${this.labels[`${t}Authority`]}: ${this.labels.errorAuthorityID}`);
                }
                if (this.correspDesc[i][t].persName[j].ref !== '') checkPersId = true;
              }

              for (let j = 0; j < this.correspDesc[i][t].placeName.length; j += 1) {
                if (
                  this.correspDesc[i][t].placeName[j].ref !== ''
                  && this.correspDesc[i][t].placeName[j].ref !== undefined
                  && !this.$parent.check('place', this.correspDesc[i][t].placeName[j].ref)
                ) {
                  state = false;
                  cdState = false;
                  fields.fields.push(`${this.labels[t]} ${j + 1}, ${this.labels.placeAuthority}: ${this.labels.errorGeoNames}`);
                }
                if (this.correspDesc[i][t].placeName[j].ref !== '') checkPlaceId = true;
              }

              if (
                this.correspDesc[i][t].date === 'when'
                && this.correspDesc[i][t].when !== ''
                && !this.$parent.check('date', this.correspDesc[i][t].when)
              ) {
                state = false;
                cdState = false;
                fields.fields.push(`${this.labels[t]}, ${this.labels.dateWhen}: ${this.labels.errorDate}`);
              }
              if (
                this.correspDesc[i][t].date === 'nba'
                && (
                  (
                    this.correspDesc[i][t].notBefore !== ''
                    && !this.$parent.check('date', this.correspDesc[i][t].notBefore)
                  ) || (
                    this.correspDesc[i][t].notAfter !== ''
                    && !this.$parent.check('date', this.correspDesc[i][t].notAfter)
                  )
                )
              ) {
                state = false;
                cdState = false;
                fields.fields.push(`${this.labels[t]}, ${this.labels.dateNba}: ${this.labels.errorDate}`);
              }
              if (
                this.correspDesc[i][t].date === 'span'
                && (
                  this.correspDesc[i][t].spanFrom !== ''
                  || this.correspDesc[i][t].spanTo !== ''
                ) && (
                  !this.$parent.check('date', this.correspDesc[i][t].spanFrom)
                  || !this.$parent.check('date', this.correspDesc[i][t].spanTo)
                )
              ) {
                state = false;
                cdState = false;
                fields.fields.push(`${this.labels[t]}, ${this.labels.dateSpan}: ${this.labels.errorDate}`);
              }
            });
            if (!cdState && feedback) {
              let match = false;
              for (let k = 0; k < this.correspDescFails.length; k += 1) {
                if (this.correspDescFails[k].id === this.correspDesc[i].id) {
                  match = true;
                  break;
                }
              }
              if (!match) {
                this.correspDescFails.push(fields);
              }
            }
          }

          if (!checkPersId) {
            state = false;
            this.errorNoIds.pers = true;
          }
          if (!checkPlaceId) {
            state = false;
            this.errorNoIds.place = true;
          }

          status.correspDesc = state;
          break;
        }
        default: {
          status = {
            meta: false,
            bibl: false,
            correspDesc: false,
          };
        }
      }
      return status[target];
    },

    // Jump to invalid letter
    goToInvalidLetter(id, key) {
      if (key) this.$parent.navigate('correspDesc', ['key', key]);
      else this.$parent.navigate('correspDesc', ['id', id]);
    },

    // Prepare Data for Saving
    prepare() {
      let json = {
        teiHeader: {
          fileDesc: {
            titleStmt: {
              title: null,
              editor: [
                {
                  '#text': null,
                  email: null,
                },
              ],
            },
            publicationStmt: {
              publisher: [
                {
                  ref: {
                    target: null,
                    '#text': null,
                  },
                },
              ],
              idno: {
                type: null,
                '#text': null,
              },
              date: {
                when: null,
              },
              availability: {
                licence: {
                  target: null,
                  '#text': null,
                },
              },
            },
            sourceDesc: {
              bibl: [],
            },
          },
          profileDesc: {
            correspDesc: [],
          },
        },
      };
      /* *** */
      /* if (this.validationResults.meta
      /*    && this.validationResults.bibl
      /*    && this.validationResults.correspDesc) {
      /* *** */
      // Generating time
      const currentDate = new Date();
      const timezone = currentDate.getTimezoneOffset() / 60;

      let timezoneString = '';
      if (timezone > -10 && timezone < 10) {
        timezoneString = String(timezone);
        timezoneString = (timezoneString.includes('-')) ? timezoneString.replace('-', '-0') : timezoneString = `0${timezoneString}`;
      } else {
        timezoneString = String(timezone);
      }

      let now = `${currentDate.getFullYear()}-`;
      now += `${(`0${(currentDate.getMonth() + 1)}`).slice(-2)}-`;
      now += `${(`0${(currentDate.getDate() + 1)}`).slice(-2)}T`;
      now += `${(`0${(currentDate.getHours() + 1)}`).slice(-2)}:`;
      now += `${(`0${(currentDate.getMinutes() + 1)}`).slice(-2)}:`;
      now += `${(`0${(currentDate.getSeconds() + 1)}`).slice(-2)}.`;
      now += currentDate.getMilliseconds();
      now += `${timezoneString}:00`;

      // Prepare MetaData
      const editors = [];
      this.meta.editor.forEach((e) => {
        editors.push({
          '#text': e.name,
          email: e.email,
        });
      });

      json.teiHeader.fileDesc.titleStmt = {
        title: this.meta.title,
        editor: editors,
      };

      const publishers = [];
      this.meta.publisher.forEach((e) => {
        publishers.push({
          ref: {
            '#text': e.name,
            target: e.url,
          },
        });
      });

      json.teiHeader.fileDesc.publicationStmt = {
        publisher: publishers,
        idno: {
          type: this.meta.url ? 'url' : null,
          '#text': this.meta.url,
        },
        availability: {
          licence: {
            '#text': (this.meta.licence === 'CC0' || this.meta.licence === 'CC-BY 4.0') ? this.meta.licence : null,
            target: (this.meta.licence === 'CC0') ? 'https://creativecommons.org/publicdomain/zero/1.0/' : 'https://creativecommons.org/licenses/by/4.0/',
          },
        },
        date: {
          when: now,
        },
      };

      // Prepare BiblData
      for (let i = 0; i < this.bibl.length; i += 1) {
        json.teiHeader.fileDesc.sourceDesc.bibl.push({
          'xml:id': this.bibl[i].uuid, // To be changed
          type: this.bibl[i].type,
          '#text': this.bibl[i].text,
          ref: {
            target: this.bibl[i].url,
            '#text': this.bibl[i].url,
          },
        });
      }

      // Prepare correspDescData
      for (let i = 0; i < this.correspDesc.length; i += 1) {
        const persNames = {
          sender: [],
          receiver: [],
        };
        const orgNames = {
          sender: [],
          receiver: [],
        };
        const placeNames = {
          sender: [],
          receiver: [],
        };

        ['sender', 'receiver'].forEach((t) => {
          for (let j = 0; j < this.correspDesc[i][t].persName.length; j += 1) {
            if (this.correspDesc[i][t].persName[j].organisation) {
              orgNames[t].push({
                '#text': (this.correspDesc[i][t].persName[j].text) ? this.correspDesc[i][t].persName[j].text : 'Unknown',
                ref: this.correspDesc[i][t].persName[j].ref,
                evidence: (this.correspDesc[i][t].persName[j].conjecture) ? 'conjecture' : null,
                cert: (this.correspDesc[i][t].persName[j].uncertain) ? 'low' : null,
              });
            } else {
              persNames[t].push({
                '#text': (this.correspDesc[i][t].persName[j].text) ? this.correspDesc[i][t].persName[j].text : 'Unknown',
                ref: this.correspDesc[i][t].persName[j].ref,
                evidence: (this.correspDesc[i][t].persName[j].conjecture) ? 'conjecture' : null,
                cert: (this.correspDesc[i][t].persName[j].uncertain) ? 'low' : null,
              });
            }
          }
        });

        ['sender', 'receiver'].forEach((t) => {
          for (let j = 0; j < this.correspDesc[i][t].placeName.length; j += 1) {
            placeNames[t].push({
              '#text': this.correspDesc[i][t].placeName[j].text,
              ref: this.correspDesc[i][t].placeName[j].ref,
              evidence: (this.correspDesc[i][t].placeName[j].conjecture) ? 'conjecture' : null,
              cert: (this.correspDesc[i][t].placeName[j].uncertain) ? 'low' : null,
            });
          }
        });

        json.teiHeader.profileDesc.correspDesc.push({
          source: `#${this.getUuid(this.correspDesc[i].bibl)}`, // TODO: CHECK uuid -> Has to be changed
          ref: this.correspDesc[i].ref,
          key: this.correspDesc[i].key,
          correspAction: [
            {
              type: 'sent',
              persName: persNames.sender,
              orgName: orgNames.sender,
              placeName: placeNames.sender,
              date: {
                when: (this.correspDesc[i].sender.date === 'when') ? this.correspDesc[i].sender.when : null,
                from: (this.correspDesc[i].sender.date === 'span') ? this.correspDesc[i].sender.spanFrom : null,
                to: (this.correspDesc[i].sender.date === 'span') ? this.correspDesc[i].sender.spanTo : null,
                notBefore: (this.correspDesc[i].sender.date === 'nba') ? this.correspDesc[i].sender.notBefore : null,
                notAfter: (this.correspDesc[i].sender.date === 'nba') ? this.correspDesc[i].sender.notAfter : null,
                '#text': this.correspDesc[i].sender.dateAsText,
                cert: (this.correspDesc[i].sender.dateCert.uncertain) ? 'low' : null,
                evidence: (this.correspDesc[i].sender.dateCert.conjecture) ? 'conjecture' : null,
              },
            },
            {
              type: 'received',
              persName: persNames.receiver,
              orgName: orgNames.receiver,
              placeName: placeNames.receiver,
              date: {
                when: (this.correspDesc[i].receiver.date === 'when') ? this.correspDesc[i].receiver.when : null,
                from: (this.correspDesc[i].receiver.date === 'span') ? this.correspDesc[i].receiver.spanFrom : null,
                to: (this.correspDesc[i].receiver.date === 'span') ? this.correspDesc[i].receiver.spanTo : null,
                notBefore: (this.correspDesc[i].receiver.date === 'nba') ? this.correspDesc[i].receiver.notBefore : null,
                notAfter: (this.correspDesc[i].receiver.date === 'nba') ? this.correspDesc[i].receiver.notAfter : null,
                '#text': this.correspDesc[i].receiver.dateAsText,
                cert: (this.correspDesc[i].receiver.dateCert.uncertain) ? 'low' : null,
                evidence: (this.correspDesc[i].receiver.dateCert.conjecture) ? 'conjecture' : null,
              },
            },
          ],
        });
      }

      json = this.clear(json);
      if (this.metaFails.length === 0 && this.biblFails.length === 0 && this.correspDescFails.length === 0) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://correspsearch.net/api/v1.2/converter/json2xml.xql', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = () => {
          if (xhr.status === 200) {
            this.downloadType = 'xml';
            this.downloadLink.xml = `data:text/xml;charset=utf-8,${encodeURIComponent(xhr.responseText)}`;
          } else {
            console.log(xhr.status, xhr.responseText);
          }
        };
        xhr.send(`json-data=${JSON.stringify(json)}`);
      } else {
        document.getElementById('downloadAsJSON').disabled = true;
      }
      if (this.downloadType === 'json') {
        this.downloadLink.json = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`;
      }

      this.downloadFileName = {
        json: `${this.meta.title.replace(/ /g, '_')}-${now}.json`,
        xml: `${this.meta.title.replace(/ /g, '_')}-${now}.xml`,
      };
    },

    // Clear empty properties
    clear(o) {
      const obj = o;
      Object.entries(obj).forEach((e) => {
        if (obj[e[0]] && typeof obj[e[0]] === 'object') {
          this.clear(obj[e[0]]);
          if (Object.keys(obj[e[0]]).length === 0) {
            delete obj[e[0]];
          }
        } else if (obj[e[0]] === '' || obj[e[0]] === null) {
          delete obj[e[0]];
        }
      });
      return obj;
    },

    // Get UUID by ID
    getUuid(id) {
      for (let u = 0; u < this.bibl.length; u += 1) {
        if (this.bibl[u].id === id) {
          return this.bibl[u].uuid;
        }
      }
      return 0;
    },
  },
};
</script>
