<template>
  <div class="bulk-upload-wrapper">
    <div class="bulk-up-header">
      <div class="bulk-up-header-text">Bulk Upload</div>
    </div>
    <div class="bulk-up-content">
      <div class="bulk-up-category">
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
      <div class="bulk-up-electoral-state" v-if="category === 'Electoral'">
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
      <div class="bulk-up-electoral-zones" v-if="category === 'Electoral'">
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
      <div class="bulk-up-electoral-zones" v-if="category === 'Electoral'">
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
      <div class="bulk-up-upload">
        <v-file-input
          accept=".pdf,.doc,.docx"
          label="Choose documents"
          v-model="files"
          placeholder="Upload your documents"
          prepend-icon="mdi-paperclip"
          multiple
          @update:modelValue="updateFileNames"
        ></v-file-input>
      </div>
      <div class="bulk-up-btn">
        <v-btn
          density="default"
          @click="onUpload"
          :disabled="
            !(
              files?.length &&
              names.length &&
              category &&
              (category !== 'Electoral' ||
                (category === 'Electoral' && state && district && assembly))
            )
          "
        >
          Upload
          <v-progress-circular
            v-if="uploading"
            class="bulk-up-loader"
            indeterminate
            size="16"
          ></v-progress-circular>
        </v-btn>
      </div>
      <div class="bulk-up-response" v-if="response">
        <v-alert :text="response.text" :type="response.type" closable></v-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { APIS, DOC_CATEGORIES } from '../common/constants'
import { api } from '../common/apis'
import { axiosWrapper } from '../common/axios'

const RESPONSE_MESSAGE = (successCount, failedCount) => {
  const successMessage = `${successCount} document(s) uploaded successfully.`
  const failureMessage = failedCount ? ` ${failedCount} document(s) failed to upload` : ''
  return {
    type: successCount ? 'success' : 'error',
    text: successMessage + failureMessage
  }
}

const FEEDBACK_TIMER = 5000

export default {
  data: () => ({
    files: null,
    uploading: false,
    response: null,
    names: [],
    extensions: [],
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
        this.districts = stateInfo.districts.map(({ name }) => name)
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
        this.assemblies = districtInfo.assemblies
      }
      this.assembly = ''
    },
    updateFileNames(files) {
      if (files.length) {
        for (const file of files) {
          let nameArr = file.name.split('.')
          this.extensions.push(nameArr.pop())
          this.names.push(nameArr.join('.'))
        }
      } else {
        this.names = []
        this.extensions = []
      }
    },
    async uploadFile({ file, name, category, state, district, assembly }) {
      return await axiosWrapper(
        'post',
        APIS.UPLOAD,
        {
          file,
          name,
          category,
          folder: {
            path1: state,
            path2: district,
            path3: assembly
          }
        },
        {
          'Content-Type': 'multipart/form-data'
        }
      )
    },
    async onUpload() {
      if (!this.uploading && this.files?.length) {
        const totalFiles = this.files?.length
        let filesUploaded = 0
        let failedUploads = 0
        this.uploading = true
        this.response = null

        for (const idx in this.files) {
          const response = await this.uploadFile({
            file: this.files[idx],
            name: this.names[idx],
            category: this.category,
            state: this.state,
            district: this.district,
            assembly: this.assembly
          })
          if (response.status === 200) {
            filesUploaded++
          } else {
            failedUploads++
          }
          if (filesUploaded + failedUploads === totalFiles) {
            this.uploading = false
            this.files = null
            this.names.length = 0
            this.category = ''
            this.state = ''
            this.states = []
            this.district = ''
            this.districts = []
            this.assembly = ''
            this.assemblies = []
            this.response = RESPONSE_MESSAGE(filesUploaded, failedUploads)
            setTimeout(() => {
              this.response = null
            }, FEEDBACK_TIMER)
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.bulk-upload-wrapper {
  border: 2px solid var(--color-border-subtle);
  border-radius: 8px;
  width: 600px;
  overflow-y: auto;
  position: relative;
  @include for-phone-only {
    width: 96%;
  }
  .bulk-up-header {
    background: var(--color-title-bg);
    color: var(--color-title-text);
    padding: 12px;
    border-bottom: 2px solid var(--color-border-subtle);
    position: sticky;
    top: 0;
    z-index: 1;
    .bulk-up-header-text {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .bulk-up-content {
    padding: 12px;
    color: #000;
    background: #fff;
    .bulk-up-tag-view {
      max-width: 400px;
    }
    .bulk-up-btn {
      text-align: right;
      .bulk-up-loader {
        margin-left: 8px;
      }
    }
    .bulk-up-response {
      margin-top: 8px;
    }
  }
}
</style>
