import "#admin/common/ak-flow-search/ak-source-flow-search";
import "#components/ak-secret-text-input";
import "#components/ak-secret-textarea-input";
import "#components/ak-slug-input";
import "#components/ak-switch-input";
import "#components/ak-text-input";
import "#components/ak-textarea-input";
import "#elements/ak-dual-select/ak-dual-select-dynamic-selected-provider";
import "#elements/forms/FormGroup";
import "#elements/forms/HorizontalFormElement";
import "#elements/forms/SearchSelect/index";

import { propertyMappingsProvider, propertyMappingsSelector } from "./KerberosSourceFormHelpers.js";

import { config, DEFAULT_CONFIG } from "#common/api/config";

import { CapabilitiesEnum, WithCapabilitiesConfig } from "#elements/mixins/capabilities";

import { iconHelperText, placeholderHelperText } from "#admin/helperText";
import { BaseSourceForm } from "#admin/sources/BaseSourceForm";
import { GroupMatchingModeToLabel, UserMatchingModeToLabel } from "#admin/sources/oauth/utils";

import {
    FlowsInstancesListDesignationEnum,
    GroupMatchingModeEnum,
    KadminTypeEnum,
    KerberosSource,
    KerberosSourceRequest,
    SourcesApi,
    UserMatchingModeEnum,
} from "@goauthentik/api";

