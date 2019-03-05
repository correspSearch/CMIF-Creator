<template>
<b-container>
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
</b-container>
</template>

<script>

import start from './components/start.vue';
import metaData from './components/meta.vue';
import biblData from './components/bibl.vue';
import correspDescData from './components/correspDesc.vue';
import save from './components/save.vue';

export default {
  components: {
    start,
    metaData,
    biblData,
    correspDescData,
    save
  },
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
