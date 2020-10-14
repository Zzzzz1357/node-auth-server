const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require("../middleware/check-auth");

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      login: req.body.login,
      fio: req.body.fio,
      phone: req.body.phone,
      password: hash,
      isVerify: false,
      passUpdate: false
    });

    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
});
router.put('/refresh-password', checkAuth, (req, res) => {
  User.findById({ _id: req.userData.userId})
    .then(user => {
      if (!user) {
        return res.send({
          message: "Ошибка: не найден пользователь!",
          isComplete: false
        });
      }
      bcrypt.compare(req.body.oldPass, user.password).then(result => {
        if (!result){
          return res.send({
            isComplete: false,
            message: "Был введен неверный пароль! Попробуйте еще раз"
          });
        }
        user
          .set('password', bcrypt.hashSync(req.body.newPass, 10))
          .set('passUpdate', true)
          .save()          
        res.send({
          isComplete: true,
          message: "Пароль успешно изменен!"
        });
      })
    })
    .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
});

router.put('/update', checkAuth, (req, res) => {

  bcrypt.hash(req.body.password, 10).then(hash => {
    const updateUser = {
      login: req.body.login,
      fio: req.body.fio,
      phone: req.body.phone,
      password: hash
    }
    User.findOneAndUpdate({ _id: req.userData.userId }, {$set: updateUser}, {new: true})
      .then(result => {
        res.status(201).json({
          message: "User updated!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
})

router.get('/getDataUser', checkAuth, (req, res) => {
  User.findById(req.userData.userId).then(result => {
    res.status(201).send(result);
  })
  .catch(err => {
    console.log(err);
      res.status(500).json({
        error: err
      });
    });
})

router.post("/login", (req, res, _next) => {
  let fetchedUser;
  User.findOne({ login: req.body.login })
    .then(user => {
      if (!user) {
        return res.send({
          message: "Пользователь не найден!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.send({
          message: "Ошибка: вы что-то сделали не так! попвторите попытку!"
        });
      }
      const token = jwt.sign(
        { login: fetchedUser.login, userId: fetchedUser._id },
        "abra_ca_dabra",
        { expiresIn: "1h" }
      );
      res.send({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      console.log(err);
      return res.send({
        error: err,
        message: "Авторизация не выполнена! Ошибка на стороне сервера!"
      });
    });
});

module.exports = router;
