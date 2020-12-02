var dbRef = firebase.database().ref("livros");

function cadastrar_usuario(){
    var email=document.getElementById("email").value;
    var password=document.getElementById("senha").value;
    var cpassword=document.getElementById("csenha").value;

    if(password == cpassword){
    firebase.auth().createUserWithEmailAndPassword(email,password).then(()=>{
    alert('cadastrado');
    location = 'signIn.html';
    }).catch((e)=>{
        console.log("SignIn: erro em entrar " + e);
        switch(e.code){
            case 'auth/email-already-in-use':
                alert(
                    'E-mail já está em uso'
                );
                break;

            case 'auth/operation-not-allowed':
                alert(
                    'Problema ao cadastrar usuário.'
                );
                break;

            case 'auth/weak-password':
                alert(
                    'Senha é fraca, por favor, digite uma senha forte.'
                );
                break;
        }
    });
    }
    else{
        alert('As senhas digitas são diferentes');
    }
}

function signIn(){
    var email=document.getElementById("email").value;
    var password=document.getElementById("senha").value;

    if(email != '' && password != '') {
        firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
            location = 'index.html';
        }).catch((e)=>{
            console.log("SignIn: erro em entrar " + e);
            switch(e.code){
                case 'auth/user-not-found':
                    alert(

                        'Usuário não cadastrado'
                    );
                    break;

                case 'auth/wrong-password':
                    alert(

                        'Erro na senha'
                    );
                    break;

                case 'auth/invalid-email':
                    alert(

                        'E-mail inválido'
                    );
                    break;

                case 'auth/user-disabled':
                alert(

                        'Usuário desabilitado'
                    );
                    break;
            }
        });
    }else {
        alert('Digite seu e-mail e senha');
    }
}

function signOut() {
    firebase.auth().signOut()
        .then(function() {
            location = 'signIn.html';
        }, function(error) {
            console.error( error );
        });
}

function cadastrar() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var titulo=document.getElementById("titulo").value;
            var descricao=document.getElementById("descricao").value;
            var autor=document.getElementById("autor").value;
            var ano=document.getElementById("ano").value;

            dbRef.push({
                titulo: titulo,
                descricao: descricao,
                autor: autor,
                ano:ano
            });

            alert("Cadastrado com sucesso");
        } else {
            alert("Logue no sistema para puder utilizar as suas funcionalidades");
            location = 'signIn.html';
        }
    });
}

function listar_titulo(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            dbRef.orderByChild("titulo").on("child_added", function(snapshot){
                console.log(snapshot);
                var tbody= document.getElementById("tabCorpo");
                var tr= document.createElement("tr");

                var td_ano= document.createElement("td");
                td_ano.innerHTML= snapshot.val().ano;
                tr.appendChild(td_ano);

                var td_autor= document.createElement("td");
                td_autor.innerHTML= snapshot.val().autor;
                tr.appendChild(td_autor);

                var td_descricao= document.createElement("td");
                td_descricao.innerHTML= snapshot.val().descricao;
                tr.appendChild(td_descricao);

                var td_titulo= document.createElement("td");
                td_titulo.innerHTML= snapshot.val().titulo;
                tr.appendChild(td_titulo);

                //criando o td do editar e o td do remover
                var tdE = document.createElement("td");
                var tdR = document.createElement("td");

                //variavel para identificar o livro que vai ser clicado para editar ou remover
                var chave = snapshot.key;

                //criando botão editar
                var buttonE = document.createElement("button");
                buttonE.innerHTML = "EDITAR";
                buttonE.setAttribute('id', chave);
                buttonE.setAttribute('value', chave);
                tdE.appendChild(buttonE);

                //criando botão remover
                var buttonR = document.createElement("button");
                buttonR.innerHTML = "REMOVER";
                tdR.appendChild(buttonR);

                //colocando o td do editar e o td do remover na tabela
                tr.appendChild(tdE);
                tr.appendChild(tdR);

                tbody.appendChild(tr); // acrescenta o tr com seu conteúdo no tbody

                //variavel auxiliar para saber qual div esconder - listar_ano ou listar_titulo
                var aux = 'lista_titulo';

                //chamando a função editar quando é clicado no botão
                buttonE.addEventListener("click", function(){
                    carrega_editar(chave, aux);

                });

                //chamando a função remover quando é clicado no botão
                buttonR.addEventListener("click", function(){
                    remover(chave);
                });

            }, function(error) {
                console.log("Error: " + error.code);
            });
        } else {
            dbRef.orderByChild("titulo").on("child_added", function(snapshot) {
                console.log(snapshot);
                var tbody = document.getElementById("tabCorpo");
                var tr = document.createElement("tr");

                var td_ano = document.createElement("td");
                td_ano.innerHTML = snapshot.val().ano;
                tr.appendChild(td_ano);

                var td_autor = document.createElement("td");
                td_autor.innerHTML = snapshot.val().autor;
                tr.appendChild(td_autor);

                var td_descricao = document.createElement("td");
                td_descricao.innerHTML = snapshot.val().descricao;
                tr.appendChild(td_descricao);

                var td_titulo = document.createElement("td");
                td_titulo.innerHTML = snapshot.val().titulo;
                tr.appendChild(td_titulo);

                document.getElementById("aCadastrar").style.display = 'none';

                var thEditar = document.getElementById("thEditar");
                thEditar.style.display = 'none';
                var thRemover = document.getElementById("thRemover");
                thRemover.style.display = 'none';

                tr.append(thEditar);
                tr.append(thRemover);

                var listarAno = document.getElementById("listarAno");
                listarAno.style.display = 'none';
                var listarTitulo = document.getElementById("listarTitulo");
                listarTitulo.style.display = 'none';

                var sair = document.getElementById("sair");
                sair.style.display = 'none';

                tr.append(listarAno);
                tr.append(listarTitulo);
                tr.append(sair);

                tbody.appendChild(tr); // acrescenta o tr com seu conteúdo no tbody;
            });
        }
    });
}


