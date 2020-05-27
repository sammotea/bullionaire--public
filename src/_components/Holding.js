import React from 'react';

class Holding extends React.Component {
	
	render() {
		
		const { quantity, price, currentValue } = this.props.aum;
		const currentPrice	=	this.props.spotPrice;
		
		const totalValue = 29428.07;
		const percentage = ( currentValue / totalValue * 100 ).toFixed( 0 );
		
		const purchasePrice		=	price / quantity;
		const balance			=	quantity * ( currentPrice - purchasePrice );
		
		const numFormatter =	new Intl.NumberFormat( 'en-UK',  { style: 'currency', currency: 'GBP' } );
		
		
		return (
		
			<>
			
				<h1>{ this.props.type } ({ percentage }%)</h1>
				
				<h2>{ numFormatter.format( currentValue ) }</h2>
				
				<h3>{ quantity.toFixed( 2 ) }kg @ { numFormatter.format( currentPrice ) } / kg</h3>
				
				<ul>
				
					<li>{ numFormatter.format( price ) } spent at an average of  { numFormatter.format( purchasePrice ) }/kg</li>
					<li>
						{ numFormatter.format( balance ) }
						{ balance >= 0 ? ' profit (+' : ' loss (' }
						{ ( balance / price * 100 ).toFixed( 0 ) }
						%)
					</li>
				
				</ul>
				
			</>
			
		)
		
	}
	
}

export default Holding;