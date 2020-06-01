import React 	from 'react';
import f 		from '../_helpers/formatter';

class TransactionListItem extends React.Component {

	render() {
		
		const { asset, cost, date, quantity, action } = this.props;
		
		return(
			<li>
			
				<h1>{ action } { asset }, { f.poundify( cost ) }</h1>
				
				<div>{ quantity.toFixed( 2 ) }kg @ { f.poundify( cost / quantity ) }/kg on { date }</div>
			
			</li>
		)
	}
	
}

export default TransactionListItem;