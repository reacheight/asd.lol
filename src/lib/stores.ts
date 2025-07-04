import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { defaultUpgrades, emojiPacks, type Upgrade } from './upgrades.js';

export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export type { Upgrade };

// Local storage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch {
		return defaultValue;
	}
}

function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error('Failed to save to localStorage:', e);
	}
}



// Initialize data
const initialNotes: Note[] = loadFromStorage('notes', []);
const initialChars: number = loadFromStorage('chars', 0);

// Load upgrades from storage, but merge with defaults to ensure all upgrades exist
function loadUpgrades(): Upgrade[] {
	const stored = loadFromStorage('upgrades', []);
	
	// If no stored upgrades, use defaults
	if (!stored || stored.length === 0) {
		return [...defaultUpgrades];
	}
	
	// Merge stored upgrades with defaults to ensure all upgrades exist
	const mergedUpgrades = [...defaultUpgrades];
	
	// Update purchased status from stored data
	stored.forEach((storedUpgrade: Upgrade) => {
		const index = mergedUpgrades.findIndex(upgrade => upgrade.id === storedUpgrade.id);
		if (index !== -1) {
			mergedUpgrades[index].purchased = storedUpgrade.purchased;
		}
	});
	
	return mergedUpgrades;
}

const initialUpgrades: Upgrade[] = loadUpgrades();

// Create stores
export const notes = writable<Note[]>(initialNotes);
export const chars = writable<number>(initialChars);
export const upgrades = writable<Upgrade[]>(initialUpgrades);
export const activeNoteId = writable<string | null>(null);
export const currentTheme = writable<string>(loadFromStorage('currentTheme', 'default'));
export const currentFont = writable<string>(loadFromStorage('currentFont', 'sans-serif'));
export const currentSound = writable<string>(loadFromStorage('currentSound', 'none'));

// Subscribe to changes and save to localStorage
notes.subscribe(value => saveToStorage('notes', value));
chars.subscribe(value => saveToStorage('chars', value));
upgrades.subscribe(value => saveToStorage('upgrades', value));
currentTheme.subscribe(value => saveToStorage('currentTheme', value));
currentFont.subscribe(value => saveToStorage('currentFont', value));
currentSound.subscribe(value => saveToStorage('currentSound', value));

// Helper functions
export function createNote(): Note {
	return {
		id: crypto.randomUUID(),
		title: 'New Note',
		content: '',
		createdAt: new Date(),
		updatedAt: new Date()
	};
}

export function addChars(amount: number): void {
	chars.update(current => current + amount);
}

export function purchaseUpgrade(upgradeId: string): boolean {
	let canPurchase = false;
	
	upgrades.update(allUpgrades => {
		const upgrade = allUpgrades.find(u => u.id === upgradeId);
		if (!upgrade || upgrade.purchased) return allUpgrades;
		
		chars.update(currentChars => {
			if (currentChars >= upgrade.cost) {
				canPurchase = true;
				return currentChars - upgrade.cost;
			}
			return currentChars;
		});
		
		if (canPurchase) {
			upgrade.purchased = true;
		}
		
		return allUpgrades;
	});
	
	return canPurchase;
}

// Helper functions to get available options
export function getAvailableFonts(upgradesArray: Upgrade[]): Array<{id: string, name: string, value: string}> {
	const fonts = [
		{ id: 'default', name: 'Default', value: 'sans-serif' }
	];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'font' && upgrade.purchased)
		.forEach(upgrade => {
			fonts.push({
				id: upgrade.id,
				name: upgrade.name,
				value: upgrade.value
			});
		});
	
	return fonts;
}

export function getAvailableThemes(upgradesArray: Upgrade[]): Array<{id: string, name: string, value: string}> {
	const themes = [
		{ id: 'default', name: 'Default', value: 'default' }
	];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'theme' && upgrade.purchased)
		.forEach(upgrade => {
			themes.push({
				id: upgrade.id,
				name: upgrade.name,
				value: upgrade.value
			});
		});
	
	return themes;
}

export function getAvailableSounds(upgradesArray: Upgrade[]): Array<{id: string, name: string, value: string}> {
	const sounds = [
		{ id: 'none', name: 'No Sound', value: 'none' }
	];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'sound' && upgrade.purchased)
		.forEach(upgrade => {
			sounds.push({
				id: upgrade.id,
				name: upgrade.name,
				value: upgrade.value
			});
		});
	
	return sounds;
}

export function getAvailableEmojis(upgradesArray: Upgrade[]): Array<{emoji: string, title: string, pack: string}> {
	const emojis: Array<{emoji: string, title: string, pack: string}> = [];
	
	upgradesArray
		.filter(upgrade => upgrade.type === 'emoji' && upgrade.purchased)
		.forEach(upgrade => {
			const packEmojis = emojiPacks[upgrade.value as keyof typeof emojiPacks];
			if (packEmojis) {
				packEmojis.forEach(emojiData => {
					emojis.push({
						...emojiData,
						pack: upgrade.name
					});
				});
			}
		});
	
	return emojis;
}

export function hasCopyFeature(upgradesArray: Upgrade[]): boolean {
	return upgradesArray.some(upgrade => upgrade.id === 'utility-copy' && upgrade.purchased);
} 