<script lang="ts">
	import { onMount } from 'svelte';
	import { notes, activeNoteId, currentTheme, type Note } from '$lib/stores.js';
	import NotesList from '$lib/components/NotesList.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte';
	import CoinDisplay from '$lib/components/CoinDisplay.svelte';
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
	<meta name="description" content="asd.lol - your second stimulation-addicted brain - literally the worst place to write texts" />
</svelte:head>

<div class="app-container">
	<!-- Top Bar -->
	<header class="top-bar">
		<div class="app-title">
			<h1>asd.lol</h1>
			<p>your second stimulation-addicted brain</p>
		</div>
		
		<div class="top-bar-actions">
			<CoinDisplay />
		</div>
	</header>

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
		background: var(--bg-color);
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: var(--header-bg);
		border-bottom: 2px solid var(--border-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
	}

	.app-title h1 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-color);
		font-weight: 700;
	}

	.app-title p {
		margin: 0.25rem 0 0 0;
		font-size: 0.9rem;
		color: var(--muted-color);
		font-weight: 500;
	}

	.top-bar-actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
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
		border-right: 2px solid var(--border-color);
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
		border-left: 2px solid var(--border-color);
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
			border-bottom: 2px solid var(--border-color);
		}

		.editor-section {
			order: 2;
			flex: 1;
		}

		.shop-sidebar {
			order: 3;
			border-left: none;
			border-top: 2px solid var(--border-color);
		}
	}

	@media (max-width: 768px) {
		.top-bar {
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
		}

		.app-title {
			text-align: center;
		}

		.top-bar-actions {
			width: 100%;
			justify-content: center;
		}

		.notes-sidebar {
			height: 150px;
		}
	}

	@media (max-width: 480px) {
		.app-title h1 {
			font-size: 1.2rem;
		}

		.top-bar {
			padding: 0.75rem;
		}
	}
</style>
