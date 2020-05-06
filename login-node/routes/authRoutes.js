const passport = require('passport')

module.exports = app => {
  // cuando el usuario concede permiso a nuestra aplicación, 
  // los servidores de google lo redireccionan a otro endPoint
  // entonces manejamos esa respuesta que viene con un código
  // en nuestro servidor usando passport
  app.get('/auth/google', passport.authenticate("google", {
    // le decimos a google que nos de datos de este usuario
    // podemos acceder a las imagenes que tiene en google drive
    // a la lista de contactos... son muchas cosas a las cuales
    // podemos acceder
    scope: ['profile', 'email']
  }))

  // manejamos la respuesta de los servidores de google después de que
  // el usuario conceda acceso a nuestra app
  app.get('/auth/google/callback', passport.authenticate("google"), (req, res) => {
    res.send('redireccionar');
    // res.redirect("/linkadonderedirecionar")
  })

  // para que el usuario pueda cerrar sesión
  app.get("/api/logout", (req, res) => {
    // res.send('deslogueando')
    req.logout();
    // res.send(req.user);
    res.redirect("/");
  });

  // probando el res del currentUser
  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
}