function listar_ano(){

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            dbRef.orderByChild("ano").on("child_added", function(snapshot){

                var tbody= document.getElementById("tabCorpo");
                var tr= document.createElement("tr");

                var td_ano= document.createElement("td");
                td_ano.innerHTML= snapshot.val().ano;
                tr.appendChild(td_ano);

                var td_autor= document.createElement("td");
                td_autor.innerHTML= snapshot.val().autor;
                tr.appendChild(td_autor);

                var td_descricao= document.createElement("td");
                td_descricao.innerHTML= snapshot.val().descricao;
                tr.appendChild(td_descricao);

                var td_titulo= document.createElement("td");
                td_titulo.innerHTML= snapshot.val().titulo;
                tr.appendChild(td_titulo);

                //criando o td do editar e o td do remover
                var tdE = document.createElement("td");
                var tdR = document.createElement("td");

                //variavel para identificar o livro que vai ser clicado para editar ou remover
                var chave = snapshot.key;

                //criando botão editar
                var buttonE = document.createElement("button");
                buttonE.innerHTML = "EDITAR";
                buttonE.setAttribute('id', chave);
                buttonE.setAttribute('value', chave);
                tdE.appendChild(buttonE);

                //criando botão remover
                var buttonR = document.createElement("button");
                buttonR.innerHTML = "REMOVER";
                tdR.appendChild(buttonR);

                //colocando o td do editar e o td do remover na tabela
                tr.appendChild(tdE);
                tr.appendChild(tdR);

                tbody.appendChild(tr); // acrescenta o tr com seu conteúdo no tbody

                //variavel auxiliar para saber qual div esconder - listar_ano ou listar_titulo
                var aux = 'lista_ano';

                //chamando a função editar quando é clicado no botão
                buttonE.addEventListener("click", function(){
                    carrega_editar(chave, aux);
                });

                //chamando a função remover quando é clicado no botão
                buttonR.addEventListener("click", function(){
                    remover(chave);
                });

            }, function(error) {
                console.log("Error: " + error.code);
            });
            console.log( user );
        } else {
            alert("Logue no sistema para puder utilizar as suas funcionalidades");
            location = 'signIn.html';
        }
    });
}

function carrega_editar(chave, aux){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById(aux).style.display = 'none';
            document.getElementById('editar').style.display = 'block';

            var dbRef = firebase.database().ref('livros').child(chave);

            dbRef.orderByValue().on('value', function(snapshot){
                document.getElementById('titulo').value = snapshot.val().titulo;
                document.getElementById('descricao').value = snapshot.val().descricao;
                document.getElementById('ano').value = snapshot.val().ano;
                document.getElementById('autor').value = snapshot.val().autor;
                document.getElementById('chave').value = chave;
            });
            console.log( user );
        } else {
            alert("Logue no sistema para puder utilizar as suas funcionalidades");
            location = 'signIn.html';
        }
    });
}


function editar(){

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var titulo = document.getElementById('titulo').value;
            var descricao = document.getElementById('descricao').value;
            var ano = document.getElementById('ano').value;
            var autor = document.getElementById('autor').value;
            var chave = document.getElementById('chave').value;

            var dbRef = firebase.database().ref('livros').child(chave);

            dbRef.update({
                "titulo": titulo,
                "descricao": descricao,
                "ano": ano,
                "autor": autor
            });

            alert('Editado com sucesso');
            location = 'listar.html';
            console.log( user );
        } else {
            alert("Logue no sistema para puder utilizar as suas funcionalidades");
            location = 'signIn.html';
        }
    });
}


function remover(chave){

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var dbRef = firebase.database().ref('livros').child(chave);
            dbRef.remove();

            alert('Removido com sucesso');
            location = 'listar.html';
        } else {
            alert("Logue no sistema para puder utilizar as suas funcionalidades");
            location = 'signIn.html';
        }
    });
}

