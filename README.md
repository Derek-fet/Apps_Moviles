<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form id="form_suma">
        <label>Numero 1</label>
        <input type="text" id="num1" placeholder="numero 1" required>
        <br>
        <label>Numero 2</label>
        <input type="text" id="num2" placeholder="numero 2" required>
        <br>
        <button type="button" onClick="sumar()">sumar</button>
    </form>    
        <p>resultado: <span id= "resultado"></span></p>

        <label>Tarea</label>
        <input type="text" id="tarea" placeholder="" required>
        <button type="button" onclick="agregar()">agregar</button>
      
        <h1>Lista</h1>
        <ul id="lista"></ul>


    <script>
        function sumar(){
            const n1 = Number(document.getElementById("num1").value);
            const n2 = Number(document.getElementById("num2").value);

            const suma = n1 + n2;

            document.getElementById("resultado").textContent = suma;
        }

        function agregar(){
            const tarea = document.getElementById('tarea').value;
            document.getElementById('lista').innerHTML += '<li>' + tarea + '</li>';
            document.getElementById('tarea').value = '';
        }

    </script>
