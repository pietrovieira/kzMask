import { Directive, HostListener, Input } from '@angular/core';
import { 
	NG_VALUE_ACCESSOR, ControlValueAccessor 
} from '@angular/forms';

@Directive({
	selector: '[kzMask]',
	providers: [{
		provide: NG_VALUE_ACCESSOR, 
		useExisting: KzMaskDirective, 
		multi: true 
	}]
})
export class KzMaskDirective implements ControlValueAccessor {
	
	onTouched: any;
	onChange: any;
	valorGuarda : any;
	
	@Input('kzMask') kzMask: string;
	
	writeValue(value: any): void {
		console.log("writeValue: ", value);
		this.valorGuarda = value;
	}
	
	registerOnChange(fn: any): void {
		// this.onChange = fn;
		console.log("registerOnChange: ", fn);
	}
	
	registerOnTouched(fn: any): void {
		// this.onTouched = fn;
	}
	
	@HostListener('keyup', ['$event']) 
	onKeyup($event: any) {
		var valor = $event.target.value.replace(/\D/g, '');
		var pad = this.kzMask.replace(/\D/g, '').replace(/9/g, '_');
		var valorMask = valor + pad.substring(0, pad.length - valor.length);
		
    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
    	this.writeValue(valor);
    	return;
    }
    
    if (valor.length <= pad.length) {
    	this.writeValue(valor);
    }
    
    var valorMaskPos = 0;
    valor = '';
    for (var i = 0; i < this.kzMask.length; i++) {
    	if (isNaN(parseInt(this.kzMask.charAt(i)))) {
    		valor += this.kzMask.charAt(i);
    	} else {
    		valor += valorMask[valorMaskPos++];
    	}
    }
    
    if (valor.indexOf('_') > -1) {
    	valor = valor.substr(0, valor.indexOf('_'));
    }

    console.log("valor: ", valor);
    
    $event.target.value = valor;
}

@HostListener('blur', ['$event']) 
onBlur($event: any) {

	let letters = '';
	for(var x = 0 ; x < this.kzMask.length ; x++ )
	{
		letters += $event.target.value[x];
	}

	setTimeout( () => {
		$event.target.value = letters;
	});
	
	if ($event.target.value.length === this.kzMask.length) {
		return;
	}

	console.log("leng", letters, $event.target.value.length, this.kzMask.length);
	this.writeValue('');
}
}