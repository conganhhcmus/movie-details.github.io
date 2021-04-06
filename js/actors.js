var table = $("#table_id").DataTable({
    destroy: true,
    columnDefs: [
        {
            orderable: false,
            targets: 0,
        },
        {
            orderable: false,
            targets: 3,
        },
    ],
    order: [[1, "asc"]],
});

var search = $(".dataTables_filter input").val();
var dataLocal = [];
//Load Actor
$("#btnLoadActors").on("click", function () {
    search = $(".dataTables_filter input").val();
    $("#loadingPopup").modal("show");
    $.ajax({
        type: "get",
        url: "https://api-sakila.herokuapp.com/api/actors",
    }).done(function (data) {
        dataLocal = data;
        setTimeout(function () {
            $("#loadingPopup").modal("hide");
        }, 500);
        table.destroy();
        $("#actor_container").empty();
        for (const f of data) {
            const tr = `<tr>
                            <td><input type="checkbox" name="id[]" value="${f.actor_id}"></td>
                            <td>${f.first_name}</td>
                            <td>${f.last_name}</td>
                            <td><button type="button" onclick='editactor(${f.actor_id})'
                                    class="btn btn-sm btn-outline-secondary">
                                    <i class="fa fa-pencil-square-o"></i>
                                </button>
                            </td>
                        </tr>`;
            $("#actor_container").append(tr);
        }

        table = $("#table_id").DataTable({
            destroy: true,
            columnDefs: [
                {
                    orderable: false,
                    targets: 0,
                },
                {
                    orderable: false,
                    targets: 3,
                },
            ],
            order: [[1, "asc"]],
        });

        table.search(search).draw();
        // Handle click on "Select all" control
        $("#example-select-all").on("click", function () {
            // Get all rows with search applied
            var rows = table.rows({ search: "applied" }).nodes();
            // Check/uncheck checkboxes for all rows in the table
            $('input[type="checkbox"]', rows).prop("checked", this.checked);
        });

        // Handle click on checkbox to set state of "Select all" control
        $("#actor_container").on(
            "change",
            'input[type="checkbox"]',
            function () {
                // If checkbox is not checked
                if (!this.checked) {
                    var el = $("#example-select-all").get(0);
                    // If "Select all" control is checked and has 'indeterminate' property
                    if (el && el.checked && "indeterminate" in el) {
                        // Set visual state of "Select all" control
                        // as 'indeterminate'
                        el.indeterminate = true;
                    }
                }
            }
        );
    });
});

// New Actor
$("#btnAddActor").on("click", function () {
    search = $(".dataTables_filter input").val();
    const dataPost = {
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
    };

    console.log(dataPost);
    if (dataPost.first_name === "" || dataPost.last_name === "") {
        alert("First Name and Last Name Year must be filled out");
    } else {
        $.ajax({
            type: "post",
            url: "https://api-sakila.herokuapp.com/api/actors/",
            data: JSON.stringify(dataPost),
            dataType: "json",
            contentType: "application/json",
        }).done(function (data) {
            console.log(data);
            $("#newPopup").modal("hide");
            Swal.fire({
                // position: 'top-end',
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#btnLoadActors").click();
        });
    }
});

// Delete actors
$("#btnDeleteActors").on("click", function () {
    var deleteIds = [];
    search = $(".dataTables_filter input").val();
    var rows = table.rows({ search: "applied" }).nodes();
    // Check/uncheck checkboxes for all rows in the table
    $('input[type="checkbox"]', rows).each(function () {
        // If checkbox is checked
        if (this.checked) {
            // Create a hidden element
            deleteIds.push(this.value);
        }
    });

    console.log(deleteIds);
    if (deleteIds.length == 1) {
        $.ajax({
            type: "delete",
            url: `https://api-sakila.herokuapp.com/api/actors/${deleteIds[0]}`,
        }).done(function (data) {
            Swal.fire({
                // position: 'top-end',
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#btnLoadActors").click();
        });
    } else if (deleteIds.length > 1) {
        $.ajax({
            type: "delete",
            url: `https://api-sakila.herokuapp.com/api/actors/`,
            data: JSON.stringify({ id: deleteIds }),
            dataType: "json",
            contentType: "application/json",
        }).done(function (data) {
            Swal.fire({
                // position: 'top-end',
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#btnLoadActors").click();
        });
    }
});

// Edit actor

function editactor(id) {
    var actor = dataLocal.filter((word) => word.actor_id === id)[0];
    console.log(actor);
    $("#id_edit").val(actor.actor_id);
    $("#first_name_edit").val(actor.first_name);
    $("#last_name_edit").val(actor.last_name);

    $("#editPopup").modal("show");
}

$("#btnUpdateActor").on("click", function () {
    search = $(".dataTables_filter input").val();
    const dataPut = {
        first_name: $("#first_name_edit").val(),
        last_name: $("#last_name_edit").val(),
    };
    if (dataPut.release_year === 0 || dataPut.title === "") {
        alert("Name and Release Year must be filled out");
    } else {
        $.ajax({
            type: "patch",
            url: `https://api-sakila.herokuapp.com/api/actors/${$(
                "#id_edit"
            ).val()}`,
            data: JSON.stringify(dataPut),
            dataType: "json",
            contentType: "application/json",
        }).done(function (data) {
            console.log(data);
            $("#editPopup").modal("hide");
            Swal.fire({
                // position: 'top-end',
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#btnLoadActors").click();
        });
    }
});

