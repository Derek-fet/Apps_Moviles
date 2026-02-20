import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component1',
  imports: [FormsModule, CommonModule],
  templateUrl: './component1.html',
  styleUrl: './component1.css',
})
export class Component1 {
  nombre: string = "Carlos";
  tarea: string = '';
  lista: string[] = [];

  cambiarnombre(){
    if(this.nombre == "Carlos"){
      this.nombre = "Juan";
    }else{
      this.nombre = "Carlos";
    }
  }

  agregar(){
    if(this.tarea.trim()){
      this.lista.push(this.tarea);
      this.tarea = '';
    }
  }
}
