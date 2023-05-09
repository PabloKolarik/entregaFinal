function cargaCarro(arrayPokemon) {
    carroMuestra.innerHTML = ""
    arrayPokemon.forEach(({ id, nombre, precio, unidades, subtotal }) => {
        carroMuestra.innerHTML += `<h3> ${nombre} ${precio} ${subtotal}</h3>`

    })
    carroMuestra.innerHTML += `<button id=comprar>Finalizar compra</button>`

    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", confirmaVacio)

}