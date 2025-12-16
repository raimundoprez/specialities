const express = require("express");
const categories = require("./categories.js");

const app = express();
const port = 3000;

//creamos una cadena HTML que represente un header con un título y una lista de categorías navegables
let header = "<li><a href='/'>Home</a></li>";

for (category of Object.keys(categories)) {
    header += `<li><a href="/${category.toLowerCase()}">${category}</a></li>`;
}

header = `
    <header>
        <h1>Clasificador de usuarios</h1>

        <nav>
            <ul>
                ${header}
            </ul>
        </nav>
    </header>
`;

//añadimos la página principal
app.get("/", (_, res) => {
    res.send(`
        ${header}
        <main>
            <h2>Bienvenido al clasificador de usuarios</h2>
            <p>Haz clic en cada categoría para ver los usuarios que tiene.</p>
        </main>
    `);
});

//añadimos una página para cada categoría y mostramos sus usuarios
for (const [category, users] of Object.entries(categories)) {

    //convertimos cada usuario a categoría html
    const elements = users.map(user => `<li><b>ID</b>: ${user.id}, <b>Nombre</b>: ${user.name}, <b>Edad</b>: ${user.age}</li>`);

    app.get(`/${category.toLowerCase()}`, (_, res) => {
        res.send(`
            ${header}
            <main>
                <h2>${category}</h2>
                <p>Total de usuarios en esta categoría: ${users.length}</p>
                <ul>
                    ${elements.join("")}
                </ul>
            </main>
        `);
    });
}

//añadimos la página de error
app.use((_, req) => {
    req.status(404).send(`
        ${header}
        <main>
            <h2>Página no encontrada</h2>
            <p>Esta sección no existe, utiliza los enlaces de navegación para ir a una página válida.</p>
        </main>
    `);
});

//lanzamos el servidor
app.listen(port, () => {
    console.log("Aplicación Node.js Express corriendo en el puerto " + port);
});