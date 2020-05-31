import React from 'react';

import rawTransactions	from './json/transactions.json';
import fakeSpotPrices 	from './json/fake_bullion';

import Parser			from './_helpers/parsers/transactionParser';
import SpotPriceParser	from './_helpers/parsers/spotPriceParser';

import Summary 			from './_components/Summary';
import AssetSnapshotAll from './_components/AssetSnapshotAll';
import Transactions 	from './_components/Transactions';



class Bullionaire extends React.Component {
	
	doTesting			=	false;
	
	useManualPrices		=	false;
	manualSpotPrices	=	{
		'gold'		:	5000,
		'silver'	:	30
	}
	useBullionApi		=	false;
	bullionApi			=	'https://www.metals-api.com/api/latest?access_key=putumntqnjat4yrmbi7h3250wqviwmrgx8a83uwiznpg5y2jkl3yhsw91j22&base=GBP&symbols=XAU,XAG';
	
	constructor( props ) {
		super( props );

		this.parser = new Parser( rawTransactions.transactions );
		
		this.state	=	{

			hasPrices	:	false
			
		}
				
	}
	
	componentDidMount() {
		
		this.setState({
			
			transactions	:	this.parser.getTransactions(),
						
		});
		
		if( this.useBullionApi ) {
		
			fetch( this.bullionApi )
				.then( res => res.json() )
				.then(
				
					( result ) => {
						
						const spotPrices = SpotPriceParser.transformSpotPriceObject( result );
						
						if( spotPrices ) {
							this.updateWithSpotPrices( spotPrices );
						}					
					}
				
				);
			
		} else {
			
			const spotPrices = 	this.useManualPrices
									? this.manualSpotPrices
									: SpotPriceParser.transformSpotPriceObject( fakeSpotPrices );
									
			this.updateWithSpotPrices( spotPrices );
						
		}

		
	}
	
	updateWithSpotPrices( spotPrices ) {
	
		if( spotPrices ) {
			this.parser.setAssetsUnderManagement( spotPrices );
										
			this.setState({
				hasPrices		:	true
			});
			
			this.runSomeHaphazardTests();
		}
		
	}
	
	runSomeHaphazardTests() {
		
		if( this.doTesting ) {
		
			[
				'getTransactions',
				'getTransactionsByYear',
				'getTransactionsByAsset',
				'getAssetTypes',
				'getCostOfAssetsUnderManagement',
				'getValueOfAssetsUnderManagement',
				'getQuantityOfAssetsUnderManagement'
				
			].forEach( fn => {
				
				console.log( '#############' );
				console.log( 'Testing Parser.' + fn + '()…' );
				console.log( this.parser[ fn ]() );
				console.log( '#############' );
				
			});
		
		}
		
	}
	
	render() {
													
		return (
		
			<>
						
				<Summary 
					totalValue={ this.parser.getValueOfAssetsUnderManagement() }
					totalCost={ this.parser.getCostOfAssetsUnderManagement() }
				/>
				
				<AssetSnapshotAll
					aum={ this.parser.getAssetsUnderManagement() }
				/>
				
			</>
		
		);
				
	}
	
	
}



export default Bullionaire;