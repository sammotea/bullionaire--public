import React from 'react';
import TransactionList from '../_components/TransactionList';

class Transactions extends React.Component {

	render() {
		
		const parser = this.props.transactionParser;
		
		return(
			
			<TransactionList
				transactionsByYear={ parser.getTransactionsByYear() }
			/>
			
		)
	}

}

export default Transactions;