const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const artigoEsquema = {
    titulo: String,
    conteudo: String
};

const Artigo = mongoose.model("Artigo", artigoEsquema);

app.route("/artigos")

.get(function (req, res) {
    Artigo.find(function (err, artigosAchados) {
        if (!err) {
            res.send(artigosAchados);
        } else {
            res.send(err);
        }  
    });
})

.post(function (req, res) {
    const novoArtigo = new Artigo({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo 
    });

    novoArtigo.save(function (err) {
        if (!err) {
            console.log("Novo artigo adicionado com sucesso!");
        } else {
            console.log(err);
        }
    });
})

.delete(function (req, res) {
    Artigo.deleteMany(function (err) {
        if (!err) {
            console.log("Todos artigos deletados com sucesso!");
        } else {
            console.log(err);
        }
    });
});

app.route("/artigos/:tituloArtigo")

.get(function (req, res) {

    Artigo.findOne({titulo: req.params.tituloArtigo}, function (err, artigosAchados) {
        if (artigosAchados) {
            res.send(artigosAchados)
        } else {
            res.send("Nenhum artigo achado com este titulo na base de dados!")
        }
    });
})

.put(function (req, res) {
    Artigo.updateOne(
        {
            titulo: req.params.tituloArtigo
        },
        {
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        },
        {
            overwrite: true
        },
        function (err) {
            if (!err) {
                res.send("Artigo atualizado com sucesso!")
            }
        }
    );
})

.patch(function (req, res) {
    Artigo.updateOne(
        {
            titulo: req.params.tituloArtigo
        },
        {
            $set: req.body
        },
        function (err) {
            if (!err) {
                res.send("Artigo atualizado com sucesso!");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function (req, res) {
    Artigo.deleteOne(
        {
            titulo: req.params.tituloArtigo
        },
        function (err) {
            if (!err) {
                res.send("Artigo deletado com sucesso!");
            } else {
                res.send(err);
            }
        }
    );    
});

app.listen(3000, function() {
  console.log("Servidor iniciou na porta 3000");
});