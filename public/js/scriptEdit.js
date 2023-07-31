function obtenerIdDesdeUrl() {
  const url = window.location.pathname; // Obtener la ruta de la URL
  const idStartIndex = url.indexOf("/usuario/") + 9; // Obtener el índice del inicio del ID
  const idEndIndex = url.indexOf("/edit"); // Obtener el índice del final del ID
  const id = url.substring(idStartIndex, idEndIndex); // Obtener el ID desde la URL
  return id;
}

const id = obtenerIdDesdeUrl();
console.log(id);
llenarFormulario(id);

// Función para obtener información de un usuario por su ID
async function obtenerUsuarioPorId(id) {
  try {
    const response = await fetch(`/usuario/${id}`);
    const usuario = await response.json();
    return usuario;
  } catch (error) {
    console.log("Error");
    return null;
  }
}

// Función para llenar el formulario de edición con los datos del usuario por su ID
async function llenarFormulario(id) {
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const correo = document.getElementById("correo");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const rol = document.getElementById("rol");

  const usuario = await obtenerUsuarioPorId(id);
  if (usuario) {
    nombre.value = usuario.nombre;
    apellido.value = usuario.apellido;
    correo.value = usuario.correo;
    username.value = usuario.username;
    password.value = usuario.password;
    rol.value = usuario.rol;
  }
}

// btnGuardar
const btnGuardar = document.getElementById("btnGuardar");
btnGuardar.addEventListener("click", async function () {
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const roles = document.getElementById("roles").value;

  const usuario = {
    nombre: nombre,
    apellido: apellido,
    correo: correo,
    username: username,
    password: password,
    roles: roles,
  };
  console.log(usuario);
  usuario.roles = JSON.parse(usuario.roles);
  let jsonData = JSON.stringify(usuario);
  let id = obtenerIdDesdeUrl(); // Obtener el ID desde la URL
  let respuesta = await fetch(`/usuario/${id}/editar`, {
    // Reemplazar "{id}" por el valor real del ID
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  });
  const response = await respuesta.json();
  alert(response.msg);
  location.replace("/usuario");
});
