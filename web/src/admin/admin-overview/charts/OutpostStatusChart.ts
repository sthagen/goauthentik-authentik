import "#elements/forms/ConfirmationForm";

import { DEFAULT_CONFIG } from "#common/api/config";

import { AKChart } from "#elements/charts/Chart";
import { actionToColor } from "#elements/charts/EventChart";

import { SummarizedSyncStatus } from "#admin/admin-overview/charts/SyncStatusChart";

import { EventActions, OutpostsApi } from "@goauthentik/api";

import { ChartData, ChartOptions } from "chart.js";

import { msg } from "@lit/localize";
import { customElement } from "lit/decorators.js";

@customElement("ak-admin-status-chart-outpost")
export class OutpostStatusChart extends AKChart<SummarizedSyncStatus[]> {
    getChartType(): string {
        return "doughnut";
    }

    getOptions(): ChartOptions {
        return {
            plugins: {
                legend: {
                    display: false,
                },
            },
            maintainAspectRatio: false,
        };
    }

    async apiRequest(): Promise<SummarizedSyncStatus[]> {
        const api = new OutpostsApi(DEFAULT_CONFIG);
        const outposts = await api.outpostsInstancesList({});
        const outpostStats: SummarizedSyncStatus[] = [];
        await Promise.all(
            outposts.results.map(async (element) => {
                const health = await api.outpostsInstancesHealthList({
                    uuid: element.pk || "",
                });
                const singleStats: SummarizedSyncStatus = {
                    unsynced: 0,
                    healthy: 0,
                    failed: 0,
                    total: health.length,
                    label: element.name,
                };
                if (health.length === 0) {
                    singleStats.unsynced += 1;
                }
                health.forEach((h) => {
                    if (h.versionOutdated) {
                        singleStats.failed += 1;
                    } else {
                        singleStats.healthy += 1;
                    }
                });
                outpostStats.push(singleStats);
            }),
        );
        this.centerText = outposts.pagination.count.toString();
        outpostStats.sort((a, b) => a.label.localeCompare(b.label));
        return outpostStats;
    }

    getChartData(data: SummarizedSyncStatus[]): ChartData {
        return {
            labels: [msg("Healthy outposts"), msg("Outdated outposts"), msg("Unhealthy outposts")],
            datasets: data.map((d) => {
                return {
                    backgroundColor: [
                        actionToColor(EventActions.Login),
                        actionToColor(EventActions.SuspiciousRequest),
                        actionToColor(EventActions.AuthorizeApplication),
                    ],
                    spanGaps: true,
                    data: [d.healthy, d.failed, d.unsynced],
                    label: d.label,
                };
            }),
        };
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-admin-status-chart-outpost": OutpostStatusChart;
    }
}
