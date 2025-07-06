<script lang="ts">
	import { onMount } from 'svelte';
	import { notes, activeNoteId, currentTheme, type Note } from '$lib/stores.js';
	import NotesList from '$lib/components/NotesList.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte';
	import Header from '$lib/components/Header.svelte';
	import CompactSettings from '$lib/components/CompactSettings.svelte';
	import CompactShop from '$lib/components/CompactShop.svelte';

	let activeNote: Note | null = null;

	// Update active note when activeNoteId changes
	$: if ($activeNoteId) {
		activeNote = $notes.find(note => note.id === $activeNoteId) || null;
	} else {
		activeNote = null;
	}

	// Apply theme changes
	$: if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-theme', $currentTheme);
	}

	onMount(() => {
		// Apply initial theme
		document.documentElement.setAttribute('data-theme', $currentTheme);
	});
</script>

<svelte:head>
	<title>asd.lol - your second stimulation-addicted brain</title>
	<meta name="description" content="literally the worst place to write texts" />
</svelte:head>

<div class="app-container">
	<!-- Top Bar -->
	<Header />

	<!-- Main Content -->
	<main class="main-content">
		<div class="unified-layout">
			<!-- Left: Notes List -->
			<aside class="notes-sidebar">
				<NotesList />
			</aside>
			
			<!-- Center: Editor with Settings -->
			<section class="editor-section">
				<!-- Settings at top of editor -->
				<CompactSettings />
				
				<!-- Text Editor -->
				<div class="editor-container">
					<TextEditor note={activeNote} />
				</div>
			</section>
			
			<!-- Right: Shop -->
			<aside class="shop-sidebar">
				<CompactShop />
			</aside>
		</div>
	</main>
</div>

<style>
	.app-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--background);
	}



	.main-content {
		flex: 1;
		overflow: hidden;
	}

	.unified-layout {
		display: flex;
		height: 100%;
	}

	.notes-sidebar {
		width: 300px;
		flex-shrink: 0;
		border-right: 2px solid var(--border);
	}

	.editor-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.editor-container {
		flex: 1;
		overflow: hidden;
	}

	.shop-sidebar {
		flex-shrink: 0;
		border-left: 2px solid var(--border);
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.unified-layout {
			flex-direction: column;
		}

		.notes-sidebar {
			order: 1;
			width: 100%;
			height: 200px;
			border-right: none;
			border-bottom: 2px solid var(--border);
		}

		.editor-section {
			order: 2;
			flex: 1;
		}

		.shop-sidebar {
			order: 3;
			border-left: none;
			border-top: 2px solid var(--border);
		}
	}

	@media (max-width: 768px) {
		.notes-sidebar {
			height: 150px;
		}
	}
</style>
