class _Formatter {
			
	constructor() {
		
		this.defineFormatters();
		
	}
	
	defineFormatters() {
		
		this.currencyFormatter = new Intl.NumberFormat( 'en-UK',  { style: 'currency', currency: 'GBP' } );
		
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
	
}

const Formatter = new _Formatter();

export default Formatter;