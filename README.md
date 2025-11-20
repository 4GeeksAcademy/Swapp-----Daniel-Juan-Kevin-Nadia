![Logo](/public/logo-swapp.webp) <br>
# Swapp - Plataforma de Trueques

**Swapp**: Es un sitio web donde las personas puedan intercambiar objetos o servicios sin dinero (por ejemplo, clases de inglés por clases de cocina), los servicios y objetos pueden ser de cualquier rubro, ya sea educativo, doméstico, ...


## 🌐 Tecnologías usadas
- **React**: para frontend
- **Flask**: framework web de Python y ORM de SQLAlchemy
- **Consumo de Api externa**: cloudinary para fotos de los perfiles de las personas 


## 📦 Estructura de directorios del proyecto
En todo el desarrollo usamos docker containers, usando esta estructura de directorios

```
.
├── .devcontainer
│   ├── Dockerfile
│   ├── cfg.sh
│   └── devcontainer.json
├── .gitattributes
├── .gitignore
├── Pipfile
├── README.md
├── api
│   ├── __init__.py
│   ├── admin.py
│   ├── admin_views.py
│   ├── app.py
│   ├── cloudinary
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── routes.py
│   ├── init
│   │   ├── __init__.py
│   │   ├── ins_hab_categ.py
│   │   └── usuarios_init.py
│   ├── models.py
│   ├── urls
│   │   ├── __init__.py
│   │   ├── categorias.py
│   │   ├── habilidades.py
│   │   ├── intercambio.py
│   │   ├── mensaje.py
│   │   ├── puntuacion.py
│   │   └── usuario.py
│   ├── utils.py
│   └── wsgi.py
├── deploy.sh
├── environment.txt
├── eslint.config.js
├── front
│   ├── App.jsx
│   ├── assets
│   │   ├── components
│   │   │   ├── BotonMensajeria.jsx
│   │   │   ├── CardUsuario.jsx
│   │   │   ├── Carousel.jsx
│   │   │   ├── CropperModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ModalAgregarHabilidad.jsx
│   │   │   ├── ModalIntercambio.jsx
│   │   │   ├── ModalMensajeria.jsx
│   │   │   ├── ModalPuntuacion.jsx
│   │   │   └── Navbar.jsx
│   │   └── styles
│   │       ├── App.css
│   │       ├── BotonMensajeria.css
│   │       ├── CardUsuario.css
│   │       ├── Carousel.css
│   │       ├── CropperModal.css
│   │       ├── Footer.css
│   │       ├── Login.css
│   │       ├── ModalAgregarHabilidad.css
│   │       ├── ModalIntercambio.css
│   │       ├── ModalMensajeria.css
│   │       ├── ModalPuntuacion.css
│   │       ├── Navbar.css
│   │       ├── PerfilPublico.css
│   │       ├── PerfilUsuario.css
│   │       └── Registro.css
│   ├── environ.js
│   ├── hooks
│   │   └── useStore.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── PerfilPublico.jsx
│   │   ├── PerfilUsuario.jsx
│   │   ├── Registro.jsx
│   │   └── UsuariosCategoria.jsx
│   ├── services
│   │   └── api.js
│   └── store.js
├── index.html
├── migrate.sh
├── migrations
│   ├── README
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
│       └── d457297ca9c4_.py
├── package.json
├── public
│   ├── Hombre1.png
│   ├── Hombre2.png
│   ├── Hombre3.png
│   ├── Hombre4.png
│   ├── Hombre5.png
│   ├── Mujer1.png
│   ├── Mujer2.png
│   ├── Mujer3.png
│   ├── Mujer4.png
│   ├── Mujer5.png
│   ├── logo-swapp.webp
│   ├── slide1.png
│   ├── slide2.jpg
│   ├── slide3.png
│   ├── swapp sin fondo.webp
│   └── swapp-profile.png
├── render.yaml
├── rest
│   ├── categorias.http
│   ├── habilidades.http
│   ├── intercambios.http
│   ├── mensajes.http
│   ├── puntuaciones.http
│   └── usuarios.http
├── scripts
│   └── generate_diagram.py
└── vite.config.js

```


## 🚀 Sitio web
El sitio web está desplegado en la plataforma `https://render.com/`, y el enlace
de este proyecto es el siguiente:
[Swapp App](https://swapp-app.onrender.com)