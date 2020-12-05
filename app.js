$(function() {

    let edit = false;
    console.log('JQuery Kitian');
    $('#task-result').hide();
    fetchTasks();

    $('#search').keyup(function(e) {
        if ($('#search').val()) {
            let search = $('#search').val();
            // console.log(search);
            $.ajax({
                url: 'task-search.php',
                type: 'POST',
                data: { search },
                success: function(response) {
                    // console.log(response);
                    let tasks = JSON.parse(response);
                    // console.log(tasks);
                    let template = '';
                    tasks.forEach(task => {
                        // console.log(task);
                        template += `<li>
                            ${ task.name }
                        </li>`;
                    });
                    $('#container').html(template);
                    $('#task-result').show();
                }
            });
        } else {
            $('#task-result').hide();
        }
    });

    $('#task-form').submit(function(e) {
        // console.log('submiting');
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        };
        let url = edit === false ? 'task-add.php' : 'task-edit.php';
        console.log(url);
        $.post(url, postData, function(response) {
            console.log(response);
            fetchTasks();
            $('#task-form').trigger('reset');
        });
        e.preventDefault();
        // console.log(postData);
    });

    function fetchTasks() {

        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function(response) {
                // console.log(response);
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>
                                <a href="#" class="task-item">${task.name}</a>
                            </td>
                            <td>${task.description}</td>
                            <td>
                                <button class="task-delete btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `
                });
                $('#tasks').html(template);
            }
        });

    }

    $(document).on('click', '.task-delete', function() {
        if (confirm('Are you sure you want to delete it?')) {
            // console.log($(this));
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            // console.log(id);
            $.post('task-delete.php', { id }, function(response) {
                // console.log(response);
                fetchTasks();
            });
        }
    });

    $(document).on('click', '.task-item', function() {
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        // console.log(id);
        $.post('task-single.php', { id }, function(response) {
            // console.log(response);
            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);
            edit = true;
        });
    });

});