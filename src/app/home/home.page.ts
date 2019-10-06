import { Component } from '@angular/core';
import { isNumber } from 'util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //ARREGLO DE OBJETOS PARA LOS BOTONES DE OPERACIONES
  grupoDeOperaciones = [
    {
      title: 'CE',
      class: 'botonesOperaciones cancelar',
    }, {
      title: '÷',
      class: 'botonesOperaciones div',
    }, {
      title: 'x',
      class: 'botonesOperaciones multi',
    }, {
      title: '-',
      class: 'botonesOperaciones menos',
    }, {
      title: '+',
      class: 'botonesOperaciones mas',
    }
  ];

  //ARREGLO DE OBJETOS PARA LOS BOTONES DE NUMEROS
  grupoDeNumeros = [
    [
      {
        title: 7,
        class: 'botonesNumeros'
      }, {
        title: 4,
        class: 'botonesNumeros'
      }, {
        title: 1,
        class: 'botonesNumeros'
      }, {
        title: '.',
        class: 'botonesNumeros punto'
      }
    ], [
      {
        title: 8,
        class: 'botonesNumeros'
      }, {
        title: 5,
        class: 'botonesNumeros'
      }, {
        title: 2,
        class: 'botonesNumeros'
      }, {
        title: 0,
        class: 'botonesNumeros'
      }
    ], [
      {
        title: 9,
        class: 'botonesNumeros'
      }, {
        title: 6,
        class: 'botonesNumeros'
      }, {
        title: 3,
        class: 'botonesNumeros'
      }, {
        title: '=',
        class: 'botonesNumeros igual'
      }
    ]
  ];

  //VARIABLES BOOLEANAS
  entrada = true;
  calcOPaypal = false;
  invertirCalc = false;
  paypalActivo = false;

  //VARIABLES PARA INFORMACION DE PANTALLA
  pantalaEentrada = '';
  pantallaTax = '';
  pantallaSalida = '';

  //VARIABLES PARA CALCULOS
  num = 0;
  valorViejo: any = 0;
  valor: any = 0;
  ultimoOperador: any = '';
  tax: any;
  resultadoPaypal: any = '';

  //ACTIVAR CALCULADORA DE PAYPAL
  activarCalcPAypal() {
    this.paypalActivo = true;
    if (this.calcOPaypal) {
      this.pantalaEentrada = 'Monto a recibir: ';
      this.pantallaTax = 'TAX: ';
      this.pantallaSalida = 'Monto a enviar: ';
      this.resultadoPaypal = 0;
      this.tax = 0;
    } else {
      this.pantalaEentrada = '';
      this.pantallaTax = '';
      this.pantallaSalida = '';
      this.resultadoPaypal = '';
      this.tax = '';
      this.valor = 0;
      this.paypalActivo = false;
      this.invertirCalc = false;
    }
  }

  //INVERTIR CALCULO DE PAYPAL
  invertirCalculo() {
    if (this.paypalActivo) {
      if (this.invertirCalc) {
        this.pantalaEentrada = 'Monto a enviar: ';
        this.pantallaTax = 'TAX: ';
        this.pantallaSalida = 'Monto a recibir: ';
        this.valor = 0;
        this.tax = 0;
        this.resultadoPaypal = 0;
        this.entrada = true;
      } else {
        this.pantalaEentrada = 'Monto a recibir: ';
        this.pantallaTax = 'TAX: ';
        this.pantallaSalida = 'Monto a enviar: ';
        this.valor = 0;
        this.tax = 0;
        this.resultadoPaypal = 0;
        this.entrada = true;
      }
    }
  }

  //ACCION AL HACER CLICK EN BOTON
  clickNumero(boton: any) {

    if (this.calcOPaypal == false) { //VERIFICA SI LA OPCION CALCULAR PAYPAL ESTA ACTIVA

      if (isNumber(boton) || boton == '+' || boton == '-' || boton == 'x' || boton == '÷' || boton =='.') { //HACER HISTORIAL DE LOS CALCULOS
        parseFloat(this.resultadoPaypal)
        this.resultadoPaypal += boton
      }

      if (isNumber(boton) || boton === '.') { //VERIFICA SI SE PRECIONO UN NUMERO O EL PUNTO
        if (this.entrada || this.valor == 0) {
          this.valor = '' + boton;
        } else {
          this.valor += '' + boton;
        }

        this.entrada = false;

      } else { //SI NO ES UN NUMERO
        if (boton === 'CE') { //VERIFICA SI SE PRECIONO EL BOTON BORRAR
          if (!this.calcOPaypal) { //BORRA LO QUE ESTE EN PANTALLA
            this.valor = 0;
            this.entrada = true;
            this.resultadoPaypal = '';
          } else { //BORRA LO QUE ESTE EN PANTALLA
            this.valor = 0;
            this.tax = 0;
            this.resultadoPaypal = 0;
            this.entrada = true;
          }
        } else {
          if (boton === '=' && this.valorViejo != undefined) { //VERIFICA SI SE PRESIONO EL BOTON DE IGUAL
            if (this.ultimoOperador === 'x') { //SI ES MULTIPLICACION HACE ESTO:
              this.valor = '' + (parseFloat(this.valorViejo) * parseFloat(this.valor));
            } else {
              if (this.ultimoOperador === '÷') { //SI ES DIVISION HACE ESTO:
                this.valor = (parseFloat(this.valorViejo) / parseFloat(this.valor));
                let decimal = (this.valor % 1 === 0) ? true : false //VERIFICA SI EL VALOR ES DECIMAL
                if (decimal == false) {// SI ES DECIMAL LE APLICA 2 DECIMALES
                  this.valor = '' + this.valor.toFixed(2);
                }
              } else {
                if (this.ultimoOperador === '-') { //SI ES RESTA HACE ESTO:
                  this.valor = '' + (parseFloat(this.valorViejo) - parseFloat(this.valor));
                } else {
                  if (this.ultimoOperador === '+') { //SI ES SUMA HACE ESTO:
                    this.valor = '' + (parseFloat(this.valorViejo) + parseFloat(this.valor));
                  }
                }
              }
            }
          } else {
            this.entrada = true;
            this.valorViejo = this.valor;
            this.ultimoOperador = boton;
          }
        }
      }
    } else { //SI EL BOTON DE PAYPAL ESTA ACTIVO ENTRA ACA

      if (isNumber(boton) || boton === ".") { //VERIFICA SI SE PRECIONO UN NUMERO
        if (this.valor == 0) {
          this.valor = '' + boton;
        } else {
          this.valor += '' + boton;
        }

        this.entrada = false;

      } else {
        if (boton === 'CE') {//BORRA AL PRESIONAR EL BOTON CANCELAR
          this.valor = 0;
          this.tax = 0;
          this.resultadoPaypal = 0;
          this.entrada = true;
        } else {
          if (boton === '=') { //SI PRESIONA EL BOTON IGUAL 
            if (this.invertirCalc) { //SI ESTA ACTIVO INVERTIR CALCULO
              this.tax = '' + ((parseFloat(this.valor) * 0.054) + 0.30).toFixed(2);
              this.resultadoPaypal = '' + (parseFloat(this.valor) - parseFloat(this.tax)).toFixed(2);
            } else { //CALCULO POR QUE SE REALIZA DEFECTO
              this.resultadoPaypal = '' + (((parseFloat(this.valor) + 0.3) / 94.6) * 100).toFixed(2); //MUESTRA DE RESULTADO
              this.tax = '' + (parseFloat(this.resultadoPaypal) - parseFloat(this.valor)).toFixed(2); //MUESTRA PROCENTAJE QUE TE COBRAN
            }

            this.valor = '$ ' + this.valor; //MUESTRA DE RESULTADOS
            this.tax = '$ ' + this.tax; //MUESTRA PROCENTAJE QUE TE COBRAN
            this.resultadoPaypal = '$ ' + this.resultadoPaypal; //MUESTRA DE RESULTADO

          } else {
            this.entrada = true;
            this.valorViejo = this.valor;
            this.ultimoOperador = boton;
          }
        }
      }
    }
  }
}
