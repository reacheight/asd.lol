<script lang="ts">
	import { notes, activeNoteId, createNote, notesCollapsed } from '../stores.js';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { Plus, X, NotebookPen } from 'lucide-svelte';

	$: isCollapsed = $notesCollapsed;

	function addNewNote() {
		const newNote = createNote();
		notes.update(allNotes => [newNote, ...allNotes]); // Add to the top
		activeNoteId.set(newNote.id);
		if (isCollapsed) {
			notesCollapsed.set(false);
		}
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
		const d = new Date(date);
		return d.toLocaleDateString(navigator.language, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class={cn(
	"flex flex-col h-full bg-muted/30 transition-all duration-300 ease-in-out",
	"lg:border-r",
	isCollapsed ? "w-full lg:w-16" : "w-full lg:w-80"
)}>
	<div class={cn(
		"flex items-center p-2 lg:p-4 bg-background",
		isCollapsed ? "justify-center" : "justify-between"
	)}>
		<div class="flex items-center gap-1">
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 shrink-0"
				onclick={() => notesCollapsed.set(!isCollapsed)}
				title={isCollapsed ? 'Expand Notes' : 'Collapse Notes'}
			>
				<NotebookPen class="h-5 w-5 text-primary" />
			</Button>
			{#if !isCollapsed}
				<h2 class="text-xl font-semibold text-foreground">Notes</h2>
			{/if}
		</div>
		{#if !isCollapsed}
			<Button onclick={addNewNote} size="sm" class="h-8 gap-2">
				<Plus class="h-4 w-4" />
				<span class="hidden sm:inline">New Note</span>
			</Button>
		{/if}
	</div>
	
	{#if !isCollapsed}
		<div class="flex-1 overflow-y-auto p-2 space-y-2">
			{#each $notes as note (note.id)}
				<div
					role="button"
					tabindex="0"
					onclick={() => selectNote(note.id)}
					onkeydown={(e) => e.key === 'Enter' && selectNote(note.id)}
					class="cursor-pointer rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={`Select note titled ${note.title}`}
				>
					<Card 
						class={cn(
							"transition-all border-2 p-0",
							$activeNoteId === note.id 
								? "border-primary bg-primary/5 shadow-sm" 
								: "border-border hover:border-primary/50"
						)}
					>
						<CardContent class="p-3 sm:p-4 relative group">
							<div class="space-y-2">
								<h3 class="font-medium text-foreground line-clamp-2">
									{note.title || 'Untitled Note'}
								</h3>
								
								<p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
									{note.content.slice(0, 100) || 'No content...'}
								</p>
								
								<div class="flex items-center justify-between pt-1">
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
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center text-center p-4 h-full">
					<div class="text-muted-foreground space-y-2">
						<p class="text-lg font-medium">No notes yet!</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>