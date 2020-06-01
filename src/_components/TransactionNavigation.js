import React from 'react'

class TransactionNavigation extends React.Component {

	render() {
		
		const 	{ assets, periods, selectionHandler } = this.props;
		const 	actions = [ 'buy', 'sell' ];
		
		const 	variables = {
					'actions'	:	actions,
					'assets'	:	assets,
					'periods'	:	periods,
				};
		
		const	userSelections	=	[];
		
		for( const v in variables ) {
						
			const options 		= [];
			const currentValue 	= this.props[ 'show' + v.charAt(0).toUpperCase() + v.slice(1) ];
			let conj, optionName;
						
			switch( v ) {
				
				case 'periods'	:
				conj = ' for '; break;
				
				case 'assets'	:
				conj = ' of '; break;
				
			}
			
			options.push( <option key="all" value="all">All { v }</option> );
			
			variables[ v ].forEach( o => {
				
				if( v === 'actions' ) {
					optionName = ( o === 'buy' ? 'purchases' : 'sales' );
				} else {
					optionName = o;
				}
				
				options.push( <option key={ o } value={ o }>
					{ optionName }
				</option> );
				
			});
			
			if( conj ) {
				userSelections.push(
					<span key={ conj }>{ conj }</span>
				);
			}
			
			userSelections.push(
				<select key={ v } id={ v } onChange={ selectionHandler } value={ currentValue }>
					{ options }
				</select>
			);
			
		}
		
		return(
			<div>
				
				Showing { userSelections }
			
			</div>
		)
	}

}

export default TransactionNavigation;