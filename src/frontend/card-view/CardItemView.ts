import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import Kartei from "main";
import CardView from "./CardView";

export const CARD_ITEM_VIEW = "card-item-view";

export class CardItemView extends ItemView {
    root: Root | null = null;
    plugin: Kartei;

    constructor(leaf: WorkspaceLeaf, plugin: Kartei) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return CARD_ITEM_VIEW;
    }

    getIcon() {
        return "wallet-cards";
    }

    getDisplayText() {
        return "Kartei - Cards";
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);

        this.root.render(CardView());
    }

    async onClose() {
        this.root?.unmount();
    }
}