import React 					from 'react';

import TransactionListYearGroup from '../_components/TransactionListYearGroup';

class TransactionList extends React.Component {
	
	getYearGroups() {
		
		const { transactionsByYear, showPeriods, showAssets, showActions } 	= this.props;
		const yearGroups =	[];
		
		for( const year in transactionsByYear ){
						
			if( showPeriods !== 'all' && showPeriods !== year ) continue;
			
			// latest first
			yearGroups.unshift(
				<TransactionListYearGroup
					key={ year }
					year={ year }
					transactions={ transactionsByYear[ year ][ 'raw' ] }
					showAssets={ showAssets }
					showActions={ showActions }
				/>
			);
			
		} 
		
		return yearGroups;
		
	}
	
	render() {

		const yearGroups = this.getYearGroups();
		
		return(
			
			<ul className="[ c-transactions__list c-transactions__list--yearGroups ]">
			
				{ yearGroups }
			
			</ul>
		)
	}

}

export default TransactionList;