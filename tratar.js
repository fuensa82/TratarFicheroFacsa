var fs = require("fs");
var _ = require("underscore");

var ficheroDesc={
  ORDEN:[
    {tam:3,desc:"CODTRI"},
    {tam:4,desc:"EJERCI"},
    {tam:2,desc:"PERIOD"},
    {tam:6,desc:"NUMREC"},
    {tam:20,desc:"DNICIF"},
    {tam:50,desc:"NOMBRE"},
    {tam:5,desc:"TIPVIA"},
    {tam:25,desc:"DESVIA"},
    {tam:5,desc:"NUMVIA"},
    {tam:25,desc:"MASINF"},
    {tam:5,desc:"CODPOS"},
    {tam:25,desc:"LOCALI"},
    {tam:25,desc:"PROVIN"},
    {tam:1,desc:"SIGNOREC"},
    {tam:12,desc:"IMPREC"},
    {tam:2,desc:"ESTADO"},
    {tam:8,desc:"FECEST"},
    {tam:30,desc:"VARIA1"},
    {tam:30,desc:"VARIA2"},
    {tam:30,desc:"VARIA3"},
    {tam:30,desc:"VARIA4"},
    {tam:30,desc:"VARIA5"},
    {tam:30,desc:"VARIA6"},
    {tam:4,desc:"CPTO01"},
    {tam:1,desc:"SIGNO01"},
    {tam:12,desc:"BASE01"},
    {tam:12,desc:"IVA01"},
    {tam:4,desc:"CPTO02"},
    {tam:1,desc:"SIGNO02"},
    {tam:12,desc:"BASE02"},
    {tam:12,desc:"IVA02"},
    {tam:4,desc:"CPTO03"},
    {tam:1,desc:"SIGNO03"},
    {tam:12,desc:"BASE03"},
    {tam:12,desc:"IVA03"},
    {tam:4,desc:"CPTO04"},
    {tam:1,desc:"SIGNO04"},
    {tam:12,desc:"BASE04"},
    {tam:12,desc:"IVA04"},
    {tam:4,desc:"CPTO05"},
    {tam:1,desc:"SIGNO05"},
    {tam:12,desc:"BASE05"},
    {tam:12,desc:"IVA05"},
    {tam:4,desc:"CPTO06"},
    {tam:1,desc:"SIGNO06"},
    {tam:12,desc:"BASE06"},
    {tam:12,desc:"IVA06"},
    {tam:4,desc:"CPTO07"},
    {tam:1,desc:"SIGNO07"},
    {tam:12,desc:"BASE07"},
    {tam:12,desc:"IVA07"},
    {tam:4,desc:"CPTO08"},
    {tam:1,desc:"SIGNO08"},
    {tam:12,desc:"BASE08"},
    {tam:12,desc:"IVA08"},
    {tam:4,desc:"CPTO09"},
    {tam:1,desc:"SIGNO09"},
    {tam:12,desc:"BASE09"},
    {tam:12,desc:"IVA09"},
    {tam:4,desc:"CPTO10"},
    {tam:1,desc:"SIGNO10"},
    {tam:12,desc:"BASE10"},
    {tam:12,desc:"IVA10"},
    {tam:1,desc:"SIGNONOR"},
    {tam:12,desc:"TOTALBASENO"},
    {tam:12,desc:"TOTALIVANOR"},
    {tam:1,desc:"SIGNOBAJ"},
    {tam:12,desc:"TOTALBASEBA"},
    {tam:12,desc:"TOTALIVABAJ"},
    {tam:1,desc:"SIGNONOR"},
    {tam:12,desc:"TOTALBASENA"},
    {tam:12,desc:"TOTALIVANAP"}
  ]
}
var numConceptos=10; //numero de conceptos en el fichero de Facsa (puede cambiar).
var negativosFinal=0;
var totalLineasTratadas=0;

generarError("**************INICIO********************");
var ficheroCompleto=fs.readFileSync("fichero.txt","utf8").split("\n");

for (var j=0;j<ficheroCompleto.length;j++){

  var hayQueTratarLinea=false;
  var cadenaTratada=ficheroCompleto[j];
  for(var i=0;i<numConceptos;i++){
    var signo=cadenaTratada.substring(posIniFinTamNom("SIGNO"+(i<9?"0":"")+(i+1)).ini,posIniFinTamNom("SIGNO"+(i<9?"0":"")+(i+1)).fin);
    if (signo=="-"){
      hayQueTratarLinea=true;
    }
  }
  if(hayQueTratarLinea){
    cadenaTratada=arreglarLinea(cadenaTratada);
  }
  fs.appendFile("ficheroResult.txt", cadenaTratada, (err) => {
		if (err) {
			console.error(err);
			generarError("\nError en linea "+(j+1)+", recibo "+dameValorConcepto("NUMREC")+": "+err);
			return;
		};
	});

}
generarError("***********FIN resumen************");
generarError("Lineas tratadas: "+totalLineasTratadas);
generarError("Lineas que han quedado en negativo: "+negativosFinal);

/**
 * Genera un fichero ERROR.txt con el mensaje de error
 * @param {Mensaje de error} error 
 */
function generarError(error){ 

	fs.appendFile("Errores.txt", error+"\n", (err) => {
		if (err) {
			console.error(err);
			return;
		};
	});
	
}

