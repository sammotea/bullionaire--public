import React from 'react';
import Holding from '../_components/Holding';

class Holdings extends React.Component {
	
	render() {
		
		const	{ aum, spotPrices } = this.props,
				holdings = [];
				
		for( const type in aum ) {
			
			console.log( aum[ type ] );
			
			holdings.push(
				<Holding
					key={ type }
					type={ type }
					aum={ aum[type] }
					spotPrice={ spotPrices[ type ] }
				/>
			)
			
		}
		
		
		return (
		
			<>
				
				{ holdings }
			
			</>
			
		)
		
	}
	
}

export default Holdings;