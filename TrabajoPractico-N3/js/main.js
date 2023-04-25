//declaro las constantes
const sector = document.querySelector("#sector"),
  nombre = document.querySelector("#nombre"),
  marca = document.querySelector("#marca"),
  hsKm = document.querySelector("#hsKm"),//tiene el type="number"
  anio = document.querySelector("#anio"),//tiene el type="number"
  img = document.querySelector("#img"),
  search = document.querySelector("#search"),
  tbody = document.querySelector("#table-body"),
  formMaquinas = document.querySelector("#formMaquinas");
const radios = document.querySelectorAll('input[type="radio"]');

//const del buscador del final
const selectoritem = document.querySelector("#selectoritem");
const editor = document.querySelector("#editor");
const formEditor = document.querySelector("#formEditor");

//Maquinas ya guardadas en inventario de maquinas - array de objetos
const maquinaria = [{
    item: 1,
    nombre: "Autoelevador 1",
    marca: "Yale",
    hsKm: 30500,
    anio: 2001,
    sector: "Mantenimiento",
    img: "https://www.yale.com.ar/autoelevadores/dist/images/montacarga.png",
  },
  {
    item: 2,
    nombre: "Camioneta",
    marca: "Reanault",
    hsKm: 6443924,
    anio: 1995,
    sector: "Fraccionamiento",
    img: "https://autotest.com.ar/wp-content/uploads/2022/08/Renault-Kangoo-die%CC%81sel-1.jpg",
  },
];


// Método ->  localStorage.setItem(clave, valor)
// clave = nombre para identificar el elemento 
// valor = valor/contenido del elemento 

//Método ->  sessionStorage.setItem(clave, valor)
// clave = nombre del elemento
// valor = Contenido del elemento


//Seteo variable maquinas, si LS vacio entonces maquinas = maquinaria
//inicializo la variable maquinas y le asigno un valor
let maquinas = JSON.parse(localStorage.getItem("maquinaria")) || maquinaria;


//Constructor del objeto maquina ¡ojo que la primera esta en mayuscula!
function Maquina(nombre, marca, hsKm, anio, sector, img) {
  this.item = maquinaria.length + 1;
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

console.log(maquinas);

//Funciones de LS
//Con JSON.stringify podemos transformar un objeto JavaScript a un string en formato JSON. 
function guardarLS(arr) {
  localStorage.setItem("maquinaria", JSON.stringify(arr));
}

//Función de búsqueda genérica
function filtrar(arr, filtro, param) {
  return arr.filter((el) => {
    /*  if (param == "item") {
      return el.item == parseFloat(filtro);
    } else {
      return el[`${param}`].includes(filtro.toLowerCase());
    } */
    return param == "item" ?
      el.item == parseFloat(filtro) :
      el[`${param}`].includes(filtro.toLowerCase());
  });
}

//Funcion para editar las horas o kilometros actuales de la maquina
//tengo que buscar la posicion del array restandole 1 al valor del item ingresado
//cuando ya tenga seleccionado el array, tengo que editarle el valor nuevo de las horas o kilometros haciendo hsKm.value=nuevo valor (algo asi)



//Manipular el DOM
function crearHtml(arr) {
  tbody.innerHTML = "";

  let html = "";
  for (const elem of arr) {
    const {item,nombre,marca,hsKm,anio,sector,img} = elem;
       
    html = `<tr>
  <td>${item}</td>
  <td>${nombre}</td>
  <td>${marca}</td>
  <td>${hsKm}</td>
  <td>${anio}</td>
  <td>${sector}</td>
  <td><img src="${img}"/></td>
  <td><button class="btn red" id="${item}">Borrar</button></td>
  </tr>`;
    tbody.innerHTML += html;
  }
  
  /* Agregar eventos a los botones */
  const arrayBotones = document.querySelectorAll("td .btn");
  arrayBotones.forEach((btn) => {
    btn.addEventListener("click", () => {
      maquinas = maquinas.filter((el) => el.item != btn.id);
      guardarLS(maquinas);
      crearHtml(maquinas);
    });
  });
}

//editor de hs y km
const btnCargar = document.getElementById("btnCargar");
function respuestaClick (e){
  e.preventDefault();
  posicionArray = selectoritem.value-1;
  console.log(posicionArray);
  console.log(maquinas[posicionArray]);
  maquinas[posicionArray].hsKm = editor.value;
  console.log("las nuevas horas o kilometros de la maquina seleccionada son Hs/Km "+ maquinas[posicionArray].hsKm);
  //ahora tengo que pushearlas y listo
  
}

formEditor.addEventListener("submit",respuestaClick);

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
