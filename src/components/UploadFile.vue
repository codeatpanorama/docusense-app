<template>
  <div class="upload-wrapper">
    <div class="up-header">
      <div class="up-header-text">New Document</div>
    </div>
    <div class="up-content">
      <div class="up-category">
        <v-autocomplete
          label="Document Category"
          :items="categories"
          v-model="category"
          prepend-icon="mdi-format-list-bulleted-type"
          :rules="[rules.required]"
          validate-on="blur"
          @update:modelValue="updateStates"
        ></v-autocomplete>
      </div>
      <div class="up-electoral-state" v-if="category === 'Electoral'">
        <v-autocomplete
          label="Electoral State"
          :items="states"
          v-model="state"
          prepend-icon="mdi-city"
          :rules="[rules.required]"
          validate-on="blur"
          @update:modelValue="updateDistricts"
        ></v-autocomplete>
      </div>
      <div class="up-electoral-zones" v-if="category === 'Electoral'">
        <v-autocomplete
          label="Electoral District"
          :items="districts"
          v-model="district"
          prepend-icon="mdi-home-city"
          :rules="[rules.required]"
          validate-on="blur"
          @update:modelValue="updateAssemblies"
          :disabled="!state"
        ></v-autocomplete>
      </div>
      <div class="up-electoral-zones" v-if="category === 'Electoral'">
        <v-autocomplete
          label="Electoral District"
          :items="assemblies"
          v-model="assembly"
          prepend-icon="mdi-home"
          :rules="[rules.required]"
          validate-on="blur"
          :disabled="!district"
        ></v-autocomplete>
      </div>
      <div class="up-upload">
        <v-file-input
          accept=".pdf,.doc,.docx"
          label="Choose a file"
          v-model="file"
          @update:modelValue="updateFileName"
        ></v-file-input>
      </div>
      <div class="up-name">
        <v-text-field
          label="Document Name"
          v-model="name"
          prepend-icon="mdi-file-document-edit"
          :rules="[rules.required]"
          validate-on="blur"
        ></v-text-field>
      </div>
      <div class="up-btn">
        <v-btn
          density="default"
          @click="onUpload"
          :disabled="
            !(
              file &&
              name &&
              category &&
              (category !== 'Electoral' ||
                (category === 'Electoral' && state && district && assembly))
            )
          "
        >
          Upload
          <v-progress-circular
            v-if="uploading"
            class="up-loader"
            indeterminate
            size="16"
          ></v-progress-circular>
        </v-btn>
      </div>
      <div class="up-response" v-if="response">
        <v-alert :text="response.text" :type="response.type" closable></v-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { APIS, DOC_CATEGORIES } from '../common/constants'
import { api } from '../common/apis'
import { axiosWrapper } from '../common/axios'

const RESPONSES = {
  SUCCESS: (name) => ({
    type: 'success',
    text: `${name} uploaded successfully!`
  }),
  FAILURE: (err) => ({
    type: 'error',
    text: `Failed to upload document. ${err ? err : ''}`
  })
}

const FEEDBACK_TIMER = 5000

export default {
  data: () => ({
    file: null,
    uploading: false,
    response: null,
    name: '',
    extension: '',
    category: '',
    categories: DOC_CATEGORIES,
    selectedZone: '',
    electoralZones: [],
    state: '',
    states: [],
    district: '',
    districts: [],
    assembly: '',
    assemblies: [],
    rules: {
      required: (value) => !!value || 'Required.'
    }
  }),
  mounted() {
    api
      .get(APIS.ELECTORAL_ZONES)
      .then((resp) => {
        return resp.json()
      })
      .then((data) => {
        if (data?.states) {
          this.electoralZones = data.states
        }
      })
  },
  methods: {
    updateStates() {
      if (this.category !== 'Electoral' || !this.electoralZones?.length) {
        this.states = []
        this.districts = []
        this.assemblies = []
      } else {
        this.states = this.electoralZones.map(({ name }) => name)
      }
      this.state = ''
      this.district = ''
      this.assembly = ''
    },
    updateDistricts() {
      if (!this.state) {
        this.districts = []
        this.assemblies = []
      } else {
        const stateInfo = this.electoralZones.find(({ name }) => name === this.state)
        this.districts = stateInfo.districts.map(({ name }) => name) ?? []
      }
      this.district = ''
      this.assembly = ''
    },
    updateAssemblies() {
      if (!this.district) {
        this.assemblies = []
      } else {
        const stateInfo = this.electoralZones.find(({ name }) => name === this.state)
        const districtInfo = stateInfo.districts.find(({ name }) => name === this.district)
        this.assemblies = districtInfo?.assemblies ?? []
      }
      this.assembly = ''
    },
    updateFileName(files) {
      if (files.length) {
        let nameArr = files[0].name.split('.')
        this.extension = nameArr.pop()
        this.name = nameArr.join('.')
      } else {
        this.name = ''
        this.extension = ''
      }
    },
    onUpload() {
      if (!this.uploading && this.file) {
        this.uploading = true
        this.response = null
        axiosWrapper(
          'post',
          APIS.UPLOAD,
          {
            file: this.file[0],
            name: this.name,
            category: this.category.toLowerCase(),
            folder: {
              path1: this.state,
              path2: this.district,
              path3: this.assembly
            }
          },
          {
            'Content-Type': 'multipart/form-data'
          }
        )
          .then((resp) => {
            this.uploading = false
            this.file = null
            this.name = ''
            this.category = ''
            this.state = ''
            this.states = []
            this.district = ''
            this.districts = []
            this.assembly = ''
            this.assemblies = []
            this.response = RESPONSES.SUCCESS(resp?.data?.name)
            setTimeout(() => {
              this.response = null
            }, FEEDBACK_TIMER)
          })
          .catch((err) => {
            this.uploading = false
            this.response = RESPONSES.FAILURE(err?.response?.data?.detail)
            setTimeout(() => {
              this.response = null
            }, FEEDBACK_TIMER)
          })
      }
    }
  }
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.upload-wrapper {
  border: 2px solid var(--color-border-subtle);
  border-radius: 8px;
  width: 600px;
  overflow-y: auto;
  position: relative;
  @include for-phone-only {
    width: 96%;
  }
  .up-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);
    position: sticky;
    top: 0;
    z-index: 1;
    .up-header-text {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .up-content {
    padding: 12px;
    color: #000;
    background: #fff;
    .up-tag-view {
      max-width: 400px;
    }
    .up-btn {
      text-align: right;
      .up-loader {
        margin-left: 8px;
      }
    }
    .up-response {
      margin-top: 8px;
    }
  }
}
</style>
