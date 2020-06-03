import React 	from 'react';
import f 		from '../_helpers/formatter';

class Summary extends React.Component {
	
	render() {
		
		const { totalValue, totalCost } = this.props;
		
		if( !totalValue || !totalCost ) return false;
		
		const balance = totalValue - totalCost;
		const percDiff = f.percentify( balance / totalCost );
		
		return (
			<>
				
				<h1>
					{ f.poundify( totalValue ) }
				</h1>
						
				<h2>
					{ f.poundify( balance ) }
					{ balance > 0 ? ' profit' : ' loss' }
					{ ' ' }({ balance > 0 ? '+' + percDiff : percDiff })
				</h2>
				
			</>
		);
		
	}
	
}

export default Summary;