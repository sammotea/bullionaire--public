import React 	from 'react';
import f 		from '../_helpers/formatter';

class AssetSnapshotSingle extends React.Component {
	
	render() {
		
		const { assetName, quantity, value, cost, proportionalValue } = this.props;
		const balance = value - cost;
		
		return (
		
			<>
			
				<h1>{ assetName } ({ f.percentify( proportionalValue ) })</h1>
				
				<h2>{ f.poundify( value ) } ({ quantity.toFixed( 2 ) }kg)</h2>
								
				<ul>
				
					<li>{ f.poundify( cost ) } spent at an average of { f.poundify( cost / quantity ) }/kg</li>
					<li>
						{ f.poundify( balance ) }
						{ balance >= 0 ? ' profit (+' : ' loss (' }
						{ f.percentify( balance / cost ) })
					</li>
				
				</ul>
				
			</>
			
		)
		
	}
	
}

export default AssetSnapshotSingle;