FROM node:8

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Create app directory
WORKDIR /home/node/appMonitoring

# Copia el package.json package-lock.json en /home/node/my_node_app
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto donde corre la aplicación
EXPOSE 5002

# Copia los fuentes dentro del container
COPY . /home/node/appMonitoring/

# Crea un directorio donde se van a guardar datos de la aplicación
# VOLUME ["/home/node/appMonitoring"]
# Le da permisos al usuario node para escribir en /home/node/my_node_app
RUN chown -R node:users /home/node/appMonitoring

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "monitoringServer" ]

# Build image:
# docker build -t <monitoringImage> .
# Run container:
# docker run --net unqfynet --ip 172.20.0.23 -p 5002:5002 --name <monitoringContainer> --user node <monitoringImage>