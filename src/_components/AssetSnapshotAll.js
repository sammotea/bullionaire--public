import React 				from 'react';
import AssetSnapshotSingle 	from '../_components/AssetSnapshotSingle';

class AssetSnapshotAll extends React.Component {
	
	getSnapshots( aumObject ) {
		
		const snapshots		=	[];
		const aumByAsset	=	aumObject.byAsset;
		const totalValue	=	aumObject.total.value;
		
		console.log( this.props.spotPrices );
		for ( const asset in aumByAsset ) {
		
			const { value, cost, quantity } = aumByAsset[ asset ];
							
			snapshots.push( 
				<AssetSnapshotSingle
					key={ asset }
					assetName={ asset }
					quantity={ quantity }
					value={ value }
					cost={ cost }
					proportionalValue={ value / totalValue }
					spotPrice={ this.props.spotPrices[ asset ] }
				/>
			);
			
		}
		
		return snapshots;
		
	}
	
	render() {
		
		let snapshots;
				
		if( this.props.aum ) {
			
			snapshots	=	this.getSnapshots( this.props.aum );
		
		}
				
		return (
		
			<>
				
				{ snapshots }
			
			</>
			
		)
		
	}
	
}

export default AssetSnapshotAll;