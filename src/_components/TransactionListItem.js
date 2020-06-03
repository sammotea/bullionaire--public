import React 	from 'react';
import f 		from '../_helpers/formatter';

class TransactionListItem extends React.Component {

	render() {
		
		const { asset, cost, date, quantity, action } = this.props;
		
		return(
		
			<li className="[ c-transaction ]">
			
				<h1>
				
					<span>{ action } { asset }</span>
					<span>{ f.poundify( cost ) }</span>
					
				</h1>
				
				<small>
				
					{ f.kiloify( quantity ) } @ { f.poundify( cost / quantity ) }/kg on { date }
				
				</small>
			
			</li>
		)
	}
	
}

export default TransactionListItem;