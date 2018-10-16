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
  <div class="metaData">
    <b-container>
      <b-row>
        <b-col>
          <h3>{{ label.metaData }}</h3>
          {{ label.step1Desc }}
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-form-group horizontal
                        v-bind:label-cols="2"
                        label-size="sm"
                        v-bind:label="label.title + '*'"
                        v-bind:invalid-feedback="label.errorMetaTitle"
                        label-for="title">
            <b-form-input id="title"
                          size="sm"
                          v-on:blur.native="state.title = setState(meta.title)"
                          v-bind:state="state.title"
                          v-model="meta.title"></b-form-input>
          </b-form-group>
          <b-card no-body class="mb-2"
                  v-for="(editor, key) in meta.editor"
                  v-bind:key="'editor_' + key">
            <b-card-header>
              <b-row align-h="end">
                <b-col>
                  {{ label.editor }}
                </b-col>
                <b-col cols="1">
                <b-button size="sm"
                          class="w-100"
                          v-on:click="rmEditor(key)"
                          v-if="meta.editor.length > 1">
                  <i class="fa fa-trash-alt"></i>
                </b-button>
                </b-col>
              </b-row>
            </b-card-header>
            <b-card-body>
              <b-form-group horizontal
                            v-bind:label-cols="3"
                            label-size="sm"
                            v-bind:label="label.editor + '*'"
                            v-bind:invalid-feedback="label.errorMetaEditor"
                            label-for="editor">
                <b-form-input id="editor"
                              size="sm"
                              v-on:blur.native="state.editor[key].name = setState(editor.name)"
                              v-bind:state="state.editor[key].name"
                              v-model="editor.name"></b-form-input>
              </b-form-group>
              <b-form-group horizontal
                            v-bind:label-cols="3"
                            label-size="sm"
                            v-bind:label="label.editorEmail + '*'"
                            v-bind:invalid-feedback="(!meta.editor[key].email) ? label.errorMetaEmailEmpty : label.errorMetaEmailFormat"
                            label-for="editorEmail">
                <b-form-input id="editorEmail"
                              size="sm"
                              v-on:blur.native="state.editor[key].email = setState(editor.email, 'email')"
                              v-bind:state="state.editor[key].email"
                              type="email"
                              v-model="editor.email"></b-form-input>
              </b-form-group>
            </b-card-body>
          </b-card>
          <b-button v-on:click="addEditor"
                    size="sm"
                    variant="secondary">
            <i class="fas fa-plus-circle"></i> {{ label.addEditor }}
          </b-button>
          <b-card no-body class="mb-2"
                  v-for="(publisher, key) in meta.publisher"
                  v-bind:key="'publisher_' + key">
            <b-card-header>
              <b-row align-h="end">
                <b-col>
                  {{ label.publisher }}
                </b-col>
                <b-col cols="1">
                <b-button size="sm"
                          class="w-100"
                          v-on:click="rmPublisher(key)"
                          v-if="meta.publisher.length > 1">
                  <i class="fa fa-trash-alt"></i>
                </b-button>
                </b-col>
              </b-row>
            </b-card-header>
            <b-card-body>
              <b-form-group horizontal
                            v-bind:label-cols="3"
                            label-size="sm"
                            v-bind:label="label.publisher + '*'"
                            v-bind:invalid-feedback="label.errorMetaPublisher"
                            label-for="publisher">
                <b-form-input id="publisher"
                              size="sm"
                              v-on:blur.native="state.publisher[key].name = setState(publisher.name)"
                              v-bind:state="state.publisher[key].name"
                              v-model="publisher.name"></b-form-input>
              </b-form-group>
              <b-form-group horizontal
                            v-bind:label-cols="3"
                            label-size="sm"
                            v-bind:label="label.publisherWebsite"
                            v-bind:invalid-feedback="label.errorURLFormat"
                            label-for="publisherWebsite">
                <b-form-input id="publisherWebsite"
                              size="sm"
                              type="url"
                              v-on:blur.native="state.publisher[key].url = setState(publisher.url, 'url', true)"
                              v-bind:state="state.publisher[key].url"
                              v-model="publisher.url"></b-form-input>
              </b-form-group>
            </b-card-body>
          </b-card>
          <b-button v-on:click="addPublisher"
                    size="sm"
                    class="mb-2"
                    variant="secondary">
            <i class="fas fa-plus-circle"></i> {{ label.addPublisher }}
          </b-button>
          <b-form-group horizontal
                        v-bind:label-cols="2"
                        label-size="sm"
                        v-bind:label="label.urlToXml"
                        v-bind:invalid-feedback="label.errorURLFormat"
                        label-for="urlToXml">
            <b-form-input id="urlToXml"
                          size="sm"
                          type="url"
                          v-on:blur.native="state.url = setState(meta.url, 'url', true)"
                          v-bind:state="state.url"
                          v-model="meta.url"></b-form-input>
          </b-form-group>
          <b-form-group horizontal
                        v-bind:label-cols="2"
                        label-size="sm"
                        v-bind:label="label.licence + '*'"
                        v-bind:invalid-feedback="label.errorMetaLicence"
                        label-for="licence">
            <b-form-select size="sm"
                           v-on:blur.native="state.licence = setState(meta.licence)"
                           v-bind:state="state.licence"
                           v-model="meta.licence">
              <option value="CC0">CC0</option>
              <option value="CC-BY 4.0">CC-BY 4.0</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button v-on:click="$parent.navigate('bibl')"
                    size="sm"
                    variant="secondary"
                    class="float-right">
            {{ label.continue }}
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'metaData',
  props: {
    labels: {
      type: Object,
      default: () => ({}),
    },
    metaData: {
      type: Object,
      twoWays: true,
    },
    metaState: {
      type: Object,
      twoWays: true,
    },
  },
  data() {
    return {
      label: this.labels,
      meta: this.metaData,
      state: this.metaState,
    };
  },
  methods: {
    // Add publisher
    addPublisher() {
      this.meta.publisher.push({
        name: '',
        url: '',
      });
      this.state.publisher.push({
        name: null,
        url: null,
      });
    },

    // remove publisher
    rmPublisher(key) {
      this.meta.publisher.splice(key, 1);
      this.state.publisher.splice(key, 1);
    },

    // Add editor
    addEditor() {
      this.meta.editor.push({
        name: '',
        email: '',
      });
      this.state.editor.push({
        name: null,
        email: null,
      });
    },

    // remove editor
    rmEditor(key) {
      this.meta.editor.splice(key, 1);
      this.state.editor.splice(key, 1);
    },

    // Check values
    setState(value, regMatch = '', optional = false) {
      let state = false;
      if (!regMatch) {
        state = (value !== '');
      } else if (optional) {
        if (value === '') state = null;
        if (value !== '' && this.$parent.check(regMatch, value)) state = true;
        if (value !== '' && !this.$parent.check(regMatch, value)) state = false;
      } else {
        state = this.$parent.check(regMatch, value);
      }
      return state;
    },
  },
  computed: {},
};
</script>
