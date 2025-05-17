window.onload = function () {
    $(document).ready( function () {
        $('#history2').DataTable( {
            searching: true,
            "lengthChange": false,
            "pageLength": 20,
            "processing": true,
            language: {
                zeroRecords: 'Ничего не найдено',
                infoEmpty: 'Нет доступных записей',
                info: "Показано с _START_ по _END_ из _TOTAL_ записей",
                infoEmpty: "Показано с 0 по 0 из 0 записей",
                paginate: {
                    "next": "Следующий",
                    "previous": "Предыдущий"
                },
                search: "Поиск:"
            },
        });
    } );
}
