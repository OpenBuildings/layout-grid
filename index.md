---
layout: index
---
<div class="jumbotron">
    <div class="container">
        <h1>{{ site.github.project_title }}</h1>
        <p>{{ site.github.project_tagline }}</p>
        <a
         href="{{ site.github.releases[0].zipball_url }}"
         class="btn-lg btn-primary">
			Downlaod Latest Release
        </a>
    </div>
</div>

<div class="container">
	{% include reorder-grid.html %}
</div>
