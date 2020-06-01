import React from 'react';
import TransactionNavigation from '../_components/TransactionNavigation';
import TransactionSummary from '../_components/TransactionSummary';
import TransactionList from '../_components/TransactionList';

class Transactions extends React.Component {
	
	constructor( props ) {
		super( props );
		
		this.state = {
			'showAssets'	:	'all',
			'showActions'	:	'all',
			'showPeriods'	:	'all'
		}
		
	}
	
	handleUserSelection = ( e ) => {
		
		let newState = {};
		
		newState[ 'show' + e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1) ] = e.target.value;
		
		this.setState( newState );
		
	}

	render() {
		
		const parser = this.props.transactionParser;
				
		return(
			
			<>
			
				<h1>Transactions</h1>
			
				<TransactionNavigation
					assets={ parser.getAssetTypes() }
					periods={ parser.getTransactionPeriods() }
					selectionHandler={ this.handleUserSelection }
					{ ...this.state }
				/>
				
				<TransactionSummary
					transactionsByYear={ parser.getTransactionsByYear() }
					transactionsByAsset={ parser.getTransactionsByAsset() }
					{ ...this.state }
				/>
				
				<TransactionList
					transactionsByYear={ parser.getTransactionsByYear() }
					{ ...this.state }
				/>
			
			</>
			
		)
	}

}

export default Transactions;