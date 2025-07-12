<script lang="ts">
	import CoinDisplay from './CoinDisplay.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<header class="flex flex-row justify-between items-center p-2 sm:p-3 md:p-4 md:px-6 bg-background border-b-2 border-border flex-shrink-0 gap-2">
  	<div class="text-left flex-1 min-w-0">
    		<div class="flex items-center justify-start gap-2 mb-1 md:mb-2">
      <h1 class="m-0 text-base sm:text-lg md:text-2xl text-foreground font-bold">asd.lol</h1>
      <Button 
        variant="outline"
        size="sm"
        class="h-6 sm:h-7 md:h-8 px-2 sm:px-3"
        onclick={() => window.open('https://github.com/reacheight/asd.lol', '_blank')}
      >
        <svg class="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span class="text-secondary-foreground tracking-tight hidden sm:inline">3 (me, myself & i)</span>
      </Button>
    </div>
    <p class="mt-1 mb-0 text-sm text-muted-foreground font-medium hidden md:block">your second stimulation-addicted brain</p>
  </div>
	
	<div class="flex items-center gap-4 md:gap-6 w-auto justify-end">
		<CoinDisplay />
	</div>
</header>

 