============
Installation
============

Layout grid only requires jquery. It uses native html5 drag-n-drop so all the browsers that support that (all the major browsers) should work.
Mobile browsers are also supported and it uses native touch events there.

Using `jspm <http://jspm.io />`_:

.. code-block:: bash

    jspm install npm:layout-grid


Using npm:

.. code-block:: bash

    npm install layout-grid

Manual:

Download the `latest release <https://github.com/clippings/layout-grid/releases/latest />`_

.. code-block:: html

    <link rel="stylesheet" type="text/css" href="dist/css/layout-grid.min.css" />
    <script type="text/javascript" src="dist/js/layout-grid.min.js"></script>

Contributing
------------

You can run the tests with "npm test", after you've run "npm install" to get all the requirements.
All the tests, linters and style checks will be run on CI server for your pull requests automatically.

You can read the source code at github - `clippings/layout-grid <https://github.com/clippings/layout-grid />`_
