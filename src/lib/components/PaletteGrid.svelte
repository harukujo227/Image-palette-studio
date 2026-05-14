<script lang="ts">
  import ColorCard from './ColorCard.svelte';

  interface Props {
    colors: string[];
  }

  let { colors }: Props = $props();
</script>

<div class="grid">
  {#each colors as color, i (color + i)}
    <ColorCard {color} index={i} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    gap: 0.85rem;
  }
  @media (max-width: 520px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
