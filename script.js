$(document).ready(function () {
  function retrieveMoviesByYear(year) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        async: true,
        crossDomain: true,
        url: `https://moviesdatabase.p.rapidapi.com/titles?year=${year}`,
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "96f614c542msh735d953b5f38d26p17e8b2jsnb51afc56c42b",
          "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
        },
      })
        .done(function (movies) {
          resolve(movies.results);
        })
        .fail(function () {
          reject(error);
        });
    });
  }

  function displayMovies(movies) {
    const $ul = $("#movie-list");
    movies.forEach(function (movie) {
      const $li = $("<li>");
      $li.text(movie);
      $ul.append($li);
    });
    return movies;
  }

  let selectedMovies = [];

  $("#fetch-btn").on("click", function () {
    let selectedYear = $("#year-select").val();
    if (!selectedYear) {
      alert("Please select a year first.");
      return;
    }
    retrieveMoviesByYear(selectedYear)
      .then(function (movies) {
        const $ul = $("#movie-list");
        $ul.empty();
        movieOptions = movies.map((movie) => movie.titleText.text);
        selectedMovies = displayMovies(movieOptions);
      })
      .catch(function (error) {});
  });

  // Remove duplicates from movieOptions
  movieOptions = [...new Set(movieOptions)];

  //script for populating days and buttons
  var startDate = 1;
  var endDate = 31;
  var daysInWeek = 7;
  var movieOptions = [];

  for (var day = startDate; day <= endDate; day++) {
    if ((day - 1) % daysInWeek === 0) {
      $("table").append("</tr><tr>"); // Start a new row for each week
    }

    var dayBox = $("<td>")
      .append('<div class="day-box">')
      .appendTo("table tr:last");
    dayBox
      .find(".day-box")
      .append('<span class="day-number">' + day + "</span>");

    /*   */
    dayBox.find(".day-box").append('<button class="button">+</button>');

    $(dayBox).on("click", "button.button", function () {
      if (selectedMovies.length <= 0) {
        alert("No movies fetched yet.");
      } else {
        $(this)
          .parent()
          .append(
            '<select name="title" id="title" class="title">' +
              '<option value="select">Select a movie</option>' +
              addDropDown() +
              "</select><br>"
          );
      }
    });

    $(dayBox).on("change", "select.title", function () {
      let selectedTitle = $(this).val();

      $(this)
        .parent()
        .append(
          '<div class="selected-title" id="selected-title">' +
            selectedTitle +
            "</div>" +
            '<button class="button-remove">x</button><br>'
        );
      selectedMovies = selectedMovies.filter(
        (title) => title !== selectedTitle
      );

      $(".title")
        .not(this)
        .each(function () {
          // find and remove the selected option
          $(this).find(`option[value="${selectedTitle}"]`).remove();
        });

      alert(
        selectedTitle +
          " is added to the calendar and removed from the dropdown list"
      );

      $(this).remove();
    });

    $(dayBox).on("click", "button.button-remove", function () {
      let titleToReturn = $(this).parent().find(".selected-title").text();
      selectedMovies.push(titleToReturn);
      alert(titleToReturn + " has been brought back to the list");

      $(this).parent().find(".selected-title").remove();
      $(this).parent().find(".button-remove").remove();
    });
  }

  function addDropDown() {
    let concatTitle = [];
    selectedMovies.forEach((movie) => {
      concatTitle.push(
        "<option value=" + '"' + movie + '"' + ">" + movie + "</option>"
      );
    });

    return concatTitle.join("");
  }
});
