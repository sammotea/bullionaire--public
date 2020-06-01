import React from 'react';
import TransactionListYearGroup from '../_components/TransactionListYearGroup';

class TransactionList extends React.Component {

	render() {

		const transactionsByYear 	= this.props.transactionsByYear;
		const yearGroups			=	[];
		
		for( const year in transactionsByYear ){
			
			yearGroups.push(
				<TransactionListYearGroup
					key={ year }
					transactions={ transactionsByYear[ year ][ 'raw' ] }
					year={ year }
				/>
			);
			
		} 
		
		yearGroups.reverse();
		
		return(
			<>
				{ yearGroups }
			</>
		)
	}

}

export default TransactionList;