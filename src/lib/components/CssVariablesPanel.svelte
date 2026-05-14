<script lang="ts">
  import type { ThemeTokens } from '$lib/types';
  import { themeToCss } from '$lib/color/theme';
  import CopyButton from './CopyButton.svelte';

  interface Props {
    theme: ThemeTokens;
  }

  let { theme }: Props = $props();
  let css = $derived(themeToCss(theme));
</script>

<section class="panel" aria-label="Generated CSS variables">
  <header>
    <div class="title">
      <span class="dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
      <span class="filename">theme.css</span>
    </div>
    <CopyButton value={css} label="Copy CSS" copiedLabel="Copied!" variant="solid" />
  </header>

  <pre><code>{css}</code></pre>
</section>

<style>
  .panel {
    background: linear-gradient(180deg, #0e1220 0%, #0a0d18 100%);
    color: #e7ecff;
    border-radius: 18px;
    padding: 0.55rem 0.6rem 0.6rem;
    box-shadow: 0 24px 60px -32px rgba(11, 13, 18, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0.45rem 0.6rem;
  }
  .title {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.82rem;
    font-weight: 500;
    color: #b9c2ea;
  }
  .dots {
    display: inline-flex;
    gap: 0.3rem;
  }
  .dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #3a4366;
  }
  .dots span:nth-child(1) { background: #ff5f57; }
  .dots span:nth-child(2) { background: #febc2e; }
  .dots span:nth-child(3) { background: #28c840; }
  .filename {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.78rem;
    color: #d9defb;
  }
  pre {
    margin: 0;
    padding: 0.75rem 0.95rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.78rem;
    line-height: 1.6;
    color: #c8d0f4;
    max-height: 320px;
  }
  pre::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  pre::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 999px;
  }
</style>
