import React 					from 'react';
import f 						from '../_helpers/formatter';

import TransactionNavigation 	from '../_components/TransactionNavigation';
import TransactionSummary 		from '../_components/TransactionSummary';
import TransactionList 			from '../_components/TransactionList';


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
		
		newState[ f.showify( e.target.id ) ]  = e.target.value;
		
		this.setState( newState );
		
	}

	render() {
		
		const transactionParser = this.props.transactionParser;
				
		return(
			
			<>
			
				<h1>Transactions</h1>
			
				<TransactionNavigation
					assets={ transactionParser.getAssetTypes() }
					periods={ transactionParser.getTransactionPeriods() }
					selectionHandler={ this.handleUserSelection }
					{ ...this.state }
				/>
				
				<TransactionSummary
					transactionsByYear={ transactionParser.getTransactionsByYear() }
					transactionsByAsset={ transactionParser.getTransactionsByAsset() }
					{ ...this.state }
				/>
				
				<TransactionList
					transactionsByYear={ transactionParser.getTransactionsByYear() }
					{ ...this.state }
				/>
			
			</>
			
		)
	}

}

export default Transactions;