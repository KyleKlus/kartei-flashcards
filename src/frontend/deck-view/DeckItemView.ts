import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import Kartei from "main";
import DeckView from "./DeckView";

export const DECK_ITEM_VIEW = "deck-item-view";

export class DeckItemView extends ItemView {
    root: Root | null = null;
    plugin: Kartei;

    constructor(leaf: WorkspaceLeaf, plugin: Kartei) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return DECK_ITEM_VIEW;
    }

    getIcon() {
        return "wallet-cards";
    }

    getDisplayText() {
        return "Kartei - Decks";
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);

        this.root.render(DeckView());
    }

    async onClose() {
        this.root?.unmount();
    }
}