/**
 * Funcion que devuelve en un objeto json la posicion inicial y final de un nombre de variable del fichero pasado
 * como argumento
 */
function posIniFinTamNom(nombreVariable){
  //console.log(nombreVariable);
  var ini=0;
  for(var i=0;i<ficheroDesc.ORDEN.length;i++){
    var item=ficheroDesc.ORDEN[i];
    if(nombreVariable==item.desc){
      return {ini:ini,fin:(ini+item.tam),tam:item.tam};
    }
    ini+=item.tam;
  }
}
  
/**
 * Recorre la cadena en busca del concepto 47 y se lo resta al concepto 29. Al final el concepto 47 desaparece
 * de la cadena y se reconstruye toda la línea para que quede con las especificaciones de GIA
 * @param {Cadena a arreglar} cadena 
 */
function arreglarLinea(cadena){

  var posNeg=damePosConcepto("-","SIGNO");
  var pos47=damePosConcepto("0047","CPTO");
  //comprobar que posNeg y pos47 son iguales.

  var importeNeg=parseInt(dameValorConcepto("BASE"+pos47));
  var ivaNeg=parseInt(dameValorConcepto("IVA"+pos47));
  console.log("Num recibo: "+dameValorConcepto("NUMREC"));
  console.log("Importes mal: "+importeNeg+"   "+ivaNeg);

  var pos29=damePosConcepto("0029","CPTO");
  var importeAgua=parseInt(dameValorConcepto("BASE"+pos29));
  var ivaAgua=parseInt(dameValorConcepto("IVA"+pos29));
  console.log("Iimportes agua: "+importeAgua+"   "+ivaAgua);

  var impTotalAgua=importeAgua-importeNeg;
  var impTotalIva=ivaAgua-ivaNeg;
  var signo=" "
  if(impTotalAgua<0){
    impTotalAgua=impTotalAgua*(-1);
    impTotalIva=impTotalIva*(-1);
    signo="-";
    negativosFinal++;
    generarError("El recibo "+dameValorConcepto("NUMREC"));
  }
  totalLineasTratadas++;
  console.log("Importe modificado: "+impTotalAgua+"   "+impTotalIva);
  var resultado="";
  if(parseInt(pos47)>parseInt(pos29)){
    resultado=cadena.substring(0,posIniFinTamNom("CPTO"+pos29).ini);
    resultado+="0029"+signo+rellenarIzq(impTotalAgua,posIniFinTamNom("BASE"+pos29).tam,"0");
    resultado+=rellenarIzq(impTotalIva,posIniFinTamNom("IVA"+pos29).tam,"0");
    resultado+=cadena.substring(posIniFinTamNom("IVA"+pos29).fin,posIniFinTamNom("CPTO"+pos47).ini);
    resultado+="0000 "+rellenarIzq(0,posIniFinTamNom("BASE"+pos47).tam,0)+""+rellenarIzq(0,posIniFinTamNom("IVA"+pos47).tam,0);
    resultado+=cadena.substring(posIniFinTamNom("IVA"+pos47).fin);
  }else{
    resultado=cadena.substring(0,posIniFinTamNom("CPTO"+pos47).ini);
    resultado+="0000 "+rellenarIzq(0,posIniFinTamNom("BASE"+pos47).tam,0)+""+rellenarIzq(0,posIniFinTamNom("IVA"+pos47).tam,0);
    resultado+=cadena.substring(posIniFinTamNom("IVA"+pos29).fin,posIniFinTamNom("CPTO"+pos47).ini);
    resultado+="0029"+signo+rellenarIzq(impTotalAgua,posIniFinTamNom("BASE"+pos29).tam,"0");
    resultado+=rellenarIzq(impTotalIva,posIniFinTamNom("IVA"+pos29).tam,"0");
    resultado+=cadena.substring(posIniFinTamNom("IVA"+pos29).fin);
  }
  console.log("Linea: "+resultado);
  return resultado;
 
}

/**
 * ¿Qué busco y donde lo busco, en qué campo? Devuelve en qué numero de concepto está el texto, con una alfanumerico de
 * dos caracteres (01, 09, 10, ...)
 * @param {*} texto valor que buscamos en el concepto
 * @param {*} nombreVal nombre del concepto que buscamos
 */
function damePosConcepto(texto,nombreVal){
  var pos="";
  for(var i=0;i<numConceptos;i++){
    var val=cadenaTratada.substring(posIniFinTamNom(nombreVal+(i<9?"0":"")+(i+1)).ini,posIniFinTamNom(nombreVal+(i<9?"0":"")+(i+1)).fin);
    if (val==texto){
      pos=""+(i<9?"0":"")+(i+1);
    }
  }
  return pos;
}

function dameValorConcepto(nombreVal){
  var val=cadenaTratada.substring(posIniFinTamNom(nombreVal).ini,posIniFinTamNom(nombreVal).fin);
  return val;
}


function posIniInd(id){

}
/**
 * 
 * @param {Numero que se quiere rellenar por la izquierda} num 
 * @param {Cuanto medirá la cadena resultante} longitud 
 * @param {Caracter con el que se rellenará} relleno 
 */
function rellenarIzq(num, longitud, relleno){
	num=""+num;
	while(num.length<longitud){
		num=""+relleno+num;
	}
	return num;
}

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

