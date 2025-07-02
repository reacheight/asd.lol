<script lang="ts">
	import { notes, activeNoteId, createNote, type Note } from '../stores.js';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { Plus, X } from 'lucide-svelte';

	function addNewNote() {
		const newNote = createNote();
		notes.update(allNotes => [...allNotes, newNote]);
		activeNoteId.set(newNote.id);
	}

	function selectNote(noteId: string) {
		activeNoteId.set(noteId);
	}

	function deleteNote(noteId: string, event: Event) {
		event.stopPropagation();
		notes.update(allNotes => allNotes.filter(note => note.id !== noteId));
		
		activeNoteId.update(current => current === noteId ? null : current);
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString(navigator.language, { 
			year: 'numeric', 
			month: 'short', 
			day: 'numeric' 
		});
	}
</script>

<div class="flex h-full flex-col bg-muted/30 border-r">
	<div class="flex items-center justify-between p-4 border-b bg-background">
		<h2 class="text-xl font-semibold text-foreground">Notes</h2>
		<Button onclick={addNewNote} size="sm" class="gap-2">
			<Plus class="h-4 w-4" />
			New Note
		</Button>
	</div>
	
	<div class="flex-1 overflow-y-auto p-2 space-y-2">
		{#each $notes as note (note.id)}
			<Card 
				class={cn(
					"cursor-pointer transition-all hover:shadow-md border-2 p-0",
					$activeNoteId === note.id 
						? "border-primary bg-primary/5 shadow-sm" 
						: "border-border hover:border-primary/50"
				)}
				onclick={() => selectNote(note.id)}
			>
				<CardContent class="p-4 relative group">
					<div class="space-y-2">
						<h3 class="font-medium text-foreground line-clamp-1">
							{note.title}
						</h3>
						
						<p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
							{note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}
						</p>
						
						<div class="flex items-center justify-between">
							<span class="text-xs text-muted-foreground">
								{formatDate(note.updatedAt)}
							</span>
							<Badge variant="secondary" class="text-xs">
								{note.content.length} chars
							</Badge>
						</div>
					</div>
					
					<Button
						variant="destructive"
						size="icon"
						class="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
						onclick={(e) => deleteNote(note.id, e)}
						title="Delete note"
					>
						<X class="h-3 w-3" />
					</Button>
				</CardContent>
			</Card>
		{:else}
			<div class="flex flex-col items-center justify-center h-64 text-center space-y-2">
				<div class="text-muted-foreground space-y-1">
					<p class="text-lg font-medium">No notes yet!</p>
					<p class="text-sm">Create your first note to start earning chars.</p>
				</div>
			</div>
		{/each}
	</div>
</div> 