<script lang="ts">
	import { notes, activeNoteId, createNote, type Note } from '../stores.js';

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
		
		// If the deleted note was active, clear the active note
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

<div class="notes-list">
	<div class="notes-header">
		<h2>Notes</h2>
		<button on:click={addNewNote} class="add-note-btn">
			+ New Note
		</button>
	</div>
	
	<div class="notes-container">
		{#each $notes as note (note.id)}
			<div 
				class="note-item" 
				class:active={$activeNoteId === note.id}
				on:click={() => selectNote(note.id)}
			>
				<div class="note-content">
					<h3 class="note-title">{note.title}</h3>
					<p class="note-preview">
						{note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}
					</p>
					<div class="note-meta">
						<span class="note-date">{formatDate(note.updatedAt)}</span>
						<span class="note-chars">{note.content.length} chars</span>
					</div>
				</div>
				<button 
					on:click={(e) => deleteNote(note.id, e)}
					class="delete-btn"
					title="Delete note"
				>
					×
				</button>
			</div>
		{:else}
			<div class="empty-state">
				<p>No notes yet!</p>
				<p>Create your first note to start earning chars.</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.notes-list {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--sidebar-bg, #f8f9fa);
		border-right: 1px solid var(--border-color, #e5e5e5);
	}

	.notes-header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--header-bg, #ffffff);
	}

	.notes-header h2 {
		margin: 0;
		color: var(--text-color, #333);
		font-size: 1.3rem;
	}

	.add-note-btn {
		padding: 0.5rem 1rem;
		background: var(--accent-color, #007acc);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	.add-note-btn:hover {
		background: var(--accent-hover-color, #005a9e);
		transform: translateY(-1px);
	}

	.notes-container {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.note-item {
		display: flex;
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: var(--note-bg, #ffffff);
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
	}

	.note-item:hover {
		border-color: var(--accent-color, #007acc);
		box-shadow: 0 2px 8px rgba(0, 122, 204, 0.1);
	}

	.note-item.active {
		border-color: var(--accent-color, #007acc);
		background: var(--active-note-bg, #f0f8ff);
		box-shadow: 0 2px 8px rgba(0, 122, 204, 0.2);
	}

	.note-content {
		flex: 1;
	}

	.note-title {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-color, #333);
		line-height: 1.3;
	}

	.note-preview {
		margin: 0 0 0.5rem 0;
		color: var(--muted-color, #666);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.note-meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--muted-color, #999);
	}

	.delete-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 24px;
		height: 24px;
		border: none;
		background: var(--danger-color, #dc3545);
		color: white;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		line-height: 1;
		opacity: 0;
		transition: all 0.2s;
	}

	.note-item:hover .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		background: var(--danger-hover-color, #c82333);
		transform: scale(1.1);
	}

	.empty-state {
		padding: 2rem;
		text-align: center;
		color: var(--muted-color, #666);
	}

	.empty-state p {
		margin: 0.5rem 0;
	}
</style> 