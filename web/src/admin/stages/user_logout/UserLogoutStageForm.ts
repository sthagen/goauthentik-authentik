import { BaseStageForm } from "@goauthentik/admin/stages/BaseStageForm";
import { DEFAULT_CONFIG } from "@goauthentik/common/api/config";
import "@goauthentik/elements/forms/HorizontalFormElement";

import { msg } from "@lit/localize";
import { TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { StagesApi, UserLogoutStage } from "@goauthentik/api";

@customElement("ak-stage-user-logout-form")
export class UserLogoutStageForm extends BaseStageForm<UserLogoutStage> {
    loadInstance(pk: string): Promise<UserLogoutStage> {
        return new StagesApi(DEFAULT_CONFIG).stagesUserLogoutRetrieve({
            stageUuid: pk,
        });
    }

    async send(data: UserLogoutStage): Promise<UserLogoutStage> {
        if (this.instance) {
            return new StagesApi(DEFAULT_CONFIG).stagesUserLogoutUpdate({
                stageUuid: this.instance.pk || "",
                userLogoutStageRequest: data,
            });
        }
        return new StagesApi(DEFAULT_CONFIG).stagesUserLogoutCreate({
            userLogoutStageRequest: data,
        });
    }

    renderForm(): TemplateResult {
        return html` <span>${msg("Remove the user from the current session.")}</span>
            <ak-form-element-horizontal label=${msg("Name")} required name="name">
                <input
                    type="text"
                    value="${ifDefined(this.instance?.name || "")}"
                    class="pf-c-form-control"
                    required
                />
            </ak-form-element-horizontal>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-stage-user-logout-form": UserLogoutStageForm;
    }
}
