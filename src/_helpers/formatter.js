class Formatter {
	
	static poundify( amount ) {
		
		const currencyFormatter = new Intl.NumberFormat( 'en-UK',  { style: 'currency', currency: 'GBP' } );
		
		return currencyFormatter.format( amount );

	}
	
	static percentify( number ) {
		
		return number.toFixed( 2 ) * 100;
	}
}

export default Formatter;