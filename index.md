---
layout: index
---
<div class="jumbotron">
    <div class="container">
        <h1>{{ site.title }}</h1>
        <p>{{ site.github.project_tagline }}</p>
        <a
         href="{{ site.github.releases[0].zipball_url }}"
         class="btn-lg btn-primary">
			Downlaod Latest Release
        </a>
    </div>
</div>

<div class="container">

    <h2>Quick Example</h2>

    <div class="lead">
        Heres' a quick preview of how it could look like. You can drag these items arround and see how they react to resizing.
    </div>
</div>

<div class="container">

	{% include reorder-small.html %}

</div>

<div class="container">

    <h2>Demos</h2>

    <div class="row">
        <div class="col-sm-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    <h4>
                        <a href="{{ site.baseurl }}/demo/static">Static HTML</a>
                    </h4>
                    <p>
                        A static example without any javascript. Just a responsive grid.
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    <h4>
                        <a href="{{ site.baseurl }}/demo/reorder">Reorder</a>
                    </h4>
                    <p>
                        Reorder using native drag'n'drop and a little bit of javascript.
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    <h4>
                        <a href="{{ site.baseurl }}/demo/multiple">Multiple Containers</a>
                    </h4>
                    <p>
                        Can move items around between multiple containers. No additional code.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    <h4>
                        <a href="{{ site.baseurl }}/demo/options">Configurable Options</a>
                    </h4>
                    <p>
                        Modify options on the fly or set them as data attributes.
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="panel panel-default">
                <div class="panel-body">
                    <h4>
                        <a href="{{ site.baseurl }}/demo/custom">Different Config Options</a>
                    </h4>
                    <p>
                        You can have different column counts, aspect ratios and gaps from the defaults.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
