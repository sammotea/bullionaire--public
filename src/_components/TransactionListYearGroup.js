import React from 'react'
import TransactionListItem from '../_components/TransactionListItem';

class TransactionListYearGroup extends React.Component {

	render() {
		
		const { year, transactions } 	= 	this.props;
		const transactionItems			=	[];
		const dFormatter				=	Intl.DateTimeFormat('en-US');	
		
		if( Array.isArray( transactions ) ) {
			transactions.forEach( t => {
				
				let { date, ...props } = t;
				
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
		
			<div>
				
				<h1>{ year }</h1>
				
				<ul>
					
					{ transactionItems }
				
				</ul>
					
			</div>
		
		)
	}

}

export default TransactionListYearGroup;