import React 				from 'react'
import f 					from '../_helpers/formatter';

import TransactionListItem 	from '../_components/TransactionListItem';

class TransactionListYearGroup extends React.Component {

	getTransactionListItems() {
		
		const { transactions, showAssets, showActions } 	= 	this.props;
		const transactionListItems	=	[];

		if( Array.isArray( transactions ) ) {
			
			transactions.forEach( t => {
					
				if(
					( showAssets !== 'all' && showAssets !== t.asset ) ||
					( showActions !== 'all' && showActions !== t.action )
				) { return; }
				
				let { date, ...props }  = t;	
				let id;
				
				date 	= 	f.datify( date );
				id 		=	t.asset + t.action + date;
				
				transactionListItems.push(
					<TransactionListItem
						key={ id }
						date={ date }
						{ ...props }
					/>
				);
				
			});
		}
		
		return transactionListItems;

	}

	render() {
		
		const transactionItems	=	this.getTransactionListItems();
		
		if( transactionItems.length <= 0 ) {
			
			return false;
			
		} else {
		
			return(
			
				<>
					
					<h1>{ this.props.year }</h1>
					
					<ul>{ transactionItems }</ul>
						
				</>
			
			)
			
		}
	}

}

export default TransactionListYearGroup;