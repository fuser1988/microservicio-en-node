FROM node:8

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Create app directory
WORKDIR /home/node/appUNQfy

# Copia el package.json package-lock.json en /home/node/my_node_app
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto donde corre la aplicación
EXPOSE 5000

# Copia los fuentes dentro del container
COPY . /home/node/appUNQfy/

# Crea un directorio donde se van a guardar datos de la aplicación
VOLUME ["/home/node/appUNQfy"]

# Le da permisos al usuario node para escribir en /home/node/my_node_app
RUN chown -R node:users /home/node/appUNQfy

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "./serv/app" ]

# Build image:
# docker build -t <unqfyImage> .
# Run container:
# docker run --net unqfynet --ip 172.20.0.21 -p 5000:5000 -v $(pwd)/data:/home/node --name <unqfyContainer> --user node <unqfyImage>