import "#elements/buttons/SpinnerButton/index";

import { EVENT_REFRESH } from "#common/constants";
import { parseAPIResponseError, pluckErrorDetail } from "#common/errors/network";
import { MessageLevel } from "#common/messages";

import { ModalButton } from "#elements/buttons/ModalButton";
import { showMessage } from "#elements/messages/MessageContainer";

import { msg, str } from "@lit/localize";
import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ak-forms-confirm")
export class ConfirmationForm extends ModalButton {
    @property()
    successMessage!: string;
    @property()
    errorMessage!: string;

    @property()
    action!: string;

    @property({ attribute: false })
    onConfirm!: () => Promise<unknown>;

    confirm(): Promise<void> {
        return this.onConfirm()
            .then(() => {
                this.onSuccess();
                this.open = false;
                this.dispatchEvent(
                    new CustomEvent(EVENT_REFRESH, {
                        bubbles: true,
                        composed: true,
                    }),
                );
            })
            .catch(async (error: unknown) => {
                await this.onError(error);
                throw error;
            });
    }

    onSuccess(): void {
        showMessage({
            message: this.successMessage,
            level: MessageLevel.success,
        });
    }

    onError(error: unknown): Promise<void> {
        return parseAPIResponseError(error).then((parsedError) => {
            showMessage({
                message: msg(str`${this.errorMessage}: ${pluckErrorDetail(parsedError)}`),
                level: MessageLevel.error,
            });
        });
    }

    renderModalInner(): TemplateResult {
        return html`<section class="pf-c-modal-box__header pf-c-page__main-section pf-m-light">
                <div class="pf-c-content">
                    <h1 class="pf-c-title pf-m-2xl">
                        <slot name="header"></slot>
                    </h1>
                </div>
            </section>
            <section class="pf-c-modal-box__body pf-m-light">
                <form class="pf-c-form pf-m-horizontal">
                    <slot class="pf-c-content" name="body"></slot>
                </form>
            </section>
            <footer class="pf-c-modal-box__footer">
                <ak-spinner-button
                    .callAction=${() => {
                        return this.confirm();
                    }}
                    class="pf-m-danger"
                >
                    ${this.action} </ak-spinner-button
                >&nbsp;
                <ak-spinner-button
                    .callAction=${async () => {
                        this.open = false;
                    }}
                    class="pf-m-secondary"
                >
                    ${msg("Cancel")}
                </ak-spinner-button>
            </footer>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-forms-confirm": ConfirmationForm;
    }
}
