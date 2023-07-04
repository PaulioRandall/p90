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
		column-gap: $addRem(0.5, '0.8', '1.2');
		border: $space.md() dashed cyan;
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

		$props: $highlight.normal;
	}

	.box:hover {
		$props: $highlight.hover;
	}
</style>
