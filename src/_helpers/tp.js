class tp {
	
	/***
	****	Some Assumptions
	****
	****	1) raw transactions are already date-ordered
	****	2) All key / values are as expected
	****		-> There are no real checks or error reports if wrong
	***/
	
	rawTransactions		=	{};
	transactions		=	{};
	transactionsByYear	=	{};
	transactionByAsset	=	{};
	
	constructor( transactionsArray ) {
		
		const transactions = [ ...transactionsArray ];
		
		if( Array.isArray( transactions ) ) {
			
			let refinedTransactions		= 	this.mergeAndRefineTransactions( transactions );
			let categorisedTransactions	=	this.categoriseTransactions( refinedTransactions );
						
			this.rawTransactions 		= 	transactionsArray;
			this.transactions			=	refinedTransactions;
			this.transactionsByYear		=	categorisedTransactions[ 'byYear' ];
			this.transactionsByAsset	=	categorisedTransactions[ 'byAsset' ];
			
			console.log( this.transactionsByYear );
			console.log( this.transactionsByAsset );
			
		} else {
			
			// error message
			
		}
		
		
		
	}
	
	getTransactions() {
		
		return this.transactions();
		
	}
	
	getTransactionsByYear( year = false, asset = false ) {
		
		const transactions	=	{ ...this.transactionsByYear };
		let result;
		
		if( year ) {
			
			if( asset ) {
				
				result = transactions[ year ][ 'byAsset' ][ asset ];
				
			} else {
				
				result = transactions[ year ][ 'raw' ];
				
			}
			
		} else {
			
			result = transactions;
			
		}
		
		return result;
		
	}
	
	getTransactionsByAsset( asset = false, year = false ) {
		
		const transactions	=	{ ...this.transactionsByAsset };
		let result;
		
		if( asset ) {
			
			if( year ) {
				
				result = transactions[ asset ][ 'byYear' ][ year ];
				
			} else {
				
				result = transactions[ asset ][ 'raw' ];
				
			}
			
		} else {
			
			result = transactions;
			
		}
		
		return result;
		
	}
	
	errorMessage( message ) {
		
		return ( message ? message : undefined );
				
	}
	
	mergeAndRefineTransactions( rawTransactions ) {
		
		console.log( rawTransactions );
		
				//	Need one extra for the merge loop
		const 	rawTransactionsPlusFiller	=	rawTransactions.concat( {} ),	
				refinedTransactions			=	[];
		
		let 	toMerge				=	[],
				shouldMerge			=	false,		
				previousTransaction	=	false;
						
		rawTransactionsPlusFiller.forEach( ( t, index ) => {
			
			let transaction = { ...t };
			
			/* First we merge like transactions */
			if( previousTransaction ) {
				
				//	Stage for merging
				if( t.date === previousTransaction.date &&
					t.action === previousTransaction.action &&
					t.asset === previousTransaction.asset
				) {
											
					shouldMerge = true;
					toMerge.push( previousTransaction );	
										
				} else {
					
					
					// Ready for merging
					if( shouldMerge === true ) {
						
						toMerge.push( previousTransaction );
						
						previousTransaction =	this.mergeTransactions( toMerge );
						
						refinedTransactions.push(
							this.refineTransaction( previousTransaction )
						);

						// reset
						toMerge		=	[];
						shouldMerge	=	false;
												
					} else {
						
						refinedTransactions.push(
							this.refineTransaction( previousTransaction )
						);
						
					}
					
				}
				
			}
				
			previousTransaction = transaction;
				
			
			
		});
		
		return refinedTransactions;
		
	}
	
	mergeTransactions( transactionArray ) {
				
		let mergedTransaction	=	{ ...transactionArray[0] };

		transactionArray.forEach( ( t, index ) => {
			
			[ 'cost', 'amount' ].forEach( v => {
				
				mergedTransaction[ v ] = ( index === 0 ) ?
					t[ v ] :
					mergedTransaction[ v ] + t[ v ];
					
			});
			
		});
		
		return mergedTransaction;
		
	}
	
	refineTransaction( transaction ) {
				
		transaction	= 	this.renameAttributes( transaction );
		transaction = 	this.typifyAttributes( transaction );
		transaction	=	this.removeAttributes( transaction );
		
		return transaction;
		
	}
	
	renameAttributes( transaction ) {
		
		let { amount, ...t } = transaction;
		
		t[ 'quantity' ] = 	amount;
		
		return t;
		
	}
	
	typifyAttributes( transaction ) {
		
		const sell = transaction.action === 'sell' ? true : false;
		
		transaction[ 'date' ] = this.convertToDate( transaction[ 'date' ] );
		
		[ 'quantity', 'cost' ].forEach( v => {
									
			transaction[ v ] = parseFloat( transaction[ v ] );
			
			// make sell orders negative
			if( sell ) {
				
				transaction[ v ] = -transaction[ v ];
				
			} 			
		});
		
		return transaction;
	}
	
	convertToDate( dateString ) {
		
		let d, m, y;
		
		[ y, m, d ] = dateString.split( '-' );
		
		return new Date( y, ( m-1 ), d );
		
	}	
	
	removeAttributes( transaction ) {
		
		let { from, id, location, unit, ...t } = transaction;
		
		return t;
		
	}
	
	categoriseTransactions( transactions ) {
		
	/***
	****
	****	categoriseTransaction object structure is:
	****
	****	{
	****
	****		'byYear'	:	{
	****			
	****			'2020'		:	{
	****				
	****				'byAsset'	:	{
	****					
	****					'assetOne'	:	[ {}{} ],
	****					
	****					'assetTwo'	:	[ {}{} ]
	****					
	****				}
	****				
	****				'raw'			:	[ {}{} ]
	****				
	****			}
	****			
	****		}
	****		
	****		'byAsset'	:	{
	****			
	****			'assetOne'		:	{
	****				
	****				'byYear'	:	{
	****					
	****					'2020'	:	[ {}{} ],
	****					
	****					'2019'	:	[ {}{} ]
	****					
	****				}
	****				
	****				'raw'			:	[ {}{} ]
	****				
	****			}
	****			
	****		}
	****		
	****	}
	****
	***/
		
		const categorisedTransactions	=	{
			
			'byYear'	:	{},
			'byAsset'	:	{}
			
		}
		
		transactions.forEach( t => {
		
			const 	asset	=	t.asset,
					year	=	t.date.getFullYear();			
						/***
			****	Make sure all these nested hierarchies exist (as arrays)
			****	so we can get our .push() on
			***/
			
			categorisedTransactions[ 'byYear' ][ year ]
				= 	categorisedTransactions[ 'byYear' ][ year ] ||
						{
							'byAsset'	:	{},
							'raw'		:	[]
						};
					
			categorisedTransactions[ 'byYear' ][ year ][ 'byAsset' ][ asset ]
				=	categorisedTransactions[ 'byYear' ][ year ][ 'byAsset' ][ asset ] ||
						[];
					
			categorisedTransactions[ 'byAsset' ][ asset ]
				= 	categorisedTransactions[ 'byAsset' ][ asset ] ||
						{
							'byYear'	:	{},
							'raw'		:	[]
						};
						
			categorisedTransactions[ 'byAsset' ][ asset ][ 'byYear' ][ year ]
				= 	categorisedTransactions[ 'byAsset' ][ asset ][ 'byYear' ][ year ] ||
						[];
			
			// Go, go, gadget!
			categorisedTransactions[ 'byYear' ][ year ][ 'raw' ].push( t );
			categorisedTransactions[ 'byAsset' ][ asset ][ 'raw' ].push( t );
			categorisedTransactions[ 'byYear' ][ year ][ 'byAsset' ][ asset ].push( t );
			categorisedTransactions[ 'byAsset' ][ asset ][ 'byYear' ][ year ].push( t );
		
		});
		
		return categorisedTransactions;
		
	}
	
}

export default tp;