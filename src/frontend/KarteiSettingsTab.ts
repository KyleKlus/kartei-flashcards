import Kartei from "main";
import { PluginSettingTab, App } from "obsidian";


export interface KarteiSettings {
    useTagsForDecks: boolean;
    deckTags: string[];
    deckFolders: string[];
}

export const KARTEI_SETTINGS: KarteiSettings = {
    useTagsForDecks: true,
    deckTags: ['#kartei-deck'],
    deckFolders: []
}

export class KarteiSettingTab extends PluginSettingTab {
    plugin: Kartei;

    constructor(app: App, plugin: Kartei) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        // TODO: add settings

        // new Setting(containerEl)
        // 	.setName('Setting #1')
        // 	.setDesc('It\'s a secret')
        // 	.addText(text => text
        // 		.setPlaceholder('Enter your secret')
        // 		.setValue(this.plugin.settings.mySetting)
        // 		.onChange(async (value) => {
        // 			this.plugin.settings.mySetting = value;
        // 			await this.plugin.saveSettings();
        // 		}));
    }
}