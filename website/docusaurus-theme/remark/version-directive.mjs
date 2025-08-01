/**
 * @file Remark plugin to transform `ak-version` directives into version badges.
 *
 * @import { Root } from "mdast";
 * @import {} from "mdast-util-directive";
 */

import { h } from "hastscript";
import { coerce } from "semver";
import { SKIP, visit } from "unist-util-visit";

/**
 * MDAST plugin to transform `ak-version` directives into version badges.
 *
 * Given a heading like:
 *
 * ```md
 * # Feature Foobar :ak-version[v1.2.3]
 * ```
 *
 * Rewrites the heading to:
 *
 * ```md
 * # Feature Foobar <span class="badge badge--version">authentik: v1.2.3+</span>
 * ```
 */
export function remarkVersionDirective() {
    /**
     * @param {Root} tree The MDAST tree to transform.
     */
    return (tree) => {
        visit(tree, "textDirective", (node) => {
            if (node.name !== "ak-version") return SKIP;

            const firstChild = node.children[0];

            if (firstChild?.type !== "text") return SKIP;

            const semver = firstChild.value.trim();
            const parsed = coerce(semver);

            if (!parsed) {
                throw new Error(`Invalid semver version: ${semver}`);
            }

            const yearCutoff = new Date().getFullYear() - 2;

            if (parsed.major <= yearCutoff) {
                throw new Error(`Semver version <= ${yearCutoff} is not supported: ${semver}`);
            }

            const data = node.data || (node.data = {});

            const hast = h("span", {
                ...node.attributes,
                "className": "badge badge--version",
                "title": `Available in authentik ${parsed.format()} and later`,
                "aria-description": "Version badge",
                "role": "img",
            });

            data.hName = hast.tagName;
            data.hProperties = hast.properties;

            data.hChildren = [
                {
                    type: "text",
                    value: `authentik:\u00A0${parsed.format()}+`,
                },
            ];

            node.children = [];

            return SKIP;
        });
    };
}

export default remarkVersionDirective;
