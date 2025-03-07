<template>
    <div class="user-management-wrapper">
        <div class="um-content">
            <!-- User List Table -->
            <div class="um-table-wrapper">
                <v-data-table
                    :headers="headers"
                    :items="users"
                    :loading="loadingUsers"
                    class="elevation-1"
                >
                    <template v-slot:item.roles="{ item }">
                        <v-chip
                            v-for="role in item.roles"
                            :key="role"
                            class="ma-1"
                            size="small"
                        >
                            {{ role.toLowerCase() }}
                        </v-chip>
                    </template>
                    
                    <template v-slot:item.electoralEntitlements="{ item }">
                        <v-chip
                            v-for="entitlement in item.electoralEntitlements"
                            :key="entitlement"
                            class="ma-1"
                            size="small"
                        >
                            {{ entitlement }}
                        </v-chip>
                    </template>
                    
                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            icon="mdi-pencil"
                            size="small"
                            @click="editUser(item)"
                            color="primary"
                        ></v-btn>
                    </template>
                </v-data-table>
            </div>

            <div class="um-response" v-if="response">
                <v-alert :text="response.text" :type="response.type" closable></v-alert>
            </div>

            <!-- Edit User Dialog -->
            <v-dialog v-model="editDialog" max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="text-h5">Edit User</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="editedUser.email"
                                        label="Email"
                                        disabled
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select
                                        v-model="editedUser.roles"
                                        :items="availableRoles"
                                        label="Roles"
                                        multiple
                                        chips
                                    ></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-select
                                        v-model="editedUser.selectedEntitlement"
                                        :items="entitlementOptions"
                                        label="Electoral Entitlement"
                                        :loading="loadingEntitlements"
                                        item-title="displayValue"
                                        item-value="value"
                                        return-object
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="closeEditDialog">
                            Cancel
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="saveUser" :loading="savingUser">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>
<script>
import { api } from '../common/apis';
import { APIS } from '../common/constants';

const RESPONSES = {
    UPDATE_SUCCESS: () => ({
        type: "success",
        text: `User updated successfully`
    }),
    FAILURE: (err) => ({
        type: "error",
        text: err || `Failed to perform operation. Please try again`
    })
}

const SUCCESS_TIMER = 2000;
const FAIL_TIMER = 7000;

export default {
    data: () => ({
        selectedRoles: [],
        availableRoles: ['reader', 'admin'],
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
        },
        // User list table data
        headers: [
            { title: 'Email', key: 'email' },
            { title: 'Roles', key: 'roles' },
            { title: 'Electoral Entitlements', key: 'electoralEntitlements' },
            { title: 'Actions', key: 'actions', sortable: false }
        ],
        users: [],
        loadingUsers: false,
        // Edit user dialog
        editDialog: false,
        editedUser: {
            id: '',
            email: '',
            roles: [],
            electoralEntitlements: [],
            selectedEntitlement: null
        },
        savingUser: false
    }),
    mounted() {
        this.fetchEntitlements();
        this.fetchUsers();
    },
    methods: {
        async fetchEntitlements() {
            this.loadingEntitlements = true;
            try {
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
        async fetchUsers() {
            this.loadingUsers = true;
            try {
                const response = await api.get(APIS.USERS);
                
                if (!response.ok) {
                    throw new Error('Failed to load users');
                }
                
                const data = await response.json();
                this.users = data;
            } catch (error) {
                console.error('Error loading users:', error);
                this.response = RESPONSES.FAILURE('Failed to load users. Please refresh the page.');
                setTimeout(() => {
                    this.response = null;
                }, FAIL_TIMER);
            } finally {
                this.loadingUsers = false;
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
                                        value: assembly,
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
                return a.assemblyNumber - b.assemblyNumber;
            });
            
            this.entitlementOptions = options;
        },
        editUser(user) {
            // Find the entitlement object that matches the user's entitlement
            let selectedEntitlement = null;
            if (user.electoralEntitlements && user.electoralEntitlements.length > 0) {
                const entitlementValue = user.electoralEntitlements[0];
                selectedEntitlement = this.entitlementOptions.find(option => 
                    option.displayValue === entitlementValue
                ) || null;
            }
            
            this.editedUser = {
                id: user.id,
                email: user.email,
                roles: [...user.roles],
                electoralEntitlements: [...user.electoralEntitlements],
                selectedEntitlement: selectedEntitlement
            };
            this.editDialog = true;
        },
        closeEditDialog() {
            this.editDialog = false;
            this.editedUser = {
                id: '',
                email: '',
                roles: [],
                electoralEntitlements: [],
                selectedEntitlement: null
            };
        },
        async saveUser() {
            this.savingUser = true;
            try {
                // Create an array for electoralEntitlements
                const entitlements = this.editedUser.selectedEntitlement 
                    ? [this.editedUser.selectedEntitlement.displayValue] 
                    : [];
                
                const userData = {
                    id: this.editedUser.id,
                    roles: this.editedUser.roles,
                    electoralEntitlements: entitlements
                };
                
                const response = await api.patch(APIS.USER, userData);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update user');
                }
                
                this.response = RESPONSES.UPDATE_SUCCESS();
                
                // Refresh the user list and close the dialog
                this.fetchUsers();
                this.closeEditDialog();
                
                setTimeout(() => {
                    this.response = null;
                }, SUCCESS_TIMER);
            } catch (error) {
                this.response = RESPONSES.FAILURE(error.message);
                setTimeout(() => {
                    this.response = null;
                }, FAIL_TIMER);
            } finally {
                this.savingUser = false;
            }
        }
    },
}
</script>
<style lang="scss">
@import '../assets/media.scss';

.user-management-wrapper {
    width: 100%;
    overflow: hidden;

    @include for-phone-only {
        width: 100%;
    }

    .um-content {
        color: #000;

        .um-response {
            margin-top: 16px;
        }

        .um-table-wrapper {
            margin-top: 16px;
        }
    }
}
</style> 