import { App, getAllTags } from "obsidian";
import { Card } from "./Card";

export class Deck {
    path: string;
    name: string;
    cards: Card[];
    subDecks: Deck[];

    constructor(name: string, path: string, cards?: Card[], subDecks?: Deck[]) {
        this.name = name;
        this.path = path;
        this.cards = cards || [];
        this.subDecks = subDecks || [];
    }
}