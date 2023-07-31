$(document).ready(function () {
  $("#logout-button").click(function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace

    // Realiza la llamada AJAX para cerrar sesión
    $.ajax({
      url: $(this).attr("/home"),
      method: "POST",
      success: function () {
        // Recarga la página después de cerrar sesión
        location.reload();
      },
    });
  });
});