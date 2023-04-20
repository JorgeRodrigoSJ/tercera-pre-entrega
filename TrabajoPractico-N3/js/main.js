const titulo = document.querySelector("#titulo"),
  nombre = document.querySelector("#nombre"),
  marca = document.querySelector("#marca"),
  hsKm = document.querySelector("#hsKm"),//tiene el type="number"
  anio = document.querySelector("#anio"),//tiene el type="number"
  //falta el de sector
  img = document.querySelector("#img"),
  search = document.querySelector("#search"),
  tbody = document.querySelector("#table-body"),
  formMaquinas = document.querySelector("#formMaquinas");
const radios = document.querySelectorAll('input[type="radio"]');

//Maquinas ya guardadas en inventario de maquinas
const maquinaria = [{
    nombre: "Autoelevador 1",
    marca: "Nissan",
    hsKm: 30500,
    anio: 2001,
    sector: "Mantenimiento",
    img: "https://www.yale.com.ar/autoelevadores/dist/images/montacarga.png",
  },
  {
    nombre: "Camioneta",
    marca: "Reanault",
    hsKm: 6443924,
    anio: 1995,
    sector: "Fraccionamiento",
    img: "https://autotest.com.ar/wp-content/uploads/2022/08/Renault-Kangoo-die%CC%81sel-1.jpg",
  },
];

//Seteo variable maquinas, si LS vacio entonces maquinas = inventario
//inicializo la variable maquinas y le asigno un valor
let maquinas = JSON.parse(localStorage.getItem("maquinaria")) || maquinaria;


//Constructor del objeto maquina ¡ojo que la primera esta en mayuscula!
function Maquina(nombre, marca, hsKm, anio, sector, img) {
  this.nombre = nombre;
  this.marca = marca;
  this.hsKm = hsKm;
  this.anio = anio;
  this.sector = sector;
  //Si campo img vacío this.img genérica
  img == "" ? (this.img = `https://via.placeholder.com/150`) : (this.img = img);
}

/* Declaración de Funciones */
//Cargar al inventario
function cargarMaquinaria(arr, maquina) {
  arr.push(maquina);
}
//Funciones de LS
function guardarLS(arr) {
  localStorage.setItem("maquinaria", JSON.stringify(arr));
}

//Función de búsqueda genérica
// function filtrar(arr, filtro, param) {
//   return arr.filter((el) => {
//     /*  if (param == "precio") {
//       return el.precio <= parseFloat(filtro);
//     } else {
//       return el[`${param}`].includes(filtro.toLowerCase());
//     } */
//     return param == "precio" ?
//       el.precio <= parseFloat(filtro) :
//       el[`${param}`].includes(filtro.toLowerCase());
//   });
// }

//Manipular el DOM
function crearHtml(arr) {
  tbody.innerHTML = "";

  let html = "";
  for (const item of arr) {
    const {nombre, marca,hsKm,anio,sector,img} = item;
       
    html = `<tr>
  <td>${nombre}</td>
  <td>${marca}</td>
  <td>${hsKm}</td>
  <td>${anio}</td>
  <td>${sector}</td>
  <td><img src="${img}"/></td>
  <td><button class="btn red" id="${hsKm}">Borrar</button></td>
  </tr>`;
    tbody.innerHTML += html;
  }
  
  /* Agregar eventos a los botones */
  const arrayBotones = document.querySelectorAll("td .btn");
  arrayBotones.forEach((btn) => {
    btn.addEventListener("click", () => {
      maquinas = maquinas.filter((el) => el.hsKm != btn.id);
      guardarLS(maquinas);
      crearHtml(maquinas);
    });
  });
}

/* Fin de funciones */

//####
/* Ejecución de funciones */
crearHtml(maquinas);

//Listeners

formMaquinas.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevoMaquina = new Maquina(
    nombre.value,
    marca.value,
    hsKm.value,
    anio.value,
    sector.value,
    img.value
  );

//esta funcion hace un push al array
  cargarMaquinaria (maquinas, nuevoMaquina);
  guardarLS(maquinas);
  crearHtml(maquinas);
  formMaquinas.reset()
});

//Listeners de búsqueda
search.addEventListener("input", () => {
  let nuevoFiltro = filtrar(maquinas, search.value, "nombre");
  crearHtml(nuevoFiltro);
});

//radio buttons
for (const radio of radios) {
  radio.addEventListener("change", () => {

    if (radio.checked) {
      search.addEventListener("input", () => {
        let nuevoFiltro = filtrar(maquinas, search.value, radio.value);
        crearHtml(nuevoFiltro);
      });
    }
  });
}
console.log(maquinas);

//tengo que hacer un campo en el html para poder sumar horas o kilometros a cada maquina ya existente
//tengo que hacer que funcione el buscador