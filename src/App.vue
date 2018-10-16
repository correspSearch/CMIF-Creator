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
  <div id="app">

    <b-nav tabs class="ml-0" v-if="!isInternetExplorer">
      <b-nav-item v-on:click="nav = 'start'"
                  v-bind:active="(nav === 'start')">{{ labels.start }}</b-nav-item>
      <b-nav-item v-on:click="nav ='meta'"
                  v-bind:active="(nav === 'meta')">{{ labels.step1 }}</b-nav-item>
      <b-nav-item v-on:click="nav = 'bibl'"
                  v-bind:active="(nav === 'bibl')">{{ labels.step2 }}</b-nav-item>
      <b-nav-item v-on:click="nav = 'correspDesc'"
                  v-bind:active="(nav === 'correspDesc')">{{ labels.step3 }}</b-nav-item>
      <b-nav-item v-on:click="nav = 'save'"
                  v-bind:active="(nav === 'save')">{{ labels.step4 }}</b-nav-item>
    </b-nav>

    <div class="container pt-5 pb-5 bg-white" v-if="!isInternetExplorer">
      <start v-bind:labels="labels"
             v-bind:pArrays="pArrays"
             v-if="nav === 'start'"></start>

      <metaData v-bind:labels="labels"
                v-bind:metaData="metaData"
                v-bind:metaState="metaState"
                v-if="nav === 'meta'"></metaData>

      <biblData v-bind:labels="labels"
                v-bind:biblData="biblData"
                v-bind:biblState="biblState"
                v-if="nav === 'bibl'"></biblData>

      <correspDescData v-bind:labels="labels"
                v-bind:correspDescData="correspDescData"
                v-bind:pArrays="pArrays"
                v-bind:filterSpecs="filter"
                v-bind:correspDescState="correspDescState"
                v-if="nav === 'correspDesc'"></correspDescData>

      <save v-bind:labels="labels"
            v-bind:metaData="metaData"
            v-bind:biblData="biblData"
            v-bind:correspDescData="correspDescData"
            v-if="nav === 'save'"></save>
    </div>

    <b-alert v-if="isInternetExplorer" variant="warning" show>
      {{ ieAlert[lang] }}
    </b-alert>
  </div>
</template>

<script>
import start from './components/start';
import metaData from './components/meta';
import biblData from './components/bibl';
import correspDescData from './components/correspDesc';
import save from './components/save';

export default {
  name: 'app',
  data() {
    return {
      isInternetExplorer: false,
      ieAlert: { // IE doesn't support label-import
        de: 'Achtung! Microsoft Internet Explorer wird vom CMIF Creator nicht unterstützt.',
        en: 'Attention! Microsoft Internet Explorer is not supported by CMIF Creator.',
      },
      lang: 'de',
      labels: {
        start: '',
      },
      nav: 'start',
      metaState: {
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
      },
      biblState: [
        {
          type: null,
          text: null,
          url: null,
        },
      ],
      correspDescState: [
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
      ],
      metaData: {
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
      },
      biblData: [
        {
          id: 0,
          uuid: '',
          type: null,
          url: '',
          text: '',
          selected: '',
        },
      ],
      pArrays: {
        persons: [],
        places: [],
      },
      filter: {
        type: 'name',
        text: '',
      },
      correspDescData: [
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
        },
      ],
    };
  },
  components: {
    start,
    metaData,
    biblData,
    correspDescData,
    save,
  },
  methods: {
    // Navigation
    navigate(target, filter = null) {
      this.nav = target;
      if (filter) {
        this.filter = {
          type: filter[0],
          text: filter[1],
        };
      }
    },

    // Regular Expressions for field-validation
    check(target, string) {
      let rp = new RegExp();
      switch (target) {
        case 'url': {
          rp = new RegExp(/^http(s)?\:\/\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi);
          return rp.test(string);
        }
        case 'email': {
          rp = new RegExp(/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
          return rp.test(string);
        }
        case 'person': {
          rp = new RegExp(/^(http(s)?\:\/\/correspSearch\.net\/unknown?)|^(http(s)?\:\/\/d\-nb\.info\/gnd\/?)|^(http(s)?\:\/\/viaf\.org\/viaf\/?)|^(http(s)?\:\/\/catalogue\.bnf\.fr\/?)|^(http(s)?\:\/\/lccn\.loc\.gov\/?)|^(http(s)?\:\/\/correspSearch\.net\/?)/g);
          return rp.test(string);
        }
        case 'place': {
          rp = new RegExp(/^http\:\/\/www\.geonames\.org\/?/g);
          return rp.test(string);
        }
        case 'date': {
          rp = new RegExp(/^(([0-1][0-9][0-9][0-9])$)|^(([0-1][0-9][0-9][0-9])\-([0][1-9]|[1][0-2])$)|^(([0-1][0-9][0-9][0-9])\-([0][1-9]|[1][0-2])\-([0-9][1-9]|[1-2][0-9]|[3][0-1])$)/g);
          let result = rp.test(string);
          const date = string.split('-');
          if (date[1] !== undefined && date[2] !== undefined) {
            switch (date[1]) {
              case '01':
              case '03':
              case '05':
              case '07':
              case '08':
              case '10':
              case '12': result = (parseInt(date[2], 10) < 32) ? result : false; break;
              case '04':
              case '06':
              case '09':
              case '11': result = (parseInt(date[2], 10) < 31) ? result : false; break;
              case '02':
                if (
                  !(
                    (
                      (date[0] % 4 === 0)
                      && (date[0] % 100 !== 0)
                    ) || (date[0] % 400 === 0)
                  )
                ) {
                  if (date[2] > 28) result = false;
                } else if (date[2] > 29) result = false;
                break;
              default: break;
            }
          }
          return result;
        }
        default:
          return false;
      }
    },
  },

  // Load labels from labels.xml according to language-parameter
  beforeCreate() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'static/labels.xml');
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.lang = window.location.search.match(/\?l\=en/) ? 'en' : 'de';
        const parser = new DOMParser();
        const xml = parser.parseFromString(xhr.responseText, 'application/xml');
        for (let i = 0; i < xml.children[0].children.length; i += 1) {
          if (xml.children[0].children[i].attributes[0].value === String(this.lang)) {
            for (let j = 0; j < xml.children[0].children[i].children.length; j += 1) {
              this.labels[xml.children[0].children[i].children[j].attributes[0].value]
              = xml.children[0].children[i].children[j].innerHTML;
            }
          }
        }
      } else {
        console.error(xhr.status);
      }
    };
    xhr.send();
  },

  // Give Warning instead of CMIF Creator when Internet Explorer is detected
  mounted() {
    if (
      navigator.userAgent.match(new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})'))
      || navigator.userAgent.match(/Trident.*rv\:11\./)
    ) {
      this.isInternetExplorer = true;
    }
  },
};
</script>

