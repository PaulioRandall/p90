<script>
	import Title from './Title.svelte'
	import Paragraph from './Paragraph.svelte'

	const title = 'Minimalist CSS pre-processor for Svelte'
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main>
	<Title>{title}</Title>
	<Paragraph>A paragraph...</Paragraph>

	<div class="container">
		<div class="box" />
		<div class="box" />
		<div class="box" />
	</div>
</main>

<style>
	.container {
		display: flex;
		justify-content: center;
		column-gap: 2rem;
	}

	@media (prefers-color-scheme: light) {
		.box {
			background-color: indianred;
		}
	}

	@media (prefers-color-scheme: dark) {
		.box {
			background-color: purple;
		}
	}

	.box {
		width: 100px;
		height: 100px;
	
		$highlight.default;
	}

	.box:hover {
		$highlight.hover;
	}
</style>
