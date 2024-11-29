## Prueba Técnica "Quickbet".

### Parte Backend

### Tecnologóas:
- Para realizar esta prueba se empleó el frameword basado en la arquitectura de Angular [Nest.js](https://nestjs.com/) 
- En la parte de Autorización decidí usar un Middware de [Supabase](https://supabase.com/) que usa [Supabase-JS](https://github.com/supabase/supabase-js) para la integración.
 
### Patrones y Arquitectura
- En la Autorización se una un patron [singleton](https://refactoring.guru/es/design-patterns/singleton)
- La Arquitectura se esta usando una variante de Screaming Architecture, pensando en la escalabilidad
 
### Instrucciones
- Clone el reposito de Github:
```console
$ git clone git@github.com:mariormolano/backend-challenge-base.git
```
- Ingrese a la carpeta 
```console
$ cd backend-challenge-base
```
- Ingrese a la rama develop
```console
$ git checkout develop
```
- Instale las dependencias
```console
$ npm i
```
- Cree o edita las variables de entorno en el archivo **.env**, use el archivo **.env.template** para guiarse
- Por ultimo inicie con el comando
```console
$ npm start
```
