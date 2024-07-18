import { slug } from "github-slugger";

import type { TemplateResult } from "lit";

// The descriptions were generated by ChatGPT. Don't blame us.

export type ViewSample = {
    produce: string;
    seasons: string[];
    desc?: string;
};

export const sampleData: ViewSample[] = [
    {
        produce: "Apples",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Apples are a sweet and crunchy fruit that can be eaten fresh or used in pies, juice, and ciders.",
    },
    {
        produce: "Apricots",
        seasons: ["Spring", "Summer"],
        desc: "Apricots are a sweet and tangy stone fruit with a velvety skin that's often orange-yellow in color",
    },
    {
        produce: "Asparagus",
        seasons: ["Spring"],
        desc: "Asparagus is a delicate and nutritious vegetable with a tender spear-like shape",
    },
    {
        produce: "Avocados",
        seasons: ["Spring", "Summer", "Winter"],
        desc: "Avocados are a nutritious fruit with a creamy texture and nutty flavor",
    },
    {
        produce: "Bananas",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Bananas are a type of curved, yellow fruit that grows on banana plants",
    },
    {
        produce: "Beets",
        seasons: ["Summer", "Fall", "Winter"],
        desc: "Beets are a sweet and earthy root vegetable that can be pickled, roasted, or boiled",
    },
    {
        produce: "Bell Peppers",
        seasons: ["Summer", "Fall"],
        desc: "Bell peppers are a sweet and crunchy type of pepper that can be green, red, yellow, or orange",
    },
    {
        produce: "Blackberries",
        seasons: ["Summer"],
        desc: "Blackberries are a type of fruit that are dark purple in color and have a sweet-tart taste",
    },
    {
        produce: "Blueberries",
        seasons: ["Summer"],
        desc: "Blueberries are small, round, and sweet-tart berries with a powdery coating and a burst of juicy flavor.",
    },
    {
        produce: "Broccoli",
        seasons: ["Spring", "Fall"],
        desc: "Broccoli is a green, cruciferous vegetable with a tree-like shape and a slightly bitter taste.",
    },
    {
        produce: "Brussels Sprouts",
        seasons: ["Fall", "Winter"],
        desc: "Brussels sprouts are a cruciferous vegetable that is small, green, and formed like a tiny cabbage head, with a sweet and slightly bitter flavor.",
    },
    {
        produce: "Cabbage",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Cabbage is a crunchy, sweet, and slightly bitter vegetable with a dense head of tightly packed leaves.",
    },
    {
        produce: "Cantaloupe",
        seasons: ["Summer"],
        desc: "Cantaloupe is a sweet and juicy melon with a netted or reticulated rind and yellow-orange flesh.",
    },
    {
        produce: "Carrots",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Carrots are a crunchy and sweet root vegetable commonly eaten raw or cooked in various dishes.",
    },
    {
        produce: "Cauliflower",
        seasons: ["Fall"],
        desc: "Cauliflower is a cruciferous vegetable with a white or pale yellow florets resembling tiny trees",
    },
    {
        produce: "Celery",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Celery is a crunchy, sweet-tasting vegetable with a mild flavor, often used in salads and as a snack.",
    },
    {
        produce: "Cherries",
        seasons: ["Summer"],
        desc: "Cherries are a sweet and juicy stone fruit that typically range in color from bright red to dark purple.",
    },
    {
        produce: "Collard Greens",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Collard greens are a type of leafy green vegetable with a slightly bitter and earthy flavor.",
    },
    {
        produce: "Corn",
        seasons: ["Summer"],
        desc: "Corn is a sweet and savory grain that can be eaten fresh or used in various dishes, such as soups, salads, and baked goods.",
    },
    {
        produce: "Cranberries",
        seasons: ["Fall"],
        desc: "Cranberries are a type of small, tart-tasting fruit native to North America",
    },
    {
        produce: "Cucumbers",
        seasons: ["Summer"],
        desc: "Cucumbers are a long, green vegetable that is commonly consumed raw or pickled",
    },
    {
        produce: "Eggplant",
        seasons: ["Summer"],
        desc: "Eggplant is a purple vegetable with a spongy texture and a slightly bitter taste.",
    },
    {
        produce: "Garlic",
        seasons: ["Spring", "Summer", "Fall"],
        desc: "Garlic is a pungent and flavorful herb with a distinctive aroma and taste",
    },
    {
        produce: "Ginger",
        seasons: ["Fall"],
        desc: "Ginger is a spicy, sweet, and tangy root commonly used in Asian cuisine to add warmth and depth",
    },
    {
        produce: "Grapefruit",
        seasons: ["Winter"],
        desc: "Grapefruit is a tangy and sweet citrus fruit with a tart flavor profile and a slightly bitter aftertaste.",
    },
    {
        produce: "Grapes",
        seasons: ["Fall"],
        desc: "Grapes are a type of fruit that grow in clusters on vines and are often eaten fresh or used to make wine, jam, and juice.",
    },
    {
        produce: "Green Beans",
        seasons: ["Summer", "Fall"],
        desc: "Green beans are a type of long, thin, green vegetable that is commonly eaten as a side dish or used in various recipes.",
    },
    {
        produce: "Herbs",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Herbs are plant parts, such as leaves, stems, or flowers, used to add flavor or aroma",
    },
    {
        produce: "Honeydew Melon",
        seasons: ["Summer"],
        desc: "Honeydew melons are sweet and refreshing, with a smooth, pale green rind and juicy, creamy white flesh.",
    },
    {
        produce: "Kale",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Kale is a type of leafy green vegetable that is packed with nutrients and has a slightly bitter, earthy flavor.",
    },
    {
        produce: "Kiwifruit",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Kiwifruit is a small, oval-shaped fruit with a fuzzy exterior and bright green or yellow flesh that tastes sweet and slightly tart.",
    },
    {
        produce: "Leeks",
        seasons: ["Winter"],
        desc: "Leeks are a type of vegetable that is similar to onions and garlic, but has a milder flavor and a more delicate texture.",
    },
    {
        produce: "Lemons",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Lemons are a sour and tangy citrus fruit with a bright yellow color and a strong, distinctive flavor used in cooking, cleaning, and as a natural remedy.",
    },
    {
        produce: "Lettuce",
        seasons: ["Spring", "Fall"],
        desc: "Lettuce is a crisp and refreshing green leafy vegetable often used in salads.",
    },
    {
        produce: "Lima Beans",
        seasons: ["Summer"],
        desc: "Lima beans are a type of green legume with a mild flavor and soft, creamy texture.",
    },
    {
        produce: "Limes",
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        desc: "Limes are small, citrus fruits with a sour taste and a bright green color.",
    },
    {
        produce: "Mangos",
        seasons: ["Summer", "Fall"],
        desc: "Mangos are sweet and creamy tropical fruits with a velvety texture",
    },
    {
        produce: "Mushrooms",
        seasons: ["Spring", "Fall"],
        desc: "Mushrooms are a type of fungus that grow underground or on decaying organic matter",
    },
    {
        produce: "Okra",
        seasons: ["Summer"],
        desc: "Okra is a nutritious, green vegetable with a unique texture and flavor",
    },
    {
        produce: "Onions",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Onions are a type of vegetable characterized by their layered, bulbous structure and pungent flavor.",
    },
    {
        produce: "Oranges",
        seasons: ["Winter"],
        desc: "Oranges are a sweet and juicy citrus fruit with a thick, easy-to-peel skin.",
    },
    {
        produce: "Parsnips",
        seasons: ["Fall", "Winter"],
        desc: "Parsnips are a type of root vegetable that is sweet and nutty in flavor, with a texture similar to carrots.",
    },
    {
        produce: "Peaches",
        seasons: ["Summer"],
        desc: "Peaches are sweet and juicy stone fruits with a soft, velvety texture.",
    },
    {
        produce: "Pears",
        seasons: ["Fall", "Winter"],
        desc: "Pears are a type of sweet and juicy fruit with a smooth, buttery texture and a mild flavor",
    },
    {
        produce: "Peas",
        seasons: ["Spring", "Fall"],
        desc: "Peas are small, round, sweet-tasting legumes that grow on vines and are often eaten as a side dish or added to various recipes.",
    },
    {
        produce: "Pineapples",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Pineapples are a tropical fruit with tough, prickly skin and juicy, sweet flesh.",
    },
    {
        produce: "Plums",
        seasons: ["Summer"],
        desc: "Plums are a type of stone fruit characterized by their juicy sweetness and rough, dark skin.",
    },
    {
        produce: "Potatoes",
        seasons: ["Fall", "Winter"],
        desc: "Potatoes are a starchy root vegetable that is often brown on the outside and white or yellow on the inside.",
    },
    {
        produce: "Pumpkin",
        seasons: ["Fall", "Winter"],
        desc: "Pumpkin is a type of squash that is typically orange in color and is often used to make pies, soups, and other sweet or savory dishes.",
    },
    {
        produce: "Radishes",
        seasons: ["Spring", "Fall"],
        desc: "Radishes are a pungent, crunchy and spicy root vegetable that can be eaten raw or cooked,",
    },
    {
        produce: "Raspberries",
        seasons: ["Summer", "Fall"],
        desc: "Raspberries are a type of sweet-tart fruit that grows on thorny bushes and is often eaten fresh or used in jams, preserves, and desserts.",
    },
    {
        produce: "Rhubarb",
        seasons: ["Spring"],
        desc: "Rhubarb is a perennial vegetable with long, tart stalks that are often used in pies and preserves",
    },
    {
        produce: "Rutabagas",
        seasons: ["Fall", "Winter"],
        desc: "Rutabagas are a type of root vegetable that is similar to a cross between a cabbage and a turnip",
    },
    {
        produce: "Spinach",
        seasons: ["Spring", "Fall"],
        desc: "Spinach is a nutritious leafy green vegetable that is rich in iron and vitamins A, C, and K.",
    },
    {
        produce: "Strawberries",
        seasons: ["Spring", "Summer"],
        desc: "Sweet and juicy, strawberries are a popular type of fruit that grow on low-lying plants with sweet-tasting seeds.",
    },
    {
        produce: "Summer Squash",
        seasons: ["Summer"],
        desc: "Summer squash is a type of warm-season vegetable that includes varieties like zucchini, yellow crookneck, and straightneck",
    },
    {
        produce: "Sweet Potatoes",
        seasons: ["Fall", "Winter"],
        desc: "Sweet potatoes are a type of root vegetable with a sweet and nutty flavor, often orange in color",
    },
    {
        produce: "Swiss Chard",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Swiss Chard is a leafy green vegetable with a slightly bitter taste and a vibrant red or gold stem",
    },
    {
        produce: "Tomatillos",
        seasons: ["Summer"],
        desc: "Tomatillos are a type of fruit that is similar to tomatoes, but with a papery husk and a more tart, slightly sweet flavor.",
    },
    {
        produce: "Tomatoes",
        seasons: ["Summer"],
        desc: "Tomatoes are a juicy, sweet, and tangy fruit that is commonly used in salads, sandwiches, and as a topping for various dishes.",
    },
    {
        produce: "Turnips",
        seasons: ["Spring", "Fall", "Winter"],
        desc: "Turnips are a root vegetable with a sweet and peppery flavor, often used in soups, stews, and salads.",
    },
    {
        produce: "Watermelon",
        seasons: ["Summer"],
        desc: "Watermelon is a juicy and refreshing sweet fruit with a green rind and pink or yellow flesh.",
    },
    {
        produce: "Winter Squash",
        seasons: ["Fall", "Winter"],
        desc: "Winter squash is a type of starchy vegetable that is harvested in the fall and has a hard, dry rind that can be stored for several months.",
    },
    {
        produce: "Zucchini",
        seasons: ["Summer"],
        desc: "Zucchini is a popular summer squash that is often green or yellow in color and has a mild, slightly sweet flavor.",
    },
];

type Seasoned = [string, string, string | TemplateResult];

const reseason = (acc: Seasoned[], { produce, seasons, desc }: ViewSample): Seasoned[] => [
    ...acc,
    ...seasons.map((s) => [s, produce, desc] as Seasoned),
];

export const groupedSampleData = (() => {
    const seasoned: Seasoned[] = sampleData.reduce(reseason, [] as Seasoned[]);
    const grouped = Object.groupBy(seasoned, ([season]) => season);
    const ungrouped = ([_season, label, desc]: Seasoned) => [slug(label), label, desc];

    if (grouped === undefined) {
        throw new Error("Not possible with existing data.");
    }

    return {
        grouped: true,
        options: ["Spring", "Summer", "Fall", "Winter"].map((season) => ({
            name: season,
            options: grouped[season]?.map(ungrouped) ?? [],
        })),
    };
})();