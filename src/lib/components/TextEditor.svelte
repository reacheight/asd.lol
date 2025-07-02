<script lang="ts">
	import { notes, chars, addChars, currentFont, currentSound, upgrades, getAvailableEmojis } from '../stores.js';
	import type { Note } from '../stores.js';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let { note = $bindable() }: { note?: Note | null } = $props();
	let textArea = $state<HTMLTextAreaElement>();
	let lastContentLength = 0;

	let availableEmojis = $derived(getAvailableEmojis($upgrades));
	let hasAnyEmojiPack = $derived(availableEmojis.length > 0);

	onMount(() => {
		if (note) {
			lastContentLength = note.content.length;
		}
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
		
		<textarea
			bind:this={textArea}
			bind:value={note.content}
			oninput={handleInput}
			class="flex-1 p-4 resize-none border-none outline-none text-foreground bg-background"
			style="font-family: {$currentFont}"
			placeholder="Start typing to earn chars... Every character gives you 1 char!"
		></textarea>
		
		<div class="flex justify-between items-center px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
			<span>{note.content.length} characters</span>
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