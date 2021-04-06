var table = $("#table_id").DataTable({
    destroy: true,
    columnDefs: [
        {
            orderable: false,
            targets: 0,
        },
        {
            orderable: false,
            targets: 7,
        },
    ],
    order: [[1, "asc"]],
});

var search = $(".dataTables_filter input").val();
var dataLocal = [];
//Load Film
$("#btnLoadFilms").on("click", function () {
    search = $(".dataTables_filter input").val();
    $("#loadingPopup").modal("show");
    $.ajax({
        type: "get",
        url: "https://api-sakila.herokuapp.com/api/films",
    }).done(function (data) {
        dataLocal = data;
        setTimeout(function () {
            $("#loadingPopup").modal("hide");
        }, 500);
        table.destroy();
        $("#film_container").empty();
        for (const f of data) {
            const tr = `<tr>
                            <td><input type="checkbox" name="id[]" value="${f.film_id}"></td>
                            <td>${f.title}</td>
                            <td>${f.release_year}</td>
                            <td>${f.language_id}</td>
                            <td>${f.rating}</td>
                            <td>${f.special_features}</td>
                            <td>${f.replacement_cost}</td>
                            <td><button type="button" onclick='editFilm(${f.film_id})'
                                    class="btn btn-sm btn-outline-secondary">
                                    <i class="fa fa-pencil-square-o"></i>
                                </button>
                            </td>
                        </tr>`;
            $("#film_container").append(tr);
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
                    targets: 7,
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
        $("#film_container").on(
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

// New Film
$("#btnAddFilm").on("click", function () {
    search = $(".dataTables_filter input").val();
    const dataPost = {
        title: $("#title").val(),
        release_year: +$("#release_year").val(),
        language_id: +$("#language").val(),
        rating: $("#rating").val(),
        special_features: $("#special_features").val(),
        replacement_cost: +$("#replacement_cost").val(),
    };
    if (dataPost.release_year === 0 || dataPost.title === "") {
        alert("Name and Release Year must be filled out");
    } else {
        $.ajax({
            type: "post",
            url: "https://api-sakila.herokuapp.com/api/films/",
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
            $("#btnLoadFilms").click();
        });
    }
});

// Delete Films
$("#btnDeleteFilms").on("click", function () {
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
    for (const id of deleteIds) {
        $.ajax({
            type: "delete",
            url: `https://api-sakila.herokuapp.com/api/films/${id}`,
        }).done(function (data) {
            Swal.fire({
                // position: 'top-end',
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#btnLoadFilms").click();
        });
    }
});

// Edit Film

function editFilm(id) {
    var film = dataLocal.filter((word) => word.film_id === id)[0];
    $("#id_edit").val(film.film_id);
    $("#title_edit").val(film.title);
    $("#release_year_edit").val(film.release_year);
    $("#language_edit").val(film.language_id);
    $("#rating_edit").val(film.rating);
    $("#special_features_edit").val(film.special_features);
    $("#replacement_cost_edit").val(film.replacement_cost);

    $("#editPopup").modal("show");
}

$("#btnUpdateFilm").on("click", function () {
    search = $(".dataTables_filter input").val();
    const dataPut = {
        title: $("#title_edit").val(),
        release_year: +$("#release_year_edit").val(),
        language_id: +$("#language_edit").val(),
        rating: $("#rating_edit").val(),
        special_features: $("#special_features_edit").val(),
        replacement_cost: $("#replacement_cost_edit").val(),
    };
    if (dataPut.release_year === 0 || dataPut.title === "") {
        alert("Name and Release Year must be filled out");
    } else {
        $.ajax({
            type: "patch",
            url: `https://api-sakila.herokuapp.com/api/films/${$(
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
            $("#btnLoadFilms").click();
        });
    }
});
