class _Formatter {
			
	constructor() {
		
		this.defineFormatters();
		
	}
	
	defineFormatters() {
		
		this.currencyFormatter 	= 
			new Intl.NumberFormat( 'en-UK',  { style: 'currency', currency: 'GBP' } );
			
		this.dateFormatter		=
			new Intl.DateTimeFormat('en-US');
				
		
	}
	
	poundify( amount ) {
						
		return this.currencyFormatter.format( amount );
		
	}
	
	kiloify( number ) {
		
		return number.toFixed( 2 ) + 'kg';
		
	}
	
	percentify( number ) {
		
		return ( number.toFixed( 2 ) * 100 ) + '%';
	}
	
	datify( date ) {
	
		return this.dateFormatter.format( date );
	
	}
	
	showify( string ) {
		
		return 'show' + string.charAt(0).toUpperCase() + string.slice(1);
	}
	
}

const Formatter = new _Formatter();

export default Formatter;