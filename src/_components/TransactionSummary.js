import React 	from 'react';
import f 		from '../_helpers/formatter';

class TransactionSummary extends React.Component {

	render() {
		
		const { showPeriods, showAssets, showActions } = this.props;
		const { transactionsByYear, transactionsByAsset } = this.props;
		let selectedTransactions = 	( showPeriods !== 'all' )
										? transactionsByYear[ showPeriods ][ 'byAsset' ]
										: transactionsByAsset;
										
		let purchases, sales;
		purchases = sales = 0;
		
		if( showAssets !== 'all' ) {
						
			if( showPeriods === 'all' ) {
				selectedTransactions = selectedTransactions[ showAssets ][ 'raw' ];
			} else {
				selectedTransactions = selectedTransactions[ showAssets ]
			}
			
			
		} else {
						
			let mergedAssets	=	[];
			
			for( const asset in selectedTransactions ) {
				
				if( showPeriods === 'all' ) {			
					mergedAssets = mergedAssets.concat( selectedTransactions[ asset ][ 'raw' ] );
				} else {
					mergedAssets = mergedAssets.concat( selectedTransactions[ asset ] );
				}
				
			}
						
			selectedTransactions = mergedAssets;
						
		}
		
		if( selectedTransactions ) {
			selectedTransactions.forEach( t => {
				
				if( showActions !== 'all' && t.action !== showActions ) return;
				
				if( t.action === 'buy' ) {
					purchases += t.cost;
				} else {
					sales -= t.cost;
				}
				
			});
		}
		
		return(
			<>
				{ purchases > 0 && 'Bought ' + f.poundify( purchases ) }
				
				{ purchases > 0 && sales > 0 && ' / ' }
				
				{ sales > 0 && 'Sold ' + f.poundify( sales ) }
			
			</>
		)
	}

}

export default TransactionSummary;