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
  let nombre = req.body.Nombre
  let apellido = req.body.Apellido
  let correo = req.body.email;
  let contrasena = req.body.password;
  let confirmarContrasena = req.body.confpassword
  //falta validar contraseña y mas datos para que no esten vacios
  sql = "INSERT INTO Pacientes VALUES ('" + nombre + "', '" + apellido + "', '" + correo + "', '" + contrasena + "');";
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
router.get('/registroMedico', function (req, res, next) {
  res.status(200);
  res.render('registroMedico.ejs', { validacion: 'C' });
});
router.post('/registroMedico', function (req, res, next) {
  let nombre = req.body.Nombre
  let apellido = req.body.Apellido
  let correo = req.body.email;
  let contrasena = req.body.password;
  let confirmarContrasena = req.body.confpassword;
  let cedula = req.body.cedula;
  let especialidad = req.body.especialidad;
  //falta validar contraseña y mas datos para que no esten vacios
  sql = "INSERT INTO Medicos (nombre, apellido, correo, contrasena, cedulaProfesional, especialidad) VALUES ('" + nombre + "', '" + apellido + "', '" + correo + "', '" + contrasena + "', " + cedula + ", '" + especialidad + "');";
  console.log(sql)
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        console.log(err);
        res.render('registroMedico.ejs', { validacion: 'I' });
      } else {
        res.status(200);
        res.redirect('/medico');
      }
    })
});

router.post('/login', function (req, res, next) {
  let correo = req.body.email;
  let contrasena = req.body.password;
  console.log(correo + " y " + contrasena);
  sql = "SELECT * FROM Pacientes WHERE correo = '" + correo + "' AND " + " contrasena = '" + contrasena + "';";
  console.log(sql)
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        if (results.length == 0) {
          sql = "SELECT * FROM Medicos WHERE correo = '" + correo + "' AND " + " contrasena = '" + contrasena + "';";
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
                  req.session.idUser = results[0].idMedico;                 
                  req.session.tipoUser = "Medico";
                  res.status(200);
                  res.redirect('/medico');
                }
              }
            })
        } else {
          req.session.idUser = results[0].idPaciente; 
          req.session.tipoUser = "Paciente";
          res.status(200);
          res.redirect('/menu');
        }
      }
    })
});


router.get('/menu', function (req, res, next) {
  console.log(req.session.idUser + " y " + req.session.tipoUser);
  res.render('Menu.ejs');
});

router.get('/menu/alimentacion', function (req, res, next) {
  id = req.session.idUser
  res.render('alimentacion.ejs');
  sql = `SELECT * FROM Alimentos WHERE IdAlimento IN (SELECT IdAlimento FROM AlimentosRecomendaciones WHERE IdRecomendacion IN (SELECT IdRecomendacion FROM SintomasRecomendaciones WHERE IdSintoma IN (SELECT IdSintoma FROM PacientesSintomas WHERE IdPaciente = ${id})))`;  
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        res.render('alimentacion.ejs', { alimentos: results });
      }
    })
});

router.get('/menu/actividadFisica', function (req, res, next) {
  res.render('actividadFisica.ejs');
});
router.get('/menu/monitoreo', function (req, res, next) {
  res.render('monitoreo.ejs');
});

router.get('/menu/recomendaciones', function (req, res, next) {
  res.render('recomendaciones.ejs');
});
router.get('/menu/perfil', function (req, res, next) {
  res.render('perfil.ejs');
});
router.get('/menu/masInformacion', function (req, res, next) {
  res.render('masInformacion.ejs');
});
router.get('/medico', function (req, res, next) {
  console.log(req.session.idUser + " y " + req.session.tipoUser);
  res.render('medico.ejs');
});
router.get('/medico/consultas', function (req, res, next) {
  res.render('consultas.ejs');
});
router.get('/menu', function (req, res, next) {
  res.render('Menu.ejs');
});
router.get('/listaMedicos', function (req, res, next) {
  res.render('listaMedicos.ejs');
});

module.exports = router;