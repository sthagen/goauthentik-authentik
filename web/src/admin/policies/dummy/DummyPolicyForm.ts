import "#elements/forms/FormGroup";
import "#elements/forms/HorizontalFormElement";

import { DEFAULT_CONFIG } from "#common/api/config";

import { BasePolicyForm } from "#admin/policies/BasePolicyForm";

import { DummyPolicy, PoliciesApi } from "@goauthentik/api";

import { msg } from "@lit/localize";
import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("ak-policy-dummy-form")
export class DummyPolicyForm extends BasePolicyForm<DummyPolicy> {
    loadInstance(pk: string): Promise<DummyPolicy> {
        return new PoliciesApi(DEFAULT_CONFIG).policiesDummyRetrieve({
            policyUuid: pk,
        });
    }

    async send(data: DummyPolicy): Promise<DummyPolicy> {
        if (this.instance) {
            return new PoliciesApi(DEFAULT_CONFIG).policiesDummyUpdate({
                policyUuid: this.instance.pk || "",
                dummyPolicyRequest: data,
            });
        }
        return new PoliciesApi(DEFAULT_CONFIG).policiesDummyCreate({
            dummyPolicyRequest: data,
        });
    }

    renderForm(): TemplateResult {
        return html` <span>
                ${msg(
                    "A policy used for testing. Always returns the same result as specified below after waiting a random duration.",
                )}
            </span>
            <ak-form-element-horizontal label=${msg("Name")} required name="name">
                <input
                    type="text"
                    value="${ifDefined(this.instance?.name || "")}"
                    class="pf-c-form-control"
                    required
                />
            </ak-form-element-horizontal>
            <ak-form-element-horizontal name="executionLogging">
                <label class="pf-c-switch">
                    <input
                        class="pf-c-switch__input"
                        type="checkbox"
                        ?checked=${this.instance?.executionLogging ?? false}
                    />
                    <span class="pf-c-switch__toggle">
                        <span class="pf-c-switch__toggle-icon">
                            <i class="fas fa-check" aria-hidden="true"></i>
                        </span>
                    </span>
                    <span class="pf-c-switch__label">${msg("Execution logging")}</span>
                </label>
                <p class="pf-c-form__helper-text">
                    ${msg(
                        "When this option is enabled, all executions of this policy will be logged. By default, only execution errors are logged.",
                    )}
                </p>
            </ak-form-element-horizontal>
            <ak-form-group open label="${msg("Policy-specific settings")}">
                <div class="pf-c-form">
                    <ak-form-element-horizontal name="result">
                        <label class="pf-c-switch">
                            <input
                                class="pf-c-switch__input"
                                type="checkbox"
                                ?checked=${this.instance?.result ?? false}
                            />
                            <span class="pf-c-switch__toggle">
                                <span class="pf-c-switch__toggle-icon">
                                    <i class="fas fa-check" aria-hidden="true"></i>
                                </span>
                            </span>
                            <span class="pf-c-switch__label">${msg("Pass policy?")}</span>
                        </label>
                    </ak-form-element-horizontal>
                    <ak-form-element-horizontal label=${msg("Wait (min)")} required name="waitMin">
                        <input
                            type="number"
                            value="${this.instance?.waitMin ?? 1}"
                            class="pf-c-form-control"
                            required
                        />
                        <p class="pf-c-form__helper-text">
                            ${msg(
                                "The policy takes a random time to execute. This controls the minimum time it will take.",
                            )}
                        </p>
                    </ak-form-element-horizontal>
                    <ak-form-element-horizontal label=${msg("Wait (max)")} required name="waitMax">
                        <input
                            type="number"
                            value="${this.instance?.waitMax ?? 5}"
                            class="pf-c-form-control"
                            required
                        />
                    </ak-form-element-horizontal>
                </div>
            </ak-form-group>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-policy-dummy-form": DummyPolicyForm;
    }
}
