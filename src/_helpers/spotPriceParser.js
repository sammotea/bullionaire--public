class spotPriceParser {	
	
	static transformSpotPriceObject( spotPriceObject ) {
		
		let spo	=	{ ...spotPriceObject };
		
		if( spo && spo.rates ) {
		
			let transformedSpotPrices	=	{};
			
			for( const type in spo.rates ) {
				
				transformedSpotPrices
					[ this.englishifySpotPrices( type ) ]
						= this.kiloify( spo.rates[ type ], spo.unit );
				
			}
						
			return transformedSpotPrices;
			
		} else { return false; }
		
	}
	
	static kiloify( amount, unit ) {
		
		switch( unit ) {
			
			case 'per ounce'	:
				amount = amount * 32.151;
			break;
			
			default :
				amount = false;
			
		}
		
		return amount;
		
	}
	
	static englishifySpotPrices( name ) {
		
		switch( name ) {
			
			case 'XAG'	:
				name = 'silver'
				break;
				
			case 'XAU'	:
				name = 'gold';
				break;
			
		}
		
		return name;
	}
}

export default spotPriceParser;