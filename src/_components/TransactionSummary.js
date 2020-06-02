import React 	from 'react';
import f 		from '../_helpers/formatter';

class TransactionSummary extends React.Component {
	
	getTransactionsArray( transactionsObj ) {
		
		/***
		****	transactionsByYear and transactionsByAsset
		****	have a nested structure that groups transactions
		****	by both a category (e.g. ByYear = { '2017 : [] })
		****	and as an unordered list ( raw = [] )
		***/
		
		if( !transactionsObj ) return false;
		
		return 	Array.isArray( transactionsObj )
					?	transactionsObj
					:	transactionsObj[ 'raw' ];
		
	}
	
	mergeTransactionsByAsset( transactions ) {
	
		let mergedAssets	=	[];
			
		for( const asset in transactions ) {
			
			mergedAssets =
				mergedAssets.concat(
					this.getTransactionsArray( transactions[ asset ] )
				);
			
		}
							
		return mergedAssets;
		
	}
	
	filterTransactions() {
		
		const { showPeriods, showAssets, showActions } = this.props;
		const transactions	= 	( showPeriods === 'all' )
									? this.props.transactionsByAsset
									: this.props.transactionsByYear[ showPeriods ][ 'byAsset' ];
		let filteredTransactions;
				
		if( showAssets === 'all' ) {
			
			filteredTransactions = this.mergeTransactionsByAsset( transactions );
						
		} else {
			
			filteredTransactions = this.getTransactionsArray( transactions[ showAssets ] );
						
		}
		
		return filteredTransactions;
		
	}
	
	render() {								
		
		const filteredTransactions = this.filterTransactions();
		let purchases, sales;
				
		if( filteredTransactions ) {
		
			purchases = sales = 0;
		
			filteredTransactions.forEach( t => {
								
				if( this.props.showActions !== 'all' && t.action !== this.props.showActions ) return;
				
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