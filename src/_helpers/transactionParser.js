class transactionParser {
	
	rawTransactions		=	{};
	refinedTransactions	=	{};
	groupedTransactions	=	{};
	transactionSums		=	{};
	
	constructor( transactions ) {
		
		// store a copy
		this.rawTransactions = transactions;
		
		const refinedTransactions	=	{};
		
		if( Array.isArray( transactions ) ) {
			
			transactions.forEach( t => {
				
				let transaction = this.refineTransaction( t );
				
				const { type } = transaction;
				
				if( !refinedTransactions[ type ] ) {
					refinedTransactions[ type ] = [];
				}
					
				refinedTransactions[ type ].push( transaction );
				
			});
			
		}
				
		this.refinedTransactions 	= 	refinedTransactions;
		this.transactionSums		=	this.sumTransactions( refinedTransactions );
		this.groupedTransactions	=	this.groupTransactions( refinedTransactions );
	}
	
	sumTransactions( transactions ) {
		
		const transactionSums = {};
				
		for( let type in transactions ) {
			
			transactionSums[ type ] = {
				'quantity'	:	0,
				'price'		:	0
			};
			
			for( let v in transactionSums[ type ] ) {
								
				transactionSums[ type ][ v ]
					= transactions[ type ].reduce( function( accumulator, currentValue ) {
					
					return accumulator + currentValue[ v ];		
							
					}, 0);
				
			}
			
			
		}
		
		return transactionSums;
		
		
	}
	
	refineTransaction( transaction ) {
		
		transaction	= 	this.renameAttributes( transaction );
		transaction = 	this.typifyAttributes( transaction );
		transaction	=	this.removeAttributes( transaction );
		
		return transaction;
		
	}
	
	removeAttributes( transaction ) {
		
		let { from, id, location, action, unit, ...t } = transaction;
		
		return t;
		
	}
	
	renameAttributes( transaction ) {
		
		let { amount, asset, cost, ...t } = transaction;
		
		t[ 'quantity' ] = 	amount;
		t[ 'type' ]		=	asset;
		t[ 'price' ]	=	cost;
		
		return t;
		
	}
	
	typifyAttributes( transaction ) {
		
		const sell = transaction.action === 'sell' ? true : false;
		
		transaction[ 'date' ] = this.convertToDate( transaction[ 'date' ] );
		
		[ 'quantity', 'price' ].forEach( v => {
									
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
	
	groupTransactions( transactions ) {
		
		let groupedTransactions 	= 	{},
			is_group				=	false;
		
		let previousTransaction	= false;
		
		for( let type in transactions ) {
			
			let transactionGroup = [];
			
			groupedTransactions[ type ] = [];
			
			transactions[ type ].push( {} ); // need one extra for index loop
			
			transactions[ type ].forEach( ( t, index ) => {
				
				if( previousTransaction ) {
					
					//	This one is like the previous one so should be grouped
					if( t.date === previousTransaction.date && t.action === previousTransaction.action ) {
						is_group = true;
						transactionGroup.push( previousTransaction );
						
					} else {
						
						// The previous loop item is part of the last group
						if( is_group === true ) {
							
							// Add last one to group
							transactionGroup.push( previousTransaction );
							
							// Add group to all
							groupedTransactions[ type ].push( transactionGroup );
							
							// reset
							transactionGroup = [];
							is_group = false;
						
						} else {
							 	
							groupedTransactions[ type ].push( previousTransaction );
							
						}
						
					}
					
				}
				
				previousTransaction = t;
				
			});
			
		}
				 
		return groupedTransactions;
		
		
	}
	
	getGroupedTransactions( type = false ) {
		
		return type ? this.groupedTransactions[ type ] : this.groupedTransactions;
		
	}
	
	getRefinedTransactions() {
				
		return this.refinedTransactions;
	}

	getTransactionSums( type = false ) {
		
		return type ? this.transactionSums[ type ] : this.transactionSums;

	}
	
}

export default transactionParser;