import React 	from 'react';
import f 		from '../_helpers/formatter';

class TransactionListItem extends React.Component {

	render() {
		
		const { asset, cost, date, quantity, action } = this.props;
		
		return(
			<li>
			
				<div style={ { 'textTransform' : 'uppercase', 'fontWeight' : 'bold' } }>{ action } { asset }, { f.poundify( cost ) }</div>
				
				<div>
				
					<small>{ quantity.toFixed( 2 ) }kg @ { f.poundify( cost / quantity ) }/kg on { date }</small>
				</div>
			
			</li>
		)
	}
	
}

export default TransactionListItem;