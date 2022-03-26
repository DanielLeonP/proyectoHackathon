var express = require('express');
var router = express.Router();

router.get('/prueba', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  db.query('SELECT * FROM Medico',
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        res.send(results);
      }
    })

});

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.status(200);
  res.render('login.ejs', { validacion: 'C' });
});

router.get('/registro', function (req, res, next) {
  res.status(200);
  res.render('registro.ejs', { validacion: 'C' });
});

router.post('/registro', function (req, res, next) {
  let idUsuario = req.body.idUser
  let nombre = req.body.Nombre
  let apellido = req.body.Apellido
  let correo = req.body.email;
  let contrasena = req.body.password;
  let confirmarContrasena = req.body.confpassword
  //falta validar contraseña y mas datos para que no esten vacios
  sql = "INSERT INTO Paciente VALUES (" + idUsuario + ", '" + nombre + "', '" + apellido + "', '" + correo + "', '" + contrasena + "');";
  console.log(sql)
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        console.log(err);
        res.render('registro.ejs', { validacion: 'I' });
      } else {
        res.status(200);
        res.redirect('/menu');
      }
    })
});

router.post('/login', function (req, res, next) {
  let correo = req.body.email;
  let contrasena = req.body.password;
  console.log(correo + " y " + contrasena);
  sql = "SELECT * FROM Paciente WHERE CorreoPaciente = '" + correo + "' AND " + " ContrasenaPaciente = '" + contrasena + "';";
  console.log(sql)
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        if (results.length == 0) {
          res.status(400);
          res.render('login.ejs', { validacion: 'I' });
        } else {
          res.status(200);
          res.redirect('/menu');
        }
      }
    })
});


router.get('/menu', function (req, res, next) {
  res.render('Menu.ejs');
});

router.get('/alimetacion', function (req, res, next) {
  res.render('alimetacion.ejs');
});

router.get('/actividadFisica', function (req, res, next) {  
  res.render('actividadFisica.ejs');
});
router.get('/monitoreo', function (req, res, next) {
  res.render('monitoreo.ejs');
});
router.get('/estres', function (req, res, next) {
  res.render('estres.ejs');
});
router.get('/consejos', function (req, res, next) {
  res.render('consejos.ejs');
});
router.get('/consulta', function (req, res, next) {
  res.render('consulta.ejs');
});
router.get('/medico', function (req, res, next) {
  res.render('medico.ejs');
});
router.get('/informacionGeneral', function (req, res, next) {
  res.render('informacionGeneral.ejs');
});

module.exports = router;