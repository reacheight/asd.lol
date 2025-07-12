<script lang="ts">
	import { onMount } from 'svelte';
	import { notes, activeNoteId, currentTheme, notesCollapsed, shopCollapsed, type Note } from '$lib/stores.js';
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
		<div class="unified-layout flex flex-col lg:flex-row">
			<!-- Left: Notes List -->
			<aside 
				class="notes-sidebar order-1 w-full lg:w-auto lg:h-full lg:border-r-2 lg:border-b-0 border-b-2 border-border flex-shrink-0"
				class:collapsed={$notesCollapsed}
			>
				<NotesList />
			</aside>
			
			<!-- Center: Editor with Settings -->
			<section class="editor-section order-2 flex-1 flex flex-col overflow-hidden min-h-0">
				<!-- Settings at top of editor -->
				<CompactSettings />
				
				<!-- Text Editor -->
				<div class="editor-container flex-1 overflow-hidden">
					<TextEditor note={activeNote} />
				</div>
			</section>
			
			<!-- Right: Shop -->
			<aside 
				class="shop-sidebar order-3 w-full lg:w-auto lg:h-full lg:border-l-2 lg:border-t-0 border-t-2 border-border flex-shrink-0"
				class:collapsed={$shopCollapsed}
			>
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
		/* display: flex; replaced by tailwind classes */
		height: 100%;
	}

	/* .notes-sidebar {
		flex-shrink: 0;
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
	} */

	/* .shop-sidebar {
		flex-shrink: 0;
		border-left: 2px solid var(--border);
	} */

	/* Responsive Design for Mobile and Tablet Screens */
	/* All media queries are now replaced by Tailwind classes */

	@media (max-width: 1024px) {
		.notes-sidebar.collapsed {
			height: 50px !important;
		}
		
		.notes-sidebar:not(.collapsed) {
			height: 180px;
		}

		.shop-sidebar.collapsed {
			height: 50px !important;
		}

		.shop-sidebar:not(.collapsed) {
			height: 230px;
		}
	}

	/* Very small mobile screens */
	@media (max-width: 480px) {
		.notes-sidebar:not(.collapsed) {
			height: 160px;
		}

		.shop-sidebar:not(.collapsed) {
			height: 260px;
		}
	}

	/* Keeping important collapsed styles until child components are refactored */
	.notes-sidebar.collapsed,
	.shop-sidebar.collapsed {
		height: 50px !important;
	}
</style>
