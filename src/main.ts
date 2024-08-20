import { Deck } from 'backend/Deck';
import { DeckTreeConstructor } from 'backend/DeckTreeConstructor';
import { CARD_ITEM_VIEW, CardItemView } from 'frontend/card-view/CardItemView';
import { DECK_ITEM_VIEW, DeckItemView } from 'frontend/deck-view/DeckItemView';
import { KARTEI_SETTINGS, KarteiSettings, KarteiSettingTab } from 'frontend/KarteiSettingsTab';
import { getAllTags, PaneType, Plugin, ViewCreator, WorkspaceLeaf } from 'obsidian';

type ViewType = { type: string, viewCreator: ViewCreator }

export default class Kartei extends Plugin {
	settings: KarteiSettings;
	syncLock: boolean = false;
	rootDecks: Map<string, Deck> = new Map();
	viewTypes: ViewType[] = [
		{ type: DECK_ITEM_VIEW, viewCreator: (leaf) => new DeckItemView(leaf, this) },
		{ type: CARD_ITEM_VIEW, viewCreator: (leaf) => new CardItemView(leaf, this) }
	];

	async onload() {
		await this.loadSettings();

		this.registerViews();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('wallet-cards', 'Kartei Flashcards', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.openDeckView();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-deck-view',
			name: 'Kartei: Choose a deck to learn from',
			callback: () => {
				this.openDeckView();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new KarteiSettingTab(this.app, this));

		// Sync notes with cards
		this.app.workspace.onLayoutReady(async () => {
			setTimeout(async () => {
				if (!this.syncLock) {
					await this.syncVaultNotesWithCards();
				}
			}, 2000);
		});
	}

	onunload() {
		this.detachAllLeaves();
	}

	async loadSettings() {
		this.settings = Object.assign({}, KARTEI_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	forEachViewType(callback: (type: ViewType) => void) {
		this.viewTypes.forEach(type => callback(type));
	}

	registerViews() {
		this.forEachViewType((viewType) => this.registerView(viewType.type, viewType.viewCreator));
	}

	detachAllLeaves() {
		this.forEachViewType((viewType) => { this.app.workspace.getLeavesOfType(viewType.type).forEach((leaf) => leaf.detach()); });
	}

	async openView(type: string, newLeaf?: PaneType | boolean) {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(type);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf as a tab
			leaf = workspace.getLeaf(newLeaf);
			if (leaf !== null) {
				await leaf.setViewState({ type: type, active: true });
			}
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf !== null) {
			workspace.revealLeaf(leaf);
		}
	}

	async openDeckView() {
		await this.openView(DECK_ITEM_VIEW, true);
	}

	async openCardView() {
		await this.openView(CARD_ITEM_VIEW, 'tab');
	}

	async initDeckTree() {
		if (this.settings.useTagsForDecks) {
			this.rootDecks = DeckTreeConstructor.constructTreeFromTags(this.app, this.settings.deckTags);
		} else {
			this.rootDecks = DeckTreeConstructor.constructTreeFromFolders(this.app, this.settings.deckFolders);
		}
	}

	async syncVaultNotesWithCards() {
		if (this.syncLock) {
			return;
		}
		this.syncLock = true;

		this.initDeckTree();

		this.syncLock = false;
	}
}
