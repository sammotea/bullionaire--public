import React 			from 'react';

import rawTransactions	from './json/realTransactions.json';

import Parser			from './_helpers/parsers/transactionParser';
import SpotPriceParser	from './_helpers/parsers/spotPriceParser';

import Summary 			from './_components/Summary';
import AssetSnapshotAll from './_components/AssetSnapshotAll';
import Transactions 	from './_components/Transactions';



class Bullionaire extends React.Component {
	
	useManualPrices		=	true;
	manualSpotPrices	=	{ // as of 03/01/2020
		'gold'		:	40095.88,
		'silver'	:	423.58
	}
	bullionApi			=	'https://www.metals-api.com/api/latest?access_key=putumntqnjat4yrmbi7h3250wqviwmrgx8a83uwiznpg5y2jkl3yhsw91j22&base=GBP&symbols=XAU,XAG';
	
	constructor( props ) {
		super( props );
		
		const transactions	=	this.pretendToParseExcelForTransactions();
		
		this.parser = new Parser( transactions );
		
		this.state	=	{

			hasPrices	:	false
			
		}
				
	}
	
	pretendToParseExcelForTransactions() {
		
		return rawTransactions.transactions;
		
	}
	
	componentDidMount() {
		
		this.setState({
			
			transactions	:	this.parser.getTransactions(),
						
		});
		
		// Only get 10 API calls a month, the snide bastards
		if( !this.useManualPrices ) {
			
			// Pending: No fail state
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
			
			const spotPrices = 	this.manualSpotPrices;
									
			this.updateWithSpotPrices( spotPrices );
						
		}

		
	}
	
	updateWithSpotPrices( spotPrices ) {
	
		if( spotPrices ) {
			this.parser.setAssetsUnderManagement( spotPrices );
										
			this.setState({
				hasPrices		:	true,
				spotPrices		:	spotPrices
			});
		}
		
	}
	
	render() {
													
		return (
		
			<>
				
				<section className="[ l-module | c-summary ]">
				
					<Summary 
						totalValue={ this.parser.getValueOfAssetsUnderManagement() }
						totalCost={ this.parser.getCostOfAssetsUnderManagement() }
					/>
				
				</section>
				
				<section className="[ l-module | c-assets ]">
				
					<AssetSnapshotAll
						aum={ this.parser.getAssetsUnderManagement() }
						spotPrices={ this.state.spotPrices }
					/>
				
				</section>
					
				<section className="[ l-module | c-transactions ]">
				
					<Transactions
						transactionParser={ this.parser } 
					/>
				
				</section>
				
			</>
		
		);
				
	}
	
	
}



export default Bullionaire;