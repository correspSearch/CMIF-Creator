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
  <div class="start">
    <BContainer>
      <BRow>
        <BCol>
          <h3>{{ label.head1 }}</h3>
          {{ label.startDesc }}
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BAlert
            variant="danger"
            class="mt-2"
            v-bind:show="error"
          >
            {{ errorMsg }}
          </BAlert>
        </BCol>
      </BRow>
      <BRow class="mt-2">
        <BCol>
          <h4>{{ label.startNew }}</h4>
          <BButton
            v-if="!this.$parent.metaData.title"
            class="btn-block"
            v-on:click="startNew(); $parent.nav = 'meta';"
          >
            {{ label.start }}
          </BButton>
          <BButton
            v-if="this.$parent.metaData.title"
            v-b-modal.modalStartNew
            class="btn-block"
          >
            {{ label.start }}
          </BButton>
          <BModal
            v-if="this.$parent.metaData.title"
            id="modalStartNew"
            ref="modal"
            v-bind:title="label.alertrestarthead"
            v-on:ok="startNew(); $parent.nav = 'meta';"
          >
            <BAlert
              show
              variant="danger"
            >
              {{ label.alertrestart }}
            </BAlert>
          </BModal>
        </BCol>
        <BCol>
          <h4>{{ label.loadJson }}</h4>
          <BFormFile
            v-model="file"
            accept=".xml, .json"
            class="file-upload-text-overflow"
            v-on:input="load"
          />
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>
export default {
  name: 'Start',
  props: {
    labels: {
      default: () => {},
      type: Object,
    },
    pArrays: {
      default: () => {},
      type: Object,
      twoWays: true,
    },
  },
  data() {
    return {
      file: '',
      label: this.labels,
      persons: this.pArrays.persons,
      places: this.pArrays.places,
      beginAnew: false,

      state: {
        bibl: this.biblState,
        correspDesc: this.correpsDesc,
      },

      error: false,
      errorMsg: '',
    };
  },
  methods: {
    // Start new CMIF File
    startNew() {
      this.$parent.metaData = {
        title: '',
        editor: [
          {
            name: '',
            email: '',
          },
        ],
        publisher: [
          {
            name: '',
            url: '',
          },
        ],
        url: '',
        licence: '',
      };
      this.$parent.biblData = [
        {
          id: 0,
          uuid: '',
          type: null,
          url: '',
          text: '',
          selected: '',
        },
      ];
      this.$parent.correspDescData = [
        {
          id: 0,
          visible: false,

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
                  highlighted: false,
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
                  highlighted: false,
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
        },
      ];

      this.$parent.correspDescState = [
        {
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
        },
      ];

      this.$parent.metaState = {
        title: null,
        editor: [
          {
            name: null,
            email: null,
          },
        ],
        publisher: [
          {
            name: null,
            url: null,
          },
        ],
        url: null,
        licence: null,
      };

      this.$parent.biblState = [
        {
          type: null,
          text: null,
          url: null,
        },
      ];
    },

    // Load existing JSON or XML
    load() {
      if (this.$parent.correspDescData.length > 1) this.startNew();
      if (this.error) this.error = false;
      const reader = new FileReader();
      reader.onload = () => {
        const fileExtension = this.file.name.split('.').pop();
        if (fileExtension === 'xml') {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://correspSearch.net/api/v1.1/converter/xml2json.xql', true);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhr.onload = () => {
            if (xhr.status === 200) {
              const json = JSON.parse(xhr.responseText);
              this.loadJsonToFileDesc(json.teiHeader.fileDesc);
              this.loadJsonToBibl(json.teiHeader.fileDesc.sourceDesc.bibl);
              this.loadJsonToCorrespDesc(json.teiHeader.profileDesc.correspDesc);

              if (!this.error) this.$parent.navigate('meta');
            } else {
              console.error(xhr.responseText);
            }
          };
          xhr.send(`xml-data=${reader.result}`);
        } else {
          const json = JSON.parse(reader.result);
          this.loadJsonToFileDesc(json.teiHeader.fileDesc);
          this.loadJsonToBibl(json.teiHeader.fileDesc.sourceDesc.bibl);
          this.loadJsonToCorrespDesc(json.teiHeader.profileDesc.correspDesc);

          if (!this.error) this.$parent.navigate('meta');
        }
      };
      reader.readAsText(this.file);
    },

    // Load JSON-Data to Step1
    loadJsonToFileDesc(json) {
      this.$parent.metaData.title = (
        json
        && json.titleStmt
        && json.titleStmt.title) ? json.titleStmt.title : '';
      this.$parent.metaState.title = (this.$parent.metaData.title !== ''); // Validation

      this.$parent.metaData.editor = [];
      this.$parent.metaState.editor = [];

      if (
        json.titleStmt
        && json.titleStmt.editor
      ) {
        if (Array.isArray(json.titleStmt.editor)) {
          json.titleStmt.editor.forEach((e) => {
            if ('ref' in e) {
              this.$parent.metaState.editor.push({
                name: (e.ref['#text'] !== ''),
                email: (e.ref.email !== '' && this.$parent.check('email', e.ref.email)),
              });

              this.$parent.metaData.editor.push({
                name: e.ref['#text'],
                email: e.ref.email,
              });
            } else {
              this.$parent.metaState.editor.push({
                name: (e['#text'] !== ''),
                email: (e.email !== '' && this.$parent.check('email', e.email)),
              });

              this.$parent.metaData.editor.push({
                name: e['#text'],
                email: e.email,
              });
            }
          });
        } else if (typeof json.titleStmt.editor !== 'string') { // Backward compatibility
          this.$parent.metaState.editor.push({
            name: (json.titleStmt.editor['#text'] !== undefined && json.titleStmt.editor['#text'] !== ''),
            email: (
              json.titleStmt.editor.email !== undefined
              && json.titleStmt.editor.email !== ''
              && this.$parent.check('email', json.titleStmt.editor.email)
            ),
          });

          this.$parent.metaData.editor.push({
            name: json.titleStmt.editor['#text'],
            email: json.titleStmt.editor.email,
          });
        } else if (json.titleStmt.editor.email === undefined) {
          this.$parent.metaState.editor.push({
            name: (json.titleStmt.editor !== undefined && json.titleStmt.editor !== ''),
            email: false,
          });
          this.$parent.metaData.editor.push({
            name: json.titleStmt.editor,
            email: '',
          });
        }
      } else {
        this.$parent.metaState.editor.push({
          name: false,
          email: false,
        });
        this.$parent.metaData.editor.push({
          name: '',
          email: '',
        });
      }

      this.$parent.metaData.publisher = [];
      this.$parent.metaState.publisher = [];
      if (
        json
        && json.publicationStmt
        && json.publicationStmt.publisher) {
        if (Array.isArray(json.publicationStmt.publisher)) {
          json.publicationStmt.publisher.forEach((e) => {
            // Validation
            this.$parent.metaState.publisher.push({
              name: (e.ref['#text'] !== undefined && e.ref['#text'] !== ''),
              url: (
                e.ref.target !== undefined
                && e.ref.target !== ''
                && this.$parent.check('url', e.ref.target)
              ),
            });
            // /Validation
            this.$parent.metaData.publisher.push({
              name: (e.ref) ? e.ref['#text'] : '',
              url: (e.ref) ? e.ref.target : '',
            });
          });
        } else { // Backward compatibility
          // Validation
          this.$parent.metaState.publisher.push({
            name: (
              json.publicationStmt.publisher.ref['#text'] !== undefined
              && json.publicationStmt.publisher.ref['#text'] !== ''
            ),
            url: (
              json.publicationStmt.publisher.ref.target !== undefined
              && json.publicationStmt.publisher.ref.target !== ''
              && this.$parent.check('url', json.publicationStmt.publisher.ref.target)
            ),
          });
          // /Validation
          this.$parent.metaData.publisher.push({
            name: json.publicationStmt.publisher.ref['#text'],
            url: json.publicationStmt.publisher.ref.target,
          });
        }
      } else {
        // Validation
        this.$parent.metaState.publisher.push({
          name: false,
          url: false,
        });
        // /Validation
        this.$parent.metaData.publisher.push({
          name: '',
          url: '',
        });
      }

      this.$parent.metaData.url = (json.publicationStmt.idno)
        ? json.publicationStmt.idno['#text'] : '';
      // Validation
      this.$parent.metaState.url = (this.$parent.metaData.url === '') ? null : (this.$parent.check('url', this.$parent.metaData.url));

      this.$parent.metaData.date = (json.publicationStmt.date)
        ? json.publicationStmt.date.when : '';

      this.$parent.metaData.licence = (json.publicationStmt.availability)
        ? json.publicationStmt.availability.licence['#text'] : '';
      // Validation
      this.$parent.metaState.licence = (this.$parent.metaData.licence !== undefined && this.$parent.metaData.licence !== '');
    },

    // Load JSON-Data to Step2
    loadJsonToBibl(json) {
      this.$parent.biblData = [];
      this.$parent.biblState = [];
      for (let i = 0; i < json.length; i += 1) {
        // Validation
        this.$parent.biblState.push({
          type: (
            json[i].type !== undefined
            && json[i].type !== ''
          ),
          text: (
            json[i]['#text'] !== undefined
            && json[i]['#text'] !== ''
          ),
          url: (
            (json[i].type === 'print')
            && json[i].ref === ''
          ) ? null : (
              json[i].ref !== undefined
            && this.$parent.check('url', json[i].ref.target)),
        });
        // /Validation
        this.$parent.biblData.push({
          id: i,
          uuid: (json[i]['xml:id'] === undefined) ? '' : json[i]['xml:id'],
          type: (json[i].type === undefined) ? '' : json[i].type,
          url: (json[i].ref === undefined) ? '' : json[i].ref.target,
          text: (json[i]['#text'] === undefined) ? '' : json[i]['#text'],
          selected: false,
        });
      }
    },

    // Load JSON-Data to Step3
    loadJsonToCorrespDesc(json) {
      this.$parent.correspDescData = [];
      this.$parent.correspDescState = [];
      for (let i = 0; i < json.length; i += 1) {
        try {
          const dateForm = {
            sender: '',
            receiver: '',
          };
          ['sender', 'receiver'].forEach((e) => {
            const t = (e === 'sender') ? 0 : 1;
            if (
              json[i]
              && json[i].correspAction
              && json[i].correspAction[t]
              && json[i].correspAction[t].date
            ) {
              if (json[i].correspAction[t].date.when) {
                dateForm[e] = 'when';
              } else if (json[i].correspAction[t].date.notBefore) {
                dateForm[e] = 'nba';
              } else if (json[i].correspAction[t].date.from) {
                dateForm[e] = 'span';
              } else {
                dateForm[e] = 'na';
              }
            } else {
              dateForm[e] = 'na';
            }
          });

          const persNames = { sender: [], receiver: [] };
          ['sender', 'receiver'].forEach((e) => {
            const t = (e === 'sender') ? 0 : 1;
            ['orgName', 'persName'].forEach((a) => {
              if (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[t]
              ) {
                if (typeof json[i].correspAction[t][a] === 'object') {
                  if (json[i].correspAction[t][a]['#text']) {
                    persNames[e].push({
                      text: json[i].correspAction[t][a]['#text'],
                      ref: json[i].correspAction[t][a].ref,

                      conjecture: (json[i].correspAction[t][a].evidence === 'conjecture'),
                      uncertain: (json[i].correspAction[t][a].cert === 'low'),
                      unknown: (json[i].correspAction[t][a].ref === 'http://correspSearch.net/unknown'),

                      organisation: (a === 'orgName'),

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
                  } else {
                    json[i].correspAction[t][a].forEach((p) => {
                      persNames[e].push({
                        text: (typeof p === 'string') ? p : p['#text'],
                        ref: (typeof p === 'string') ? '' : p.ref,

                        conjecture: (
                          p
                          && p.evidence === 'conjecture'
                        ),
                        uncertain: (
                          p
                          && p.cert === 'low'
                        ),
                        unknown: (p.ref === 'http://correspSearch.net/unknown'),

                        organisation: (a === 'orgName'),

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
                    });
                  }
                } else if (
                  typeof json[i].correspAction[t][a] === 'string'
                  || json[i].correspAction[t][a] === ''
                ) {
                  persNames[e].push({
                    text: json[i].correspAction[t][a],
                    ref: '',

                    conjecture: false,
                    uncertain: false,
                    unknown: false,

                    organisation: (a === 'orgName'),

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
                }
              }
            });
            if (
              typeof json[i].correspAction[t].persName === 'undefined'
              && typeof json[i].correspAction[t].orgName === 'undefined'
            ) {
              persNames[e].push({
                text: '',
                ref: '',

                conjecture: false,
                uncertain: false,
                unknown: false,

                organisation: '',

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
            }
          });

          const persState = {
            sender: [],
            receiver: [],
          };
          ['sender', 'receiver'].forEach((e) => {
            for (let k = 0; k < persNames[e].length; k += 1) {
              let match = false;
              if (this.persons.length === 0) {
                this.persons.push({
                  text: persNames[e][k].text,
                  ref: persNames[e][k].ref,
                  org: (persNames[e][k].organisation),
                });
              } else {
                for (let l = 0; l < this.persons.length; l += 1) {
                  match = (persNames[e][k].text === this.persons[l].text);
                  if (match) break;
                }
                if (!match) {
                  this.persons.push({
                    text: persNames[e][k].text,
                    ref: persNames[e][k].ref,
                    org: (persNames[e][k].organisation),
                  });
                }
              }
              persState[e].push({
                name: (
                  this.persons[this.persons.length - 1].text !== ''
                  && this.persons[this.persons.length - 1].text !== undefined
                ),
                id: (
                  this.persons[this.persons.length - 1].ref === ''
                  || this.persons[this.persons.length - 1].ref === undefined
                ) ? null : (
                    this.$parent.check('person', this.persons[this.persons.length - 1].ref)
                  ),
              });
            }
          });

          const placeNames = { sender: [], receiver: [] };
          ['sender', 'receiver'].forEach((e) => { // eslint-disable-line
            const t = (e === 'sender') ? 0 : 1;
            if (json[i]
              && json[i].correspAction
              && json[i].correspAction[t]) {
              if (typeof json[i].correspAction[t].placeName === 'object') {
                if (json[i].correspAction[t].placeName['#text']) {
                  placeNames[e].push({
                    text: json[i].correspAction[t].placeName['#text'],
                    ref: json[i].correspAction[t].placeName.ref,

                    conjecture: (json[i].correspAction[t].placeName.evidence === 'conjecture'),
                    uncertain: (json[i].correspAction[t].placeName.cert === 'low'),

                    // Autocomplete
                    open: false,
                    highlighted: 0,
                    selected: false,

                    // Geonames Suggestions
                    geo: {
                      open: false,
                      highlighted: false,
                      suggestions: [],
                      all: 0,
                      parameter: 'P',
                    },
                  });
                } else {
                  json[i].correspAction[t].placeName.forEach((p) => {
                    placeNames[e].push({
                      text: (typeof p === 'string') ? p : p['#text'],
                      ref: (typeof p === 'string') ? '' : p.ref,

                      conjecture: (p.evidence === 'conjecture'),
                      uncertain: (p.cert === 'low'),

                      // Autocomplete
                      open: false,
                      highlighted: 0,
                      selected: false,

                      // Geonames Suggestions
                      geo: {
                        open: false,
                        highlighted: false,
                        suggestions: [],
                        all: 0,
                        parameter: 'P',
                      },
                    });
                  });
                }
              } else if (
                typeof json[i].correspAction[t].placeName === 'string'
                || json[i].correspAction[t].placeName === ''
              ) {
                placeNames[e].push({
                  text: json[i].correspAction[t].placeName,
                  ref: '',

                  conjecture: (json[i].correspAction[t].placeName.evidence === 'conjecture'),
                  uncertain: (json[i].correspAction[t].placeName.cert === 'low'),

                  // Autocomplete
                  open: false,
                  highlighted: 0,
                  selected: false,

                  // Geonames Suggestions
                  geo: {
                    open: false,
                    highlighted: false,
                    suggestions: [],
                    all: 0,
                    parameter: 'P',
                  },
                });
              }
            }
            if (typeof json[i].correspAction[t].placeName === 'undefined') {
              placeNames[e].push({
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
                  highlighted: false,
                  suggestions: [],
                  all: 0,
                  parameter: 'P',
                },
              });
            }
          });

          const placeState = {
            sender: [],
            receiver: [],
          };
          ['sender', 'receiver'].forEach((e) => { // eslint-disable-line
            let match = false;
            if (placeNames[e]) {
              placeNames[e].forEach((place) => {
                if (this.places.length === 0) {
                  this.places.push({
                    text: place.text,
                    ref: place.ref,
                  });
                } else {
                  for (let l = 0; l < this.places.length; l += 1) {
                    match = (place.text === this.places[l].text);
                    if (match) break;
                  }
                  if (!match) {
                    this.places.push({
                      text: place.text,
                      ref: place.ref,
                    });
                  }
                }
                placeState[e].push({
                  name: (place.text),
                  id: (place.ref === '') ? null : (
                    this.$parent.check('place', place.ref)
                  ),
                });
              });
            }
          });
          let head = '';
          head = (json[i].key) ? `<span class="badge badge-info mr-1">${json[i].key}</span>` : '';
          head += (persNames.sender[0].text) ? `<span class="badge badge-secondary mr-1">${
            this.label.headBy
          }</span><small class="mr-2 ml-1">${
            persNames.sender[0].text
          }</small>` : '';
          head += (persNames.receiver[0].text) ? `<span class="badge badge-secondary mr-1">${
            this.label.headTo
          }</span><small class="mr-2 ml-1">${
            persNames.receiver[0].text
          }</small>` : '';

          this.$parent.correspDescState.push({
            urlToXml: (
              json[i]
              && json[i].ref
            ) ? (this.$parent.check('url', json[i].ref)) : null,
            sender: persState.sender,
            receiver: persState.receiver,
            senderPlace: placeState.sender,
            receiverPlace: placeState.receiver,
            senderDate: {
              when: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.when
              ) ? (this.$parent.check('date', json[i].correspAction[0].date.when)) : null,
              notBefore: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.notBefore
              ) ? (this.$parent.check('date', json[i].correspAction[0].date.notBefore)) : null,
              notAfter: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.notAfter
              ) ? (this.$parent.check('date', json[i].correspAction[0].date.notAfter)) : null,
              from: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.from
              ) ? (this.$parent.check('date', json[i].correspAction[0].date.from)) : null,
              to: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.to
              ) ? (this.$parent.check('date', json[i].correspAction[0].date.to)) : null,
            },
            receiverDate: {
              when: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.when
              ) ? (this.$parent.check('date', json[i].correspAction[1].date.when)) : null,
              notBefore: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.notBefore
              ) ? (this.$parent.check('date', json[i].correspAction[1].date.notBefore)) : null,
              notAfter: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.notAfter
              ) ? (this.$parent.check('date', json[i].correspAction[1].date.notAfter)) : null,
              from: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.from
              ) ? (this.$parent.check('date', json[i].correspAction[1].date.from)) : null,
              to: (
                json[i]
                && json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.to
              ) ? (this.$parent.check('date', json[i].correspAction[1].date.to)) : null,
            },
          });

          this.$parent.correspDescData.push({
            id: i,
            visible: false,

            header: head,

            ref: (json[i] && json[i].ref) ? json[i].ref : '',
            refHidden: !(json[i] && json[i].ref),

            key: (json[i]) ? json[i].key : '',

            bibl: this.getRealBibId(json[i].source.replace('#', '')),

            sender: {
              persName: persNames.sender, // Muss angepasst werden
              placeName: placeNames.sender,

              date: dateForm.sender,
              dateCert: {
                conjecture: (
                  json[i]
                  && json[i].correspAction
                  && json[i].correspAction[0]
                  && json[i].correspAction[0].date
                  && json[i].correspAction[0].date.evidence === 'conjecture'
                ),
                uncertain: (
                  json[i]
                  && json[i].correspAction
                  && json[i].correspAction[0]
                  && json[i].correspAction[0].date
                  && json[i].correspAction[0].date.cert === 'low'
                ),
              },
              when: (
                json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.when
              ) ? json[i].correspAction[0].date.when : '',
              notBefore: (
                json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.notBefore
              ) ? json[i].correspAction[0].date.notBefore : '',
              notAfter: (
                json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.notAfter
              ) ? json[i].correspAction[0].date.notAfter : '',
              spanFrom: (
                json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.from
              ) ? json[i].correspAction[0].date.from : '',
              spanTo: (
                json[i].correspAction
                && json[i].correspAction[0]
                && json[i].correspAction[0].date
                && json[i].correspAction[0].date.to
              ) ? json[i].correspAction[0].date.to : '',
              dateAsText: this.getDateAsTextSpecs(json[i], 0),
              dateAsTextHidden: this.getDateAsTextSpecs(json[i], 0, 'bool'),
            },
            receiver: {
              persName: persNames.receiver,
              placeName: placeNames.receiver,

              date: dateForm.receiver,
              dateCert: {
                conjecture: (
                  json[i]
                  && json[i].correspAction
                  && json[i].correspAction[1]
                  && json[i].correspAction[1].date
                  && json[i].correspAction[1].date.evidence === 'conjecture'
                ),
                uncertain: (
                  json[i]
                  && json[i].correspAction
                  && json[i].correspAction[1]
                  && json[i].correspAction[1].date
                  && json[i].correspAction[1].date.cert === 'low'
                ),
              },
              when: (
                json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.when
              ) ? json[i].correspAction[1].date.when : '',
              notBefore: (
                json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.notBefore
              ) ? json[i].correspAction[1].date.notBefore : '',
              notAfter: (
                json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.notAfter
              ) ? json[i].correspAction[1].date.notAfter : '',
              spanFrom: (
                json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.from
              ) ? json[i].correspAction[1].date.from : '',
              spanTo: (
                json[i].correspAction
                && json[i].correspAction[1]
                && json[i].correspAction[1].date
                && json[i].correspAction[1].date.to
              ) ? json[i].correspAction[1].date.to : '',
              dateAsText: this.getDateAsTextSpecs(json[i], 1),
              dateAsTextHidden: this.getDateAsTextSpecs(json[i], 1, 'bool'),
            },
          });
        } catch (error) {
          this.error = true;
          this.errorMsg = `${this.label[`alertLoadError${(json[i].key) ? 'Key' : 'Id'}`]}${((json[i].key) ? json[i].key : i)}.`;
        }
      }
    },

    // Get dateAsText value and hidden-bool
    getDateAsTextSpecs(json, who, type = 'value') {
      if (type === 'value') {
        let dateAsTextVal = '';
        if (
          json.correspAction
          && json.correspAction[who]
          && json.correspAction[who].date
        ) {
          const { date } = json.correspAction[who];
          if (typeof date === 'object'
              && date['#text']) {
            dateAsTextVal = date['#text'];
          } else if (typeof date === 'string'
              && date) {
            dateAsTextVal = date;
          }
        }
        return dateAsTextVal;
      }
      if (type === 'bool') {
        return !(
          json.correspAction
          && json.correspAction[who]
          && json.correspAction[who].date
          && (
            (typeof json.correspAction[who].date === 'string' && json.correspAction[who].date)
            || (typeof json.correspAction[who].date === 'object' && json.correspAction[who].date['#text'])
          )
        );
      }
      return 0;
    },

    // Get id from uuid
    getRealBibId(uuid) {
      let result = '';
      for (let i = 0; i < this.$parent.biblData.length; i += 1) {
        result = (this.$parent.biblData[i].uuid === uuid) ? i : 0;
        break;
      }
      return result;
    },
  },
};
</script>

<style>
.custom-file-label {
  overflow: hidden;
}
</style>
