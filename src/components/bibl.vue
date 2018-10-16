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
  <div class="biblData">
    <b-container>
      <b-row>
        <b-col>
          <h3>{{ label.bibInfo }}</h3>
          {{ label.step2Desc }}
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-card v-for="(item, key) in bibl"
                  v-bind:key="item.id"
                  class="mb-2">
            <b-row align-h="end"
                   v-if="bibl.length > 1">
              <b-col cols="1">
                <b-button size="sm"
                          class="w-100 mb-2"
                          v-on:click="rmBiblItem(item.id)">
                  <i class="fa fa-trash-alt"></i>
                </b-button>
              </b-col>
            </b-row>
            <b-form-group horizontal
                          v-bind:label-cols="2"
                          label-size="sm"
                          v-bind:label="label.bibType"
                          v-bind:invalid-feedback="label.errorBiblType"
                          label-for="biblType">
              <b-form-select id="biblType"
                             v-model="item.type"
                             v-on:blur.native="state[key].type = setState(item, 'type')"
                             v-bind:state="state[key].type">
                <option v-bind:value="null">{{ label.selectBibType }}</option>
                <option value="online">{{ label.bibTypeOnline }}</option>
                <option value="print">{{ label.bibTypePrint }}</option>
                <option value="hybrid">{{ label.bibTypeHybrid }}</option>
              </b-form-select>
            </b-form-group>
            <b-form-group horizontal
                          v-bind:label-cols="2"
                          label-size="sm"
                          v-bind:label="label.bibTitle"
                          v-bind:invalid-feedback="label.errorBibl"
                          label-for="biblText">
              <b-form-textarea id="biblText"
                               v-model="item.text"
                               v-bind:rows="3"
                               v-bind:max-rows="3"
                               v-on:blur.native="(state[key].text = setState(item, 'text'))"
                               v-bind:state="state[key].text"></b-form-textarea>
            </b-form-group>
            <b-form-group horizontal
                          v-if="item.type === 'online' || item.type === 'hybrid'"
                          v-bind:label-cols="2"
                          label-size="sm"
                          v-bind:label="label.bibUrl"
                          v-bind:invalid-feedback="label.errorURLFormat"
                          label-for="biblUrl">
              <b-form-input id="biblUrl"
                            size="sm"
                            v-model="item.url"
                            v-on:blur.native="(state[key].url = setState(item, 'url'))"
                            v-bind:state="state[key].url"></b-form-input>
            </b-form-group>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button v-on:click="addBiblItem"
                    size="sm"
                    variant="secondary">
            <i class="fas fa-plus-circle"></i> {{ label.addBib }}
          </b-button>
        </b-col>
        <b-col>
          <b-button v-on:click="$parent.navigate('correspDesc')"
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
  name: 'biblData',
  props: {
    labels: {
      type: Object,
      default: () => ({}),
    },
    biblData: {
      type: Array,
      twoWays: true,
    },
    biblState: {
      type: Array,
      twoWays: true,
    },
  },

  data() {
    return {
      label: this.labels,

      nextKey: 1,
      bibl: this.biblData,

      state: this.biblState,
    };
  },

  methods: {
    // Check values
    setState(item, field) {
      let state = false;
      if (field === 'url') {
        if (item.url !== '') {
          state = this.$parent.check('url', item.url);
        } else {
          state = null;
        }
      } else if (
        item[field] !== ''
        && item[field] !== null
      ) {
        state = true;
      }
      return state;
    },

    // Add new Bibliographical Item
    addBiblItem() {
      this.bibl.push({
        id: this.nextKey,
        uuid: this.uuid(),
        type: null,
        url: '',
        text: '',
        selected: '',
      });
      this.state.push({
        type: null,
        text: null,
        url: null,
      });
      this.nextKey += 1;
    },

    // Remove Bibliographical Item
    rmBiblItem(key) {
      for (let i = 0; i < this.bibl.length; i += 1) {
        if (key === this.bibl[i].id) {
          this.bibl.splice(i, 1);
          this.state.splice(i, 1);
        }
      }
    },

    // Generate and return uuid v4
    uuid() {
      let result = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); // eslint-disable-line
      result = String.fromCharCode(Math.floor(Math.random() * 26) + 97) + result.substr(1);
      return result;
    },
  },

  // if there is no uuid yet (e.g. new project), set a new one
  mounted() {
    this.bibl[0].uuid = (this.bibl[0].uuid === '') ? this.uuid() : this.bibl[0].uuid;
  },
};
</script>
