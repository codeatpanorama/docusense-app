<template>
    <div class="user-management-wrapper">
        <div class="um-header">
            <div class="um-header-text">User Management</div>
        </div>
        <div class="um-content">
            <div class="um-user-id">
                <v-text-field v-model="userId" 
                    prepend-icon="mdi-account-key" 
                    :rules="[rules.required]" 
                    name="user-id" 
                    label="User ID"></v-text-field>
            </div>
            <div class="um-roles">
                <v-select
                    v-model="selectedRoles"
                    :items="availableRoles"
                    prepend-icon="mdi-account-multiple-check"
                    :rules="[rules.required]"
                    name="roles"
                    label="Roles"
                    multiple
                    chips
                ></v-select>
            </div>
            <div class="um-entitlements">
                <v-select
                    v-model="selectedEntitlement"
                    :items="entitlementOptions"
                    prepend-icon="mdi-shield-account"
                    name="electoral-entitlements"
                    label="Electoral Entitlement"
                    :loading="loadingEntitlements"
                    :disabled="loadingEntitlements"
                    item-title="displayValue"
                    item-value="value"
                    return-object
                ></v-select>
            </div>
            <div class="um-btn">
                <v-btn :disabled="!(userId && selectedRoles.length > 0)" density="default" @click="onAddUserClick" :loading="processing">
                    ADD USER
                </v-btn>
            </div>
            <div class="um-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>
        </div>
    </div>
</template>
<script>
import { api } from '../common/apis';
import { APIS } from '../common/constants';

const RESPONSES = {
    SUCCESS: () => ({
        type: "success",
        text: `User added successfully`
    }),
    FAILURE: (err) => ({
        type: "error",
        text: err || `Failed to add user. Please try again`
    })
}

const SUCCESS_TIMER = 2000;
const FAIL_TIMER = 7000;

export default {
    data: () => ({
        processing: false,
        userId: '',
        selectedRoles: [],
        availableRoles: ['reader'],
        selectedEntitlement: null,
        entitlementOptions: [],
        loadingEntitlements: false,
        response: '',
        rules: {
            required: value => {
                if (Array.isArray(value)) {
                    return value.length > 0 || 'At least one role is required';
                }
                return !!value || 'Required.';
            }
        }
    }),
    mounted() {
        this.fetchEntitlements();
    },
    methods: {
        async fetchEntitlements() {
            this.loadingEntitlements = true;
            try {
                // Replace with your actual API endpoint
                const response = await api.get(APIS.ELECTORAL_ZONES);
                
                if (!response.ok) {
                    throw new Error('Failed to load entitlements');
                }
                
                const data = await response.json();
                this.processEntitlements(data);
            } catch (error) {
                console.error('Error loading entitlements:', error);
                this.response = RESPONSES.FAILURE('Failed to load entitlements. Please refresh the page.');
                setTimeout(() => {
                    this.response = null;
                }, FAIL_TIMER);
            } finally {
                this.loadingEntitlements = false;
            }
        },
        processEntitlements(data) {
            const options = [];
            
            // Process the nested structure to extract all assembly values
            if (data && data.states) {
                data.states.forEach(state => {
                    if (state.districts) {
                        state.districts.forEach(district => {
                            if (district.assemblies) {
                                district.assemblies.forEach(assembly => {
                                    // Extract the assembly number for better sorting
                                    const assemblyMatch = assembly.match(/^(\d+)-(.+)$/);
                                    const assemblyNumber = assemblyMatch ? parseInt(assemblyMatch[1], 10) : 0;
                                    const assemblyName = assemblyMatch ? assemblyMatch[2] : assembly;
                                    
                                    options.push({
                                        assemblyNumber: assemblyNumber,
                                        assemblyName: assemblyName,
                                        displayValue: assembly
                                    });
                                });
                            }
                        });
                    }
                });
            }
            
            // Sort options by assembly number
            options.sort((a, b) => {
                // Finally sort by assembly number
                return a.assemblyNumber - b.assemblyNumber;
            });
            
            this.entitlementOptions = options;
        },
        onAddUserClick() {
            if (!this.processing && this.userId && this.selectedRoles.length > 0) {
                this.processing = true;
                this.addUser();
            }
        },
        async addUser() {
            try {
                // Create an array for electoralEntitlements
                const entitlements = this.selectedEntitlement ? [this.selectedEntitlement.displayValue] : [];
                
                const userData = {
                    id: this.userId,
                    roles: this.selectedRoles,
                    electoralEntitlements: entitlements
                };
                
                // Replace with your actual API endpoint
                const response = await api.post(APIS.USER, userData);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to add user');
                }
                
                this.response = RESPONSES.SUCCESS();
                // Reset form after success
                this.userId = '';
                this.selectedRoles = [];
                this.selectedEntitlement = null;
                
                setTimeout(() => {
                    this.response = null;
                }, SUCCESS_TIMER);
            } catch (error) {
                this.response = RESPONSES.FAILURE(error.message);
                setTimeout(() => {
                    this.response = null;
                }, FAIL_TIMER);
            } finally {
                this.processing = false;
            }
        }
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.user-management-wrapper {
    border: 2px solid var(--color-border-subtle);
    border-radius: 8px;
    width: 500px;
    overflow: hidden;

    @include for-phone-only {
        width: 96%;
    }

    .um-header {
        background: var(--color-title-bg);
        color: var(--color-title-text);
        padding: 12px;
        border-bottom: 2px solid var(--color-border-subtle);

        .um-header-text {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .um-content {
        padding: 12px;
        color: #000;

        .um-btn {
            text-align: right;
            margin-top: 16px;
        }

        .um-response {
            margin-top: 8px;
        }
    }
}
</style> 