<style>

/* Checkbox fix */
.custom-control-label::after {
  left: 0rem;
}
.custom-checkbox input {
  margin: 6px -21px 0px 0px;
}
/* *** */

.header {
  background-color: #2A7299;
  color: #fff;
}

body {
  background-color: #606060;
  color: #fff;
  font-family: 'PT Serif';
}

html, body, p, span, input, label, button, a, h1, h2, h3, h4, h5 {
  font-family: 'PT Serif' !important;
}

h1 {
  font-size: 2.0em;
  font-weight: bold;
  font-family: 'PT Serif';
}
h2 {
  font-size: 1.5em;
  font-weight: bold;
}
h3 {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
h4 {
  font-size: 1.2em;
  margin-bottom: 0.5em;
}

p {
  margin-bottom: 0.1em;
  line-height: 1.4;
}

.navbar {
  padding: 0;
}

.navbar-brand {
  font-size: 1.0em;
  font-weight: bold;
}

.navbar-nav {
  margin: auto;
}

.navbar .nav-link {
  color: #fff;
  padding: 0.8em;
  padding-right: 1rem;
  padding-left: 1rem;
}

.navbar .nav-item {
  padding-top: 4px;
}

.navbar .form-inline {
  margin-bottom: 0;
}

.navbar .nav-item:hover, .navbar .nav-item.active {
  background-color: #545454;
}

.cs-contentBox {
  background-color: #fff;
  padding: 1.5em 0 1em 0;
}

.cs-navbar {
  background-color: #383838;
  color: #fff;
}

.cs-contentTop {
  position: relative;
  padding: 2em 0 1em 0;
  min-height: 175px;
  font-family: PTSans;
  background-color: #2A7299;
  color: white;
}

.cs-contentBottom {
	position: relative;
	min-height: 45%;
	padding: 1.5em 0 1em 0;
	background-color: #EAEAEA;
}

#app {
  font-family: 'PT Serif';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app .nav-link {
  background-color: #e0e0e0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 0;
  color: #666;
}

#app .nav-link a {
  color: #666;
}

#app .nav-link.active {
  border: 0px;
  background-color: #fff;
}

.pagination {
	margin-bottom: 0;
}

.btn-sm {
	font-size: 0.8rem;
}

.alert {
	margin-bottom: 0.3rem;
	padding: 0.3rem 0.5rem;
}

.card {
	margin-top: 0.5rem;
}

.card-body {
	padding: 0.5rem;
	background-color: rgba(0,0,0,.03);
}

.card-body .custom-control-label {
	font-size: .875rem;
}

.correspDescCardBody {
	background-color: #fff;
}

.card-header {
	padding: 0.3rem 0.5rem;
	background-color: #EAEAEA;
}

.card-header .custom-control-label {
	padding-top: 0.1rem;
	font-size: 0.8rem;
}

.custom-select-sm {
	padding-top: 0.2rem;
	padding-bottom: 0.2rem;
}

.form-group {
	margin-bottom: 0.4rem;
}

.p-px-11 {
  padding-left: 11px;
}

.labelOnTop > label {
  position: static;
  padding-top:2px;
}

.highlighted {
  background-color: #f5f5f5;
}

.page-item {
  margin-top: 0px;
}

.custom-checkbox {
  padding-left: 1.5rem;
}

.custom-control-label:before{
  background-color: #fff;
  border: 1px solid #ccc;
  left: 0rem;
}

.card-body .input-group .custom-select {
  border-radius: 0;
  border-right: 0px;
  /* border-left: 10px solid #6c757d; */
  border-color: #6c757d;
  z-index: 5;
  background-color: #6c757d;
  color: #fff;
}

.card-body .input-group .custom-select:disabled {
  opacity: 0.65;
}

.danger-light {
  background-color: #f6dfe1;
}

.csOrange {
  background-color: #f7931e;
  color: #fff;
}

#downloadAsJSON + .custom-control-label:before, #downloadAsJSON + .custom-control-label:after {
  margin-left: -23px;
}
</style>
