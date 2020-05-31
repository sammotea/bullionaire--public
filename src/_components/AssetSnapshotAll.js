import React from 'react';
import AssetSnapshotSingle from '../_components/AssetSnapshotSingle';

class AssetSnapshotAll extends React.Component {
	
	render() {
		
		const snapshots		=	[];
				
		if( this.props.aum ) {
			
			const aumByAsset	=	this.props.aum.byAsset;
			const totalValue	=	this.props.aum.total.value;
			
		
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
					/>
				);
				
			}
		
		}
				
		return (
		
			<>
				
				{ snapshots }
			
			</>
			
		)
		
	}
	
}

export default AssetSnapshotAll;