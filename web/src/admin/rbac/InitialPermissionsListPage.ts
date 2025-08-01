import "#admin/rbac/InitialPermissionsForm";
import "#elements/buttons/SpinnerButton/ak-spinner-button";
import "#elements/forms/DeleteBulkForm";
import "#elements/forms/ModalForm";
import "@patternfly/elements/pf-tooltip/pf-tooltip.js";

import { DEFAULT_CONFIG } from "#common/api/config";

import { PaginatedResponse, TableColumn } from "#elements/table/Table";
import { TablePage } from "#elements/table/TablePage";

import { InitialPermissions, RbacApi } from "@goauthentik/api";

import { msg } from "@lit/localize";
import { html, HTMLTemplateResult, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("ak-initial-permissions-list")
export class InitialPermissionsListPage extends TablePage<InitialPermissions> {
    checkbox = true;
    clearOnRefresh = true;
    searchEnabled(): boolean {
        return true;
    }
    pageTitle(): string {
        return msg("Initial Permissions");
    }
    pageDescription(): string {
        return msg("Set initial permissions for newly created objects.");
    }
    pageIcon(): string {
        return "fa fa-lock";
    }

    @property()
    order = "name";

    async apiEndpoint(): Promise<PaginatedResponse<InitialPermissions>> {
        return new RbacApi(DEFAULT_CONFIG).rbacInitialPermissionsList(
            await this.defaultEndpointConfig(),
        );
    }

    columns(): TableColumn[] {
        return [new TableColumn(msg("Name"), "name"), new TableColumn(msg("Actions"))];
    }

    renderToolbarSelected(): TemplateResult {
        const disabled = this.selectedElements.length < 1;
        return html`<ak-forms-delete-bulk
            objectLabel=${msg("Initial Permissions")}
            .objects=${this.selectedElements}
            .usedBy=${(item: InitialPermissions) => {
                return new RbacApi(DEFAULT_CONFIG).rbacInitialPermissionsUsedByList({
                    id: item.pk,
                });
            }}
            .delete=${(item: InitialPermissions) => {
                return new RbacApi(DEFAULT_CONFIG).rbacInitialPermissionsDestroy({
                    id: item.pk,
                });
            }}
        >
            <button ?disabled=${disabled} slot="trigger" class="pf-c-button pf-m-danger">
                ${msg("Delete")}
            </button>
        </ak-forms-delete-bulk>`;
    }

    render(): HTMLTemplateResult {
        return html`<ak-page-header
                icon=${this.pageIcon()}
                header=${this.pageTitle()}
                description=${ifDefined(this.pageDescription())}
            >
            </ak-page-header>
            <section class="pf-c-page__main-section pf-m-no-padding-mobile">
                <div class="pf-c-card">${this.renderTable()}</div>
            </section>`;
    }

    row(item: InitialPermissions): TemplateResult[] {
        return [
            html`${item.name}`,
            html`<ak-forms-modal>
                <span slot="submit"> ${msg("Update")} </span>
                <span slot="header"> ${msg("Update Initial Permissions")} </span>
                <ak-initial-permissions-form slot="form" .instancePk=${item.pk}>
                </ak-initial-permissions-form>
                <button slot="trigger" class="pf-c-button pf-m-plain">
                    <pf-tooltip position="top" content=${msg("Edit")}>
                        <i class="fas fa-edit"></i>
                    </pf-tooltip>
                </button>
            </ak-forms-modal>`,
        ];
    }

    renderObjectCreate(): TemplateResult {
        return html`
            <ak-forms-modal>
                <span slot="submit"> ${msg("Create")} </span>
                <span slot="header"> ${msg("Create Initial Permissions")} </span>
                <ak-initial-permissions-form slot="form"> </ak-initial-permissions-form>
                <button slot="trigger" class="pf-c-button pf-m-primary">${msg("Create")}</button>
            </ak-forms-modal>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "initial-permissions-list": InitialPermissionsListPage;
    }
}
