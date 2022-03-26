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
  sql = "INSERT INTO Pacientes (nombre, apellido, correo, contrasena) VALUES ('" + nombre + "', '" + apellido + "', '" + correo + "', '" + contrasena + "');";
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
  //console.log(req.session.idUser + " y " + req.session.tipoUser);
  res.render('Menu.ejs');
});

router.get('/menu/alimentacion', function (req, res, next) {
  sql = `SELECT * FROM Alimentos WHERE IdAlimento IN (SELECT IdAlimento FROM AlimentosRecomendaciones WHERE IdRecomendacion IN (SELECT IdRecomendacion FROM SintomasRecomendaciones WHERE IdSintoma IN (SELECT IdSintoma FROM PacientesSintomas WHERE IdPaciente = ${req.session.idUser})));`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        console.log(results);
        res.status(200);
        res.render('alimentacion.ejs', { alimentos: results });
      }
    })
});

router.get('/menu/actividadFisica', function (req, res, next) {
  id = req.session.idUser
  console.log('ID del usuario' + id);
  sql = `SELECT * FROM ActividadesFisicas WHERE idActividad IN (SELECT idActividadFisica FROM PacientesActividadesFisicas WHERE idPaciente IN (SELECT idPaciente FROM Pacientes WHERE idPaciente = ${id}));`;
  //console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        console.log(results);
        res.status(200);
        res.render('actividadFisica.ejs', { ActividadesFisicas: results });
      }
    })
});
router.get('/menu/monitoreo', function (req, res, next) {
  //id = req.session.idUser
  sql = `SELECT * FROM Monitoreos WHERE idPaciente IN (SELECT idPaciente FROM Pacientes WHERE idPaciente = ${req.session.idUser});`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        //res.render('alimentacion.ejs', { alimentos: results });
        console.log(results);
        res.status(200);
        res.render('monitoreo.ejs', { Monitoreos: results });
      }
    })
});

router.get('/menu/recomendaciones', function (req, res, next) {
  id = req.session.idUser
  sql = `SELECT * FROM Recomendaciones WHERE idRecomendacion IN (SELECT idRecomendacion FROM SintomasRecomendaciones WHERE idSintoma IN (SELECT idSintoma FROM PacientesSintomas WHERE idPaciente = ${id}));`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        //res.render('alimentacion.ejs', { alimentos: results });
        console.log(results);
        res.render('recomendaciones.ejs', { Recomendaciones: results });
      }
    })
});
router.get('/menu/perfil', function (req, res, next) {
  //res.render('perfil.ejs');
  //id = req.session.idUser
  sql = `SELECT * FROM Enfermedades  WHERE IdEnfermedad IN (SELECT IdEnfermedad FROM EnfermedadesPacientes WHERE idPaciente = ${req.session.idUser});`;
  sql1 = `SELECT * FROM Pacientes WHERE idPaciente = ${req.session.idUser}`
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        db.query(sql1,
          function (err, results2, fields) {
            if (err) {
              throw err;
            } else {
              console.log(results, results2[0]);
              res.render('perfil.ejs', { EnfermedadesPaciente: results, Paciente: results2[0] });
            }
          })
      }
    })
});
router.get('/menu/masInformacion', function (req, res, next) {
  res.render('masInformacion.ejs');
});

router.get('/medico', function (req, res, next) {
  console.log(req.session.idUser + " y " + req.session.tipoUser);
  id = req.session.idUser;
  sql = `SELECT * FROM Pacientes WHERE idPaciente IN (SELECT idPaciente FROM Consultas WHERE idMedico = ${id});`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {

        console.log(results);
        res.render('medico.ejs', { Pacientes: results });
      }
    })
});
router.get('/medico/Paciente/:idPaciente', function (req, res, next) {
  var idPaciente = req.params.idPaciente;
  console.log(idPaciente);
  id = req.session.idUser
  sql = `SELECT * FROM Pacientes WHERE idPaciente = ${idPaciente};`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        sql2 = `SELECT * FROM Consultas WHERE idPaciente = ${idPaciente} AND idMedico = ${id};`;
        console.log(sql);
        db.query(sql2,
          function (err, results2, fields) {
            if (err) {
              throw err;
            } else {
              console.log(results);
              res.render('Paciente.ejs', { Paciente: results[0], Consultas: results2 });

            }
          })
      }
    })
});
router.get('/listaMedicos', function (req, res, next) {
  sql = `SELECT * FROM Medicos;`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        console.log(results);
        res.render('listaMedicos.ejs', { Medicos: results });
      }
    })
});

router.get('/listaMedicos/solicitar/:idMedico', function (req, res, next) {
  sql = `SELECT * FROM Medicos;`;
  console.log(sql);
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        throw err;
      } else {
        console.log(results);
        res.render('listaMedicos.ejs', { Medicos: results });
      }
    })
});

router.post('/listaMedicos/solicitar/:idMedico', function (req, res, next) {
  sql = `INSERT INTO Consultas (Fecha, descripcion, idPaciente, idMedico) VALUES (DATE(sysdate()), 'Solicitud de medico', ${req.session.idUser}, ${req.params.idMedico});`;
  console.log(sql)
  db.query(sql,
    function (err, results, fields) {
      if (err) {
        console.log(err);        
      } else {
        res.status(200);
        res.redirect('/menu');
      }
    })
});

module.exports = router;