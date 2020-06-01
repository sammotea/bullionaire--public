import React from 'react'
import TransactionListItem from '../_components/TransactionListItem';

class TransactionListYearGroup extends React.Component {

	render() {
		
		const { year, transactions, showAssets, showActions } 	= 	this.props;
		const transactionItems			=	[];
		const dFormatter				=	Intl.DateTimeFormat('en-US');	
		
		if( Array.isArray( transactions ) ) {
			
			transactions.forEach( t => {
				
				let { date, ...props } = t;
				
				if(
					( showAssets !== 'all' && showAssets !== t.asset ) ||
					( showActions !== 'all' && showActions !== t.action )
				) { return; }
				
				date = dFormatter.format( t.date );
				
				const id	=	t.asset + t.action + date;
				
				transactionItems.push(
					<TransactionListItem
						key={ id }
						date={ date }
						{ ...props }
					/>
				);
				
			});
		}
			
		return(
		
			<>
				
				{ transactionItems.length > 0 && <h1>{ year }</h1> }
				
				{ transactionItems.length > 0 && <ul>{ transactionItems }</ul> }
					
			</>
		
		)
	}

}

export default TransactionListYearGroup;