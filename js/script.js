
let carroMuestra = document.getElementById("chango")
let chango = []


fetch("./pokemon.json")
    .then(respuesta => respuesta.json())
    .then(pokemon => {
        cargaPokemon(pokemon)
        let buscador = document.getElementById("buscador")
        buscador.addEventListener("input", () => {
            filtroNombre(pokemon)
        })
    })





function filtroNombre(pokemon) {
    let arrayPokemon = pokemon.filter(pokemon => pokemon.nombre.toLowerCase().includes(buscador.value.toLowerCase()))
    cargaPokemon(arrayPokemon)
}


function cargaPokemon(arrayPokemon) {
    let contenedor = document.getElementById("pokemonCard")
    contenedor.innerHTML = ""
    arrayPokemon.forEach(pokemon => {
        let tarjetaPokemon = document.createElement("div")
        tarjetaPokemon.className = "tarjetaPokemon col-10 col-md-5 col-lg-4 col-xl-4 col-xxl-3"

        tarjetaPokemon.innerHTML = `
    <h2 class=tituloCard>${pokemon.nombre}</h2>
    <img src=${pokemon.img}>
    <p>tipo ${pokemon.tipo}</p>
    <p>color principal: ${pokemon.color}</p>
    <p>Valor: ${pokemon.precio}</p>
    <p>stock: <span id=span${pokemon.id}>${pokemon.stock}</span> unidades</p>
    <button id=${pokemon.id} class="boton"> Agregar al carrito </button>
    
    `
        contenedor.appendChild(tarjetaPokemon)

        let boton = document.getElementById(pokemon.id)
        boton.addEventListener("click", (e) => {
            agregarAlCarro(e, arrayPokemon)
        })

    })
}

function alerta() {
    const Toast = Swal.mixin({
        toast: true,
        iconColor: '#297383',
        background: '#b4e6ee',
        color: '#832900',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Pokechango Actualizado'
    })
}








function agregarAlCarro(e, pokemon) {

    let posicionPoke = pokemon.findIndex(pokemon => pokemon.id == e.target.id)
    let pokemonBuscado = pokemon.find(pokemon => pokemon.id === Number(e.target.id))


    if (pokemon[posicionPoke].stock > 0) {
        alerta()

        let elementoSpan = document.getElementById("span" + e.target.id)
        pokemon[posicionPoke].stock--
        elementoSpan.innerHTML = pokemon[posicionPoke].stock

        if (chango.some(pokemon => pokemon.id == pokemonBuscado.id)) {
            let pos = chango.findIndex(pokemon => pokemon.id == pokemonBuscado.id)

            chango[pos].cantidad++
            chango[pos].subtotal = chango[pos].precio * chango[pos].cantidad
        } else {
            chango.push({
                id: pokemonBuscado.id,
                nombre: pokemonBuscado.nombre,
                precio: pokemonBuscado.precio,
                cantidad: 1,
                subtotal: pokemonBuscado.precio,

            })
        }
        localStorage.setItem("chango", JSON.stringify(chango))
        cargaCarro(chango)

    } else {
        Swal.fire("SIN STOCK", `No hay mas ${pokemonBuscado.nombre} Vuelva mañana`, "error")

    }



    function cargaCarro(arrayPokemon) {
        carroMuestra.innerHTML = ""
        arrayPokemon.forEach(({ id, nombre, precio, unidades, subtotal }) => {
            carroMuestra.innerHTML += `<h3> ${nombre} ${precio} ${subtotal}</h3>`

        })
        carroMuestra.innerHTML += `<button id=comprar>Finalizar compra</button>`

        let botonComprar = document.getElementById("comprar")
        botonComprar.addEventListener("click", confirmaVacio)

    }


    function finalizarCompra() {

        localStorage.removeItem("chango");
        chango = [];
        cargaCarro(chango);

    }

    function confirmaVacio() {
        Swal.fire({
            background:'#ffd56a',
            color: '#832900',
            title: 'No llevas mas Pokemon?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Buscar mas',
            confirmButtonColor: '#b4e6ee',
            denyButtonText: `Estoy seguro`,
        }).then((result) => {

            if (result.isConfirmed) {
                Swal.fire('Genial!', '', 'success')
            } else if (result.isDenied) {
                finalizarCompra()
                Swal.fire('Ya tenes tus pokemon!', '', 'info')
            }
        })
    }

}

