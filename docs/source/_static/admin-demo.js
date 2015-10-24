$(function () {
    'use-strict'

    $('#admin-form').on('submit', function (event) {
        event.preventDefault()
        $('#result').val(decodeURIComponent($('#admin-form').serialize()))
    })

    $('#admin-grid').on('update', function () {
        $('#admin-grid .lt').each(function () {
            $(this).find('[data-xs-x]').val($(this).ltRect('xs').x)
            $(this).find('[data-xs-y]').val($(this).ltRect('xs').y)

            $(this).find('[data-sm-x]').val($(this).ltRect('sm').x)
            $(this).find('[data-sm-y]').val($(this).ltRect('sm').y)

            $(this).find('[data-md-x]').val($(this).ltRect('md').x)
            $(this).find('[data-md-y]').val($(this).ltRect('md').y)

            $(this).find('[data-lg-x]').val($(this).ltRect('lg').x)
            $(this).find('[data-lg-y]').val($(this).ltRect('lg').y)

        })
    })
})
