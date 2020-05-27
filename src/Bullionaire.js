import React from 'react';

import rawTransactions	from './json/transactions.json';
import fakeSpotPrices 	from './json/fake_bullion';

import Parser 			from './_helpers/transactionParser';

import Summary 			from './_components/Summary';
import Holdings 		from './_components/Holdings';
import Transactions 	from './_components/Transactions';



class Bullionaire extends React.Component {
	
	useBullionApi	=	false;
	bullionApi		=	'https://www.metals-api.com/api/latest?access_key=putumntqnjat4yrmbi7h3250wqviwmrgx8a83uwiznpg5y2jkl3yhsw91j22&base=GBP&symbols=XAU,XAG';
	
	constructor( props ) {
		super( props );
		
		this.parser = new Parser( rawTransactions.transactions );
		
		this.state	=	{

			transactions	:	{}
			
		}
				
	}
	
	componentDidMount() {
		
		this.setState({
			
			transactions	:	this.parser.getRefinedTransactions(),
						
		});
		
		if( this.useBullionApi ) {
		
			fetch( this.bullionApi )
				.then( res => res.json() )
				.then(
				
					( result ) => {
						
						this.statifyAumAndSpotPrices( result )
						
					}
				
				);
			
		} else {
			
			this.statifyAumAndSpotPrices( fakeSpotPrices )
			
		}

		
	}
	
	statifyAumAndSpotPrices( prices ) {
	
		const 	aum 		= this.parser.getTransactionSums();
		const	spotPrices	= this.transformSpotPrices( prices );
		
		for( let type in aum ) {
			
			if( type in spotPrices ) {
				
				aum[ type ][ 'currentValue' ] = aum[ type ][ 'quantity' ] * spotPrices[ type ];
				
			}
			
		}
									
		this.setState({
			spotPrices		:	spotPrices,
			aum				:	aum
		});
		
	}
	
	transformSpotPrices( spotPrices ) {
		
		if( spotPrices && spotPrices.rates ) {
		
			let transformedPrices	=	{};
			
			for( const type in spotPrices.rates ) {
				
				transformedPrices[ this.englishify( type ) ] = this.kiloify( spotPrices.rates[ type ], spotPrices.unit );
				
			}
						
			return transformedPrices;
			
		} else { return false; }
		
		
	}
	
	kiloify( amount, unit ) {
		
		switch( unit ) {
			
			case 'per ounce'	:
				amount = amount * 32.151;
			break;
			
			default :
				amount = false;
			
		}
		
		return amount;
		
	}
	
	englishify( name ) {
		
		switch( name ) {
			
			case 'XAG'	:
				name = 'silver'
				break;
				
			case 'XAU'	:
				name = 'gold';
				break;
			
		}
		
		return name;
	}
	
	
	render() {

		const { transactions, spotPrices, aum }	= 	this.state;
		
		console.log( this.state );
									
		return (
		
			<>
			
				<Transactions transactions={ transactions } />
			
				<Summary aum={ aum } />
				
				<Holdings aum={ aum } spotPrices={ spotPrices }/>
				
			
			</>
		
		);
				
	}
	
	
}



export default Bullionaire;