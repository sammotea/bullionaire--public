class Parser {
	
	/***
	****	Some Assumptions
	****
	****	1) raw transactions are already date-ordered
	****	2) All key / values are as expected
	****		-> There are no real checks or error reports if wrong
	***/
	
	rawTransactions			=	{};
	transactions			=	{};
	transactionsByYear		=	{};
	transactionByAsset		=	{};
	assetsUnderManagement	=	{};
	aumIsKnown				=	false;
	
	constructor( transactionsArray ) {
		
		const transactions = [ ...transactionsArray ];
		
		if( Array.isArray( transactions ) ) {
			
			let refinedTransactions		= 	this.mergeAndRefineTransactions( transactions );
			let categorisedTransactions	=	this.categoriseTransactions( refinedTransactions );
						
			this.rawTransactions 		= 	transactionsArray;
			this.transactions			=	refinedTransactions;
			this.transactionsByYear		=	categorisedTransactions[ 'byYear' ];
			this.transactionsByAsset	=	categorisedTransactions[ 'byAsset' ];
			
		} else {
			
			// error message
			
		}
		
	}
	
	mergeAndRefineTransactions( rawTransactions ) {
				
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
				
				//	Stage for merging if partial purchase
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
						
						previousTransaction = this.mergeTransactions( toMerge );
						
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
				
		const mergedTransaction	=	{ ...transactionArray[0] };

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
		
		const { amount, ...t } = transaction;
		
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
				
		const [ y, m, d ] = dateString.split( '-' );
		
		return new Date( y, ( m-1 ), d );
		
	}	
	
	removeAttributes( transaction ) {
		
		const { from, id, location, unit, ...t } = transaction;
		
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
	
	setAssetsUnderManagement( spotPrices ) {
				
		const allAssetsAccountedFor	=	this.checkHaveAllAssets( spotPrices );
				
		if( allAssetsAccountedFor ) {
			
			const assets	=	this.getAssetTypes();
			const aum	=	{
			
				'total'		:	{},
				'byAsset'	:	{}
				
			}		
						
			assets.forEach( asset => {
								
				aum[ 'byAsset' ][ asset ]	=	this.calculateAssetTotals( asset, spotPrices[ asset ] );
				
			});
						
			aum[ 'total' ] = this.calculateTotals( aum[ 'byAsset' ] );
			this.assetsUnderManagement = aum;
			this.aumIsKnown	=	true;
				
			return true;
			
		} else {
		
			 return false;
			 
		}
		
		
	}
	
	checkHaveAllAssets( spotPrices ) {
		
		const assets 		= this.getAssetTypes();
		let assetIsMissing	=	false;
		
		assets.forEach( asset => {
			
			if( !Number.parseFloat( spotPrices[ asset ] ) > 0 ) {
				
				assetIsMissing = true;
				
			}
		
		});
		
		return !assetIsMissing;
		
	}
	
	calculateAssetTotals( asset, spotPrice ) {
		
		const transactionsByAsset = this.getTransactionsByAsset( asset );
		const assetTotals	=	{
			'value'		: 	undefined,
			'cost'		:	0,
			'quantity'	:	0
		}
		
		transactionsByAsset.forEach( t => {
			
			assetTotals[ 'cost' ] 		+= t[ 'cost' ];
			assetTotals[ 'quantity' ]	+= t[ 'quantity' ];
			
		});
		
		assetTotals[ 'value' ] = spotPrice * assetTotals[ 'quantity' ];
		
		return assetTotals;
		
	}
	
	calculateTotals( assetTotals ) {
				
		const totals	=	{
			'value'	:	0,
			'cost'	:	0
		};
		
		for( let asset in assetTotals ) {
						
			totals[ 'value' ] 	+= assetTotals[ asset ][ 'value' ];
			totals[ 'cost' ] 	+= assetTotals[ asset ][ 'cost' ];
			
		}
		
		return totals;
		
	}
	
	getTransactions() {
		
		return this.transactions;
		
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
	
	getAssetTypes() {
		
		const transactionsByAsset = this.getTransactionsByAsset();
		
		return Object.keys( transactionsByAsset );
		
	}
	
	getTransactionPeriods() {
		
		const transactionsByYear = this.getTransactionsByYear();
		
		return Object.keys( transactionsByYear );
		
	}
	
	getAssetsUnderManagement() {
		
		if( !this.aumIsKnown ) return false;
		
		return this.assetsUnderManagement;
		
	}
	
	getCostOfAssetsUnderManagement( asset ) {
		
		if( !this.aumIsKnown ) return false;
		
		const aum = { ...this.assetsUnderManagement };
		
		if( asset ) {
		
			return aum[ 'byAsset' ][ 'asset' ][ 'cost' ];
			
		} else {
		
			return aum[ 'total' ][ 'cost' ];
			
		}
		
	}
	
	getValueOfAssetsUnderManagement( asset ) {
		
		if( !this.aumIsKnown ) return false;
		
		const aum = { ...this.assetsUnderManagement };
		
		if( asset ) {
			return aum[ 'byAsset' ][ 'asset' ][ 'value' ];
			
		} else {
		
			return aum[ 'total' ][ 'value' ];
			
		}
		
	}
	
	getQuantityOfAssetsUnderManagement( asset ) {		
		
		if( !this.aumIsKnown ) return false;
		
		const aum = { ...this.assetsUnderManagement };

		if( asset ) {
			
			return aum[ 'byAsset' ][ 'asset' ][ 'quantity' ];
		
		} else {
			
			const quantities = {}
			
			for( let asset in aum[ 'byAsset' ] ) {
				
				quantities[ asset ] = aum[ 'byAsset' ][ asset ][ 'quantity' ];
				
			}
			
			return quantities;
			
		}
		
	}
	
}

export default Parser;