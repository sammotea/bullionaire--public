import React from 'react';
import TransactionListYearGroup from '../_components/TransactionListYearGroup';

class TransactionList extends React.Component {

	render() {

		const { transactionsByYear, showPeriods, showAssets, showActions } 	= this.props;
		const yearGroups =	[];
				
		for( const year in transactionsByYear ){
						
			if( showPeriods !== 'all' && showPeriods !== year ) continue;
				
			yearGroups.push(
				<TransactionListYearGroup
					key={ year }
					transactions={ transactionsByYear[ year ][ 'raw' ] }
					year={ year }
					showAssets={ showAssets }
					showActions={ showActions }
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