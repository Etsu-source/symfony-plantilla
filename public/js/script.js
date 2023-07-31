//funcion obeteneer usuarios get
async function fetchData() {
  try {
    const response = await fetch("/usuario/get");
    const data = await response.json();
    console.log(data);
    if (!data) {
      console.log("No data");
      return;
    }
    data.forEach((item) => {
      console.log(item);
      const fila = document.createElement("tr");
      fila.classList.add("usuario"); // Agregar la clase CSS al elemento <tr>

      const id = document.createElement("td");
      const nombre = document.createElement("td");
      const apellido = document.createElement("td");
      const correo = document.createElement("td");
      const username = document.createElement("td");
      const roles = document.createElement("td");
      const estado = document.createElement("td");
      const acciones = document.createElement("td");

      id.textContent = item.idUsuario;
      nombre.textContent = item.nombre;
      apellido.textContent = item.apellido;
      correo.textContent = item.correo;
      username.textContent = item.username;
      roles.textContent = item.roles;
      estado.textContent = item.estado;

      const btnEditar = document.createElement("button");
      const btnBorrar = document.createElement("button");

      btnEditar.textContent = "Editar";
      btnBorrar.textContent = "Borrar";

      btnEditar.setAttribute("data-id", item.idUsuario);
      btnBorrar.setAttribute("data-id", item.idUsuario);

      acciones.appendChild(btnEditar);
      acciones.appendChild(btnBorrar);

      fila.appendChild(id);
      fila.appendChild(nombre);
      fila.appendChild(apellido);
      fila.appendChild(correo);
      fila.appendChild(username);
      fila.appendChild(roles);
      fila.appendChild(estado);
      fila.appendChild(acciones);

      const cuerpo = document.getElementById("micuerpo");
      cuerpo.appendChild(fila);
    });
  } catch (error) {
    console.error("Error:", error);
    return;
  }
}

fetchData();

document.addEventListener("click", function (event) {
  if (
    event.target &&
    event.target.nodeName === "BUTTON" &&
    event.target.textContent === "Editar"
  ) {
    const id = event.target.getAttribute("data-id");
    console.log(id);
    location.replace(`/usuario/${id}/edit`);
  } else if (
    event.target &&
    event.target.nodeName === "BUTTON" &&
    event.target.textContent === "Borrar"
  ) {
    const id = event.target.getAttribute("data-id");
    const confirmacion = confirm("¿Estás seguro de borrar este usuario?");

    if (confirmacion) {
      fetch(`/usuario/${id}/delete`, {
        method: "PUT",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.msg);
          // Eliminar el cliente del DOM
          const clienteElement = event.target.closest(".usuario");
          if (clienteElement) {
            clienteElement.remove();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error al borrar el usuario");
        });
    }
  }
});

//crear usaurio api post
let buttonGuardar = document.getElementById("btnGuardar");
let formularioUsuario = document.getElementById("formUsuario");

try {
  buttonGuardar.addEventListener("click", async function () {
    formularioUsuario;
    // Convertir el objeto FormData a un objeto JavaScript
    let fomdata = new FormData(formularioUsuario);
    let data = Object.fromEntries(fomdata);
    data.roles = JSON.parse(data.roles);
    console.log(data);

    if (data.password == "") {
      alert("Llene los campos!");
    } else {
      // Convertir el objeto JavaScript a una cadena JSON
      //debugger;
      let jsonData = JSON.stringify(data);
      let response = await fetch(`/usuario/nuevo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      }).catch((error) => {
        console.log(error);
      });
      alert("Usuario guardado exitosamente");

      //location.replace('/');
    }
  });
} catch (error) {
  console.log(error);
}