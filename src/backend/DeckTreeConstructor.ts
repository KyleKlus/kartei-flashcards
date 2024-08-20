import { App, getAllTags } from "obsidian";
import { Deck } from "./Deck";

export class DeckTreeConstructor {
    public static constructTreeFromTags(app: App, rootTags: string[]): Map<string, Deck> {
        const rootDecks: Map<string, Deck> = this.initRootDecks(rootTags);

        const allNotes = app.vault.getMarkdownFiles();

        for (const note of allNotes) {
            const noteCache = app.metadataCache.getFileCache(note);
            if (noteCache === null) { continue; }

            const noteTags = getAllTags(noteCache);
            if (noteTags === null || noteTags.length === 0) { continue; }

            const deckTags = this.getDeckTags(noteTags, rootTags);
            if (deckTags.length === 0) { continue; }

            // TODO: parse note content to get cards
            // TODO: sort cards into decks
        };

        return rootDecks;
    }
    public static constructTreeFromFolders(app: App, rootPaths: string[]): Map<string, Deck> {
        const rootDecks: Map<string, Deck> = this.initRootDecks(rootPaths);

        return rootDecks;
    }

    private static getDeckTags(noteTags: string[], rootTags: string[]): string[] {
        return noteTags.filter(tag => rootTags.includes(tag));
    }

    private static initRootDecks(rootNames: string[]): Map<string, Deck> {
        const rootDecks: Map<string, Deck> = new Map();
        rootNames.forEach(name => rootDecks.set(name, new Deck(name, name)));
        return rootDecks;
    }
}