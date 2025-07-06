<script lang="ts">
	import { notes, chars, addChars, currentFont, currentSound, upgrades, getAvailableEmojis, hasCopyFeature, hasWordCountFeature, hasUndoFeature, hasPasteFeature, hasMarkdownPreviewFeature, selectedShopCategory } from '../stores.js';
	import type { Note } from '../stores.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Copy, Check, Eye, Edit } from 'lucide-svelte';
	import { toast } from "svelte-sonner";
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	let { note = $bindable() }: { note?: Note | null } = $props();
	let textArea = $state<HTMLTextAreaElement>();
	let lastContentLength = 0;
	let copySuccess = $state(false);
	let showPreview = $state(false);
	let currentPlaceholderIndex = $state(0);

	// Dynamic placeholder variants with funny, engaging messages
	const placeholderVariants = [
		"In case nobody asked: how was your day?",
		"Write about that thing you've been avoiding thinking about...",
		"Today's existential crisis brought to you by: blank page anxiety",
		"This is your safe space to overshare with yourself",
		"Plot twist: you're the main character of your own story",
		"Dear diary, today I discovered I need to buy fonts to feel alive...",
		"Write something your future self will cringe at",
		"Write like nobody's reading (because they're not)",
		"What's on your mind? (Besides the crushing weight of existence)",
		"You've come to the wrong place if you're looking for a real editor",
		"A man can be destroyed but not defeated. So carry on",
	];

	let availableEmojis = $derived(getAvailableEmojis($upgrades));
	let hasAnyEmojiPack = $derived(availableEmojis.length > 0);
	let copyFeatureUnlocked = $derived(hasCopyFeature($upgrades));
	let wordCountFeatureUnlocked = $derived(hasWordCountFeature($upgrades));
	let undoFeatureUnlocked = $derived(hasUndoFeature($upgrades));
	let pasteFeatureUnlocked = $derived(hasPasteFeature($upgrades));
	let markdownPreviewUnlocked = $derived(hasMarkdownPreviewFeature($upgrades));
	let currentPlaceholder = $derived(placeholderVariants[currentPlaceholderIndex]);

	// Configure marked options for better security and styling
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	let renderedMarkdown = $derived(note?.content ? marked(note.content) : '');

	onMount(() => {
		if (note) {
			lastContentLength = note.content.length;
		}
		
		// Rotate placeholder every 5 seconds
		const placeholderInterval = setInterval(() => {
			currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholderVariants.length;
		}, 10000);
		
		return () => {
			clearInterval(placeholderInterval);
		};
	});

	function handleInput(event: Event) {
		if (!note) return;
		
		const target = event.target as HTMLTextAreaElement;
		const newContent = target.value;
		const newLength = newContent.length;
		
		if (newLength > lastContentLength) {
			const newChars = newLength - lastContentLength;
			addChars(newChars);
			
			playTypingSound();
		}
		
		lastContentLength = newLength;
		
		note.content = newContent;
		note.updatedAt = new Date();
		
		notes.update(allNotes => {
			const index = allNotes.findIndex(n => n.id === note.id);
			if (index !== -1) {
				allNotes[index] = { ...note };
			}
			return allNotes;
		});
	}

	function handleTitleChange(event: Event) {
		if (!note) return;
		
		const target = event.target as HTMLInputElement;
		note.title = target.value;
		note.updatedAt = new Date();
		
		notes.update(allNotes => {
			const index = allNotes.findIndex(n => n.id === note.id);
			if (index !== -1) {
				allNotes[index] = { ...note };
			}
			return allNotes;
		});
	}

	function playTypingSound() {
		if ($currentSound === 'typewriter') {
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
			
			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.1);
		}
	}

	function insertEmoji(emoji: string) {
		if (!note || !textArea) return;
		
		const start = textArea.selectionStart;
		const end = textArea.selectionEnd;
		const newContent = note.content.substring(0, start) + emoji + note.content.substring(end);
		
		note.content = newContent;
		note.updatedAt = new Date();
		
		setTimeout(() => {
			if (textArea) {
				textArea.selectionStart = textArea.selectionEnd = start + emoji.length;
				textArea.focus();
			}
		}, 0);
		
		notes.update(allNotes => {
			const index = allNotes.findIndex(n => n.id === note.id);
			if (index !== -1) {
				allNotes[index] = { ...note };
			}
			return allNotes;
		});
	}

	async function copyToClipboard() {
		if (!note) return;
		
		try {
			await navigator.clipboard.writeText(note.content);
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}

	function countWords(text: string): number {
		if (!text.trim()) return 0;
		return text.trim().split(/\s+/).length;
	}

	function handleKeyDown(event: KeyboardEvent) {
		// Block Ctrl+Z (undo) if undo feature is not unlocked
		if (!undoFeatureUnlocked && event.ctrlKey && event.key === 'z') {
			event.preventDefault();
			
			toast.error(`Undo blocked`, {
				description: "Purchase Ctrl+Z rights to fix your life choices",
				action: {
					label: "Buy upgrade",
					onClick: () => {
						selectedShopCategory.set('utility');
					}
				}
			});
		}
		
		// Block Ctrl+V (paste) if paste feature is not unlocked
		if (!pasteFeatureUnlocked && event.ctrlKey && event.key === 'v') {
			event.preventDefault();
			
			toast.error(`Paste blocked`, {
				description: "You need to purchase Ctrl+V rights to paste your own text",
				action: {
					label: "Buy upgrade",
					onClick: () => {
						selectedShopCategory.set('utility');
					}
				}
			});
		}
	}
</script>

<div class="flex flex-col h-full bg-background rounded-lg shadow-sm overflow-hidden">
	{#if note}
		<div class="p-4 border-b bg-muted/50">
			<input
				type="text"
				bind:value={note.title}
				oninput={handleTitleChange}
				class="w-full text-xl font-semibold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
				placeholder="Note title..."
			/>
		</div>
		
		<div class="px-4 py-3 border-b bg-background">
			{#if hasAnyEmojiPack}
				<div class="flex flex-wrap gap-1">
					{#each availableEmojis as emojiData}
						<Button
							variant="ghost"
							size="sm"
							class="h-8 px-2 py-1 font-mono text-sm hover:bg-muted whitespace-nowrap"
							onclick={() => insertEmoji(emojiData.emoji)}
						>
							{emojiData.emoji}
						</Button>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground text-center py-2">
					Purchased emojis will appear here
				</p>
			{/if}
		</div>
		
		<div class="flex-1 relative">
			{#if !showPreview}
				<textarea
					bind:this={textArea}
					bind:value={note.content}
					oninput={handleInput}
					onkeydown={handleKeyDown}
					class="w-full h-full p-4 resize-none border-none outline-none text-foreground bg-background"
					style="font-family: {$currentFont};"
					placeholder={currentPlaceholder}
				></textarea>
			{:else}
				<div 
					class="w-full h-full p-4 overflow-y-auto markdown-preview"
				>
					{#if note.content.trim()}
						{@html renderedMarkdown}
					{:else}
						<p class="text-muted-foreground italic">Nothing to preview</p>
					{/if}
				</div>
			{/if}
			
			<!-- Top-right action buttons -->
			<div class="absolute top-3 right-3 flex gap-2">
				{#if markdownPreviewUnlocked}
					<Button
						variant="ghost"
						size="sm"
						class="h-8 w-8 p-0 bg-background/80 hover:bg-background border border-border/50 shadow-sm"
						onclick={() => showPreview = !showPreview}
						title={showPreview ? "Switch to edit mode" : "Preview markdown"}
					>
						{#if showPreview}
							<Edit class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</Button>
				{/if}
				
				{#if note.content.length > 0 && copyFeatureUnlocked}
					<Button
						variant="ghost"
						size="sm"
						class="h-8 w-8 p-0 bg-background/80 hover:bg-background border border-border/50 shadow-sm"
						onclick={copyToClipboard}
						title="Copy note content to clipboard"
					>
						{#if copySuccess}
							<Check class="h-4 w-4 text-green-600" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</Button>
				{/if}
			</div>
		</div>
		
		<div class="flex justify-between items-center px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
			<div class="flex items-center gap-4">
				<span>{note.content.length} characters</span>
				{#if wordCountFeatureUnlocked}
					<span>{countWords(note.content)} words</span>
				{/if}
			</div>
			<span>
				Last updated: {new Date(note.updatedAt).toLocaleDateString(navigator.language, { 
					year: 'numeric', 
					month: 'short', 
					day: 'numeric' 
				})} at {new Date(note.updatedAt).toLocaleTimeString(navigator.language, { 
					hour: '2-digit', 
					minute: '2-digit' 
				})}
			</span>
		</div>
	{:else}
		<div class="flex items-center justify-center h-full">
			<p class="text-muted-foreground text-lg">Select a note to start writing and earning chars!</p>
		</div>
	{/if}
</div> 