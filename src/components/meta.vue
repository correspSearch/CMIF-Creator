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
    <BContainer>
      <BRow>
        <BCol>
          <h3>{{ label.metaData }}</h3>
          {{ label.step1Desc }}
        </BCol>
      </BRow>
      <BRow class="mt-2">
        <BCol>
          <BFormGroup
            v-bind:label-cols="2"
            label-size="sm"
            v-bind:label="label.title + '*'"
            v-bind:invalid-feedback="label.errorMetaTitle"
            label-for="title"
          >
            <BFormInput
              id="title"
              v-model="meta.title"
              size="sm"
              v-bind:state="state.title"
              v-on:blur.native="state.title = setState(meta.title)"
            />
          </BFormGroup>
          <BCard
            v-for="(editor, key) in meta.editor"
            v-bind:key="'editor_' + key"
            no-body
            class="mb-2"
          >
            <BCardHeader>
              <BRow align-h="end">
                <BCol>
                  {{ label.editor }}
                </BCol>
                <BCol cols="1">
                  <BButton
                    v-if="meta.editor.length > 1"
                    size="sm"
                    class="w-100"
                    v-on:click="rmEditor(key)"
                  >
                    <i class="fa fa-trash-alt" />
                  </BButton>
                </BCol>
              </BRow>
            </BCardHeader>
            <BCardBody>
              <BFormGroup
                v-bind:label-cols="3"
                v-bind:label="label.editor + '*'"
                v-bind:invalid-feedback="label.errorMetaEditor"
                label-size="sm"
                label-for="editor"
              >
                <BFormInput
                  id="editor"
                  v-model="editor.name"
                  size="sm"
                  v-bind:state="state.editor[key].name"
                  v-on:blur.native="state.editor[key].name = setState(editor.name)"
                />
              </BFormGroup>
              <BFormGroup
                v-bind:label-cols="3"
                v-bind:label="label.editorEmail + '*'"
                v-bind:invalid-feedback="(!meta.editor[key].email) ? label.errorMetaEmailEmpty : label.errorMetaEmailFormat"
                label-size="sm"
                label-for="editorEmail"
              >
                <BFormInput
                  id="editorEmail"
                  v-model="editor.email"
                  size="sm"
                  v-bind:state="state.editor[key].email"
                  type="email"
                  v-on:blur.native="state.editor[key].email = setState(editor.email, 'email')"
                />
              </BFormGroup>
            </BCardBody>
          </BCard>
          <BButton
            variant="secondary"
            size="sm"
            v-on:click="addEditor"
          >
            <i class="fas fa-plus-circle" /> {{ label.addEditor }}
          </BButton>
          <BCard
            v-for="(publisher, key) in meta.publisher"
            v-bind:key="'publisher_' + key"
            no-body
            class="mb-2"
          >
            <BCardHeader>
              <BRow align-h="end">
                <BCol>
                  {{ label.publisher }}
                </BCol>
                <BCol cols="1">
                  <BButton
                    v-if="meta.publisher.length > 1"
                    size="sm"
                    class="w-100"
                    v-on:click="rmPublisher(key)"
                  >
                    <i class="fa fa-trash-alt" />
                  </BButton>
                </BCol>
              </BRow>
            </BCardHeader>
            <BCardBody>
              <BFormGroup
                v-bind:label-cols="3"
                v-bind:label="label.publisher + '*'"
                v-bind:invalid-feedback="label.errorMetaPublisher"
                label-size="sm"
                label-for="publisher"
              >
                <BFormInput
                  id="publisher"
                  v-model="publisher.name"
                  size="sm"
                  v-bind:state="state.publisher[key].name"
                  v-on:blur.native="state.publisher[key].name = setState(publisher.name)"
                />
              </BFormGroup>
              <BFormGroup
                v-bind:label-cols="3"
                v-bind:label="label.publisherWebsite"
                v-bind:invalid-feedback="label.errorURLFormat"
                label-size="sm"
                label-for="publisherWebsite"
              >
                <BFormInput
                  id="publisherWebsite"
                  v-model="publisher.url"
                  size="sm"
                  type="url"
                  v-bind:state="state.publisher[key].url"
                  v-on:blur.native="state.publisher[key].url = setState(publisher.url, 'url', true)"
                />
              </BFormGroup>
            </BCardBody>
          </BCard>
          <BButton
            variant="secondary"
            size="sm"
            class="mb-2"
            v-on:click="addPublisher"
          >
            <i class="fas fa-plus-circle" /> {{ label.addPublisher }}
          </BButton>
          <BFormGroup
            v-bind:label-cols="2"
            v-bind:label="label.urlToXml"
            v-bind:invalid-feedback="label.errorURLFormat"
            label-size="sm"
            label-for="urlToXml"
          >
            <BFormInput
              id="urlToXml"
              v-model="meta.url"
              size="sm"
              type="url"
              v-bind:state="state.url"
              v-on:blur.native="state.url = setState(meta.url, 'url', true)"
            />
          </BFormGroup>
          <BFormGroup
            v-bind:label-cols="2"
            v-bind:label="label.licence + '*'"
            v-bind:invalid-feedback="label.errorMetaLicence"
            label-size="sm"
            label-for="licence"
          >
            <BFormSelect
              v-model="meta.licence"
              size="sm"
              v-bind:state="state.licence"
              v-on:blur.native="state.licence = setState(meta.licence)"
            >
              <option value="CC0">
                CC0
              </option>
              <option value="CC-BY 4.0">
                CC-BY 4.0
              </option>
            </BFormSelect>
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BButton
            variant="secondary"
            size="sm"
            class="float-right"
            v-on:click="$parent.navigate('bibl')"
          >
            {{ label.continue }}
          </BButton>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>
export default {
  name: 'MetaData',
  props: {
    labels: {
      type: Object,
      default: () => {},
    },
    metaData: {
      default: () => {},
      type: Object,
      twoWays: true,
    },
    metaState: {
      default: () => {},
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
        if (value === '' || value === undefined) state = null;
        if ((value !== '' && value !== undefined) && this.$parent.check(regMatch, value)) state = true;
        if ((value !== '' && value !== undefined) && !this.$parent.check(regMatch, value)) state = false;
      } else {
        state = this.$parent.check(regMatch, value);
      }
      return state;
    },
  },
};
</script>