import { msg } from "@lit/localize";
import { html, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("ak-source-kerberos-form")
export class KerberosSourceForm extends WithCapabilitiesConfig(BaseSourceForm<KerberosSource>) {
    async loadInstance(pk: string): Promise<KerberosSource> {
        const source = await new SourcesApi(DEFAULT_CONFIG).sourcesKerberosRetrieve({
            slug: pk,
        });
        this.clearIcon = false;
        return source;
    }

    @state()
    clearIcon = false;

    async send(data: KerberosSource): Promise<KerberosSource> {
        let source: KerberosSource;
        if (this.instance) {
            source = await new SourcesApi(DEFAULT_CONFIG).sourcesKerberosPartialUpdate({
                slug: this.instance.slug,
                patchedKerberosSourceRequest: data,
            });
        } else {
            source = await new SourcesApi(DEFAULT_CONFIG).sourcesKerberosCreate({
                kerberosSourceRequest: data as unknown as KerberosSourceRequest,
            });
        }
        const c = await config();
        if (c.capabilities.includes(CapabilitiesEnum.CanSaveMedia)) {
            const icon = this.files().get("icon");
            if (icon || this.clearIcon) {
                await new SourcesApi(DEFAULT_CONFIG).sourcesAllSetIconCreate({
                    slug: source.slug,
                    file: icon,
                    clear: this.clearIcon,
                });
            }
        } else {
            await new SourcesApi(DEFAULT_CONFIG).sourcesAllSetIconUrlCreate({
                slug: source.slug,
                filePathRequest: {
                    url: data.icon || "",
                },
            });
        }
        return source;
    }

    renderForm(): TemplateResult {
        return html` <ak-text-input
                name="name"
                label=${msg("Name")}
                value=${ifDefined(this.instance?.name)}
                required
            ></ak-text-input>
            <ak-slug-input
                name="slug"
                value=${ifDefined(this.instance?.slug)}
                label=${msg("Slug")}
                required
                input-hint="code"
            ></ak-slug-input>
            <ak-switch-input
                name="enabled"
                ?checked=${this.instance?.enabled ?? true}
                label=${msg("Enabled")}
            ></ak-switch-input>
            <ak-switch-input
                name="passwordLoginUpdateInternalPassword"
                ?checked=${this.instance?.passwordLoginUpdateInternalPassword ?? false}
                label=${msg("Update internal password on login")}
                help=${msg(
                    "When the user logs in to authentik using this source password backend, update their credentials in authentik.",
                )}
            ></ak-switch-input>
            <ak-switch-input
                name="syncUsers"
                ?checked=${this.instance?.syncUsers ?? true}
                label=${msg("Sync users")}
            ></ak-switch-input>
            <ak-switch-input
                name="syncUsersPassword"
                ?checked=${this.instance?.syncUsersPassword ?? true}
                label=${msg("User password writeback")}
                help=${msg(
                    "Enable this option to write password changes made in authentik back to Kerberos. Ignored if sync is disabled.",
                )}
            ></ak-switch-input>
            <ak-form-group open label="${msg("Realm settings")}">
                <div class="pf-c-form">
                    <ak-text-input
                        name="realm"
                        label=${msg("Realm")}
                        value=${ifDefined(this.instance?.realm)}
                        placeholder="AUTHENTIK.COMPANY"
                        required
                    ></ak-text-input>
                    <ak-textarea-input
                        name="krb5Conf"
                        label=${msg("Kerberos 5 configuration")}
                        value=${ifDefined(this.instance?.krb5Conf)}
                        help=${msg(
                            "Kerberos 5 configuration. See man krb5.conf(5) for configuration format. If left empty, a default krb5.conf will be used.",
                        )}
                    ></ak-textarea-input>
                    <ak-form-element-horizontal
                        label=${msg("User matching mode")}
                        required
                        name="userMatchingMode"
                    >
                        <select class="pf-c-form-control">
                            <option
                                value=${UserMatchingModeEnum.Identifier}
                                ?selected=${this.instance?.userMatchingMode ===
                                UserMatchingModeEnum.Identifier}
                            >
                                ${UserMatchingModeToLabel(UserMatchingModeEnum.Identifier)}
                            </option>
                            <option
                                value=${UserMatchingModeEnum.EmailLink}
                                ?selected=${this.instance?.userMatchingMode ===
                                UserMatchingModeEnum.EmailLink}
                            >
                                ${UserMatchingModeToLabel(UserMatchingModeEnum.EmailLink)}
                            </option>
                            <option
                                value=${UserMatchingModeEnum.EmailDeny}
                                ?selected=${this.instance?.userMatchingMode ===
                                UserMatchingModeEnum.EmailDeny}
                            >
                                ${UserMatchingModeToLabel(UserMatchingModeEnum.EmailDeny)}
                            </option>
                            <option
                                value=${UserMatchingModeEnum.UsernameLink}
                                ?selected=${this.instance?.userMatchingMode ===
                                UserMatchingModeEnum.UsernameLink}
                            >
                                ${UserMatchingModeToLabel(UserMatchingModeEnum.UsernameLink)}
                            </option>
                            <option
                                value=${UserMatchingModeEnum.UsernameDeny}
                                ?selected=${this.instance?.userMatchingMode ===
                                UserMatchingModeEnum.UsernameDeny}
                            >
                                ${UserMatchingModeToLabel(UserMatchingModeEnum.UsernameDeny)}
                            </option>
                        </select>
                    </ak-form-element-horizontal>
                    <ak-form-element-horizontal
                        label=${msg("Group matching mode")}
                        required
                        name="groupMatchingMode"
                    >
                        <select class="pf-c-form-control">
                            <option
                                value=${GroupMatchingModeEnum.Identifier}
                                ?selected=${this.instance?.groupMatchingMode ===
                                GroupMatchingModeEnum.Identifier}
                            >
                                ${UserMatchingModeToLabel(UserMatchingModeEnum.Identifier)}
                            </option>
                            <option
                                value=${GroupMatchingModeEnum.NameLink}
                                ?selected=${this.instance?.groupMatchingMode ===
                                GroupMatchingModeEnum.NameLink}
                            >
                                ${GroupMatchingModeToLabel(GroupMatchingModeEnum.NameLink)}
                            </option>
                            <option
                                value=${GroupMatchingModeEnum.NameDeny}
                                ?selected=${this.instance?.groupMatchingMode ===
                                GroupMatchingModeEnum.NameDeny}
                            >
                                ${GroupMatchingModeToLabel(GroupMatchingModeEnum.NameDeny)}
                            </option>
                        </select>
                    </ak-form-element-horizontal>
                </div>
            </ak-form-group>
            <ak-form-group label="${msg("Sync connection settings")}">
                <div class="pf-c-form">
                    <ak-form-element-horizontal
                        label=${msg("KAdmin type")}
                        required
                        name="kadminType"
                    >
                        <ak-radio
                            .options=${[
                                {
                                    label: "MIT",
                                    value: KadminTypeEnum.Mit,
                                    default: true,
                                    description: html`${msg("MIT krb5 kadmin")}`,
                                },
                                {
                                    label: "Heimdal",
                                    value: KadminTypeEnum.Heimdal,
                                    description: html`${msg("Heimdal kadmin")}`,
                                },
                                {
                                    label: msg("Other"),
                                    value: KadminTypeEnum.Other,
                                    description: html`${msg("Other type of kadmin")}`,
                                },
                            ]}
                            .value=${this.instance?.kadminType}
                        >
                        </ak-radio>
                    </ak-form-element-horizontal>
                    <ak-text-input
                        name="syncPrincipal"
                        label=${msg("Sync principal")}
                        value=${ifDefined(this.instance?.syncPrincipal)}
                        help=${msg("Principal used to authenticate to the KDC for syncing.")}
                    ></ak-text-input>
                    <ak-secret-text-input
                        name="syncPassword"
                        label=${msg("Sync password")}
                        ?revealed=${this.instance === undefined}
                        help=${msg(
                            "Password used to authenticate to the KDC for syncing. Optional if Sync keytab or Sync credentials cache is provided.",
                        )}
                    ></ak-secret-text-input>
                    <ak-secret-textarea-input
                        name="syncKeytab"
                        label=${msg("Sync keytab")}
                        ?revealed=${this.instance === undefined}
                        help=${msg(
                            "Keytab used to authenticate to the KDC for syncing. Optional if Sync password or Sync credentials cache is provided. Must be base64 encoded or in the form TYPE:residual.",
                        )}
                    ></ak-secret-textarea-input>
                    <ak-text-input
                        name="syncCcache"
                        label=${msg("Sync credentials cache")}
                        value=${ifDefined(this.instance?.syncCcache)}
                        help=${msg(
                            "Credentials cache used to authenticate to the KDC for syncing. Optional if Sync password or Sync keytab is provided. Must be in the form TYPE:residual.",
                        )}
                    ></ak-text-input>
                </div>
            </ak-form-group>
            <ak-form-group label="${msg("SPNEGO settings")}">
                <div class="pf-c-form">
                    <ak-text-input
                        name="spnegoServerName"
                        label=${msg("SPNEGO server name")}
                        value=${ifDefined(this.instance?.spnegoServerName)}
                        help=${msg(
                            "Force the use of a specific server name for SPNEGO. Must be in the form HTTP@domain",
                        )}
                    ></ak-text-input>
                    <ak-secret-textarea-input
                        name="spnegoKeytab"
                        label=${msg("SPNEGO keytab")}
                        ?revealed=${this.instance === undefined}
                        help=${msg(
                            "Keytab used for SPNEGO. Optional if SPNEGO credentials cache is provided. Must be base64 encoded or in the form TYPE:residual.",
                        )}
                    ></ak-secret-textarea-input>
                    <ak-text-input
                        name="spnegoCcache"
                        label=${msg("SPNEGO credentials cache")}
                        value=${ifDefined(this.instance?.spnegoCcache)}
                        help=${msg(
                            "Credentials cache used for SPNEGO. Optional if SPNEGO keytab is provided. Must be in the form TYPE:residual.",
                        )}
                    ></ak-text-input>
                </div>
            </ak-form-group>
            <ak-form-group label="${msg("Kerberos Attribute mapping")}">
                <div class="pf-c-form">
                    <ak-form-element-horizontal
                        label=${msg("User Property Mappings")}
                        name="userPropertyMappings"
                    >
                        <ak-dual-select-dynamic-selected
                            .provider=${propertyMappingsProvider}
                            .selector=${propertyMappingsSelector(
                                "user",
                                this.instance?.userPropertyMappings,
                            )}
                            available-label="${msg("Available User Property Mappings")}"
                            selected-label="${msg("Selected User Property Mappings")}"
                        ></ak-dual-select-dynamic-selected>
                        <p class="pf-c-form__helper-text">
                            ${msg("Property mappings for user creation.")}
                        </p>
                    </ak-form-element-horizontal>
                    <ak-form-element-horizontal
                        label=${msg("Group Property Mappings")}
                        name="groupPropertyMappings"
                    >
                        <ak-dual-select-dynamic-selected
                            .provider=${propertyMappingsProvider}
                            .selector=${propertyMappingsSelector(
                                "group",
                                this.instance?.groupPropertyMappings,
                            )}
                            available-label="${msg("Available Group Property Mappings")}"
                            selected-label="${msg("Selected Group Property Mappings")}"
                        ></ak-dual-select-dynamic-selected>
                        <p class="pf-c-form__helper-text">
                            ${msg("Property mappings for group creation.")}
                        </p>
                    </ak-form-element-horizontal>
                </div>
            </ak-form-group>
            <ak-form-group label="${msg("Flow settings")}">
                <div class="pf-c-form">
                    <ak-form-element-horizontal
                        label=${msg("Authentication flow")}
                        name="authenticationFlow"
                    >
                        <ak-source-flow-search
                            flowType=${FlowsInstancesListDesignationEnum.Authentication}
                            .currentFlow=${this.instance?.authenticationFlow}
                            .instanceId=${this.instance?.pk}
                            fallback="default-source-authentication"
                        ></ak-source-flow-search>
                        <p class="pf-c-form__helper-text">
                            ${msg("Flow to use when authenticating existing users.")}
                        </p>
                    </ak-form-element-horizontal>
                    <ak-form-element-horizontal
                        label=${msg("Enrollment flow")}
                        name="enrollmentFlow"
                    >
                        <ak-source-flow-search
                            flowType=${FlowsInstancesListDesignationEnum.Enrollment}
                            .currentFlow=${this.instance?.enrollmentFlow}
                            .instanceId=${this.instance?.pk}
                            fallback="default-source-enrollment"
                        ></ak-source-flow-search>
                        <p class="pf-c-form__helper-text">
                            ${msg("Flow to use when enrolling new users.")}
                        </p>
                    </ak-form-element-horizontal>
                </div>
            </ak-form-group>
            <ak-form-group label="${msg("Additional settings")}">
                <div class="pf-c-form">
                    <ak-text-input
                        name="userPathTemplate"
                        label=${msg("User path")}
                        value=${this.instance?.userPathTemplate ??
                        "goauthentik.io/sources/%(slug)s"}
                        help=${placeholderHelperText}
                    ></ak-text-input>
                </div>
                ${this.can(CapabilitiesEnum.CanSaveMedia)
                    ? html`<ak-form-element-horizontal label=${msg("Icon")} name="icon">
                              <input type="file" value="" class="pf-c-form-control" />
                              ${this.instance?.icon
                                  ? html`
                                        <p class="pf-c-form__helper-text">
                                            ${msg("Currently set to:")} ${this.instance?.icon}
                                        </p>
                                    `
                                  : html``}
                          </ak-form-element-horizontal>
                          ${this.instance?.icon
                              ? html`
                                    <ak-form-element-horizontal>
                                        <label class="pf-c-switch">
                                            <input
                                                class="pf-c-switch__input"
                                                type="checkbox"
                                                @change=${(ev: Event) => {
                                                    const target = ev.target as HTMLInputElement;
                                                    this.clearIcon = target.checked;
                                                }}
                                            />
                                            <span class="pf-c-switch__toggle">
                                                <span class="pf-c-switch__toggle-icon">
                                                    <i class="fas fa-check" aria-hidden="true"></i>
                                                </span>
                                            </span>
                                            <span class="pf-c-switch__label">
                                                ${msg("Clear icon")}
                                            </span>
                                        </label>
                                        <p class="pf-c-form__helper-text">
                                            ${msg("Delete currently set icon.")}
                                        </p>
                                    </ak-form-element-horizontal>
                                `
                              : html``}`
                    : html`<ak-form-element-horizontal label=${msg("Icon")} name="icon">
                          <input
                              type="text"
                              value="${this.instance?.icon ?? ""}"
                              class="pf-c-form-control"
                          />
                          <p class="pf-c-form__helper-text">${iconHelperText}</p>
                      </ak-form-element-horizontal>`}
            </ak-form-group>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-source-kerberos-form": KerberosSourceForm;
    }
}
