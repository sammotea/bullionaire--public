import React from 'react';

class Summary extends React.Component {
	
	render() {
		
		const { aum } = this.props;
		
		let totalValue		=	0,
			totalPaid		=	0,
			balance			=	0,
			percDiff		=	false;
			
		const numFormatter =	new Intl.NumberFormat( 'en-UK',  { style: 'currency', currency: 'GBP' } );
						
		for( const type in aum ) {
			
			totalValue 	+= 	aum[ type ][ 'currentValue' ];
			totalPaid	+=	aum[ type ][ 'price' ];
			balance		+=	aum[ type ][ 'currentValue' ] - aum[ type ][ 'price' ];
								
		}
		
		percDiff	=	balance / totalPaid;
		percDiff	=	percDiff.toFixed( 2 ) * 100;
		
		return (
			<>
				
				<h1>
					Total: { numFormatter.format( totalValue ) }
				</h1>
								
				<h2>
					{ numFormatter.format( balance ) }
					{ balance > 0 ? ' profit' : ' loss' }
					{ ' ' }({ balance > 0 ? '+' + percDiff : percDiff }%)
				</h2>
				
			</>
		);
		
	}
	
}

export default Summary;