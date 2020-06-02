import React 	from 'react'
import f 		from '../_helpers/formatter';

class TransactionNavigation extends React.Component {
	
	setOptionValue( option, selectID ) {
		
		return option;
		
	}
	
	setOptionName( option, selectID ) {
	
		switch( option ) {
			
			case 'buy'	:
				option = 'purchases';
				break;
				
			case 'sell'	:
				option = 'sales';
				break;
				
			case 'all'	:
				option = 'All ' + selectID;
				break;
				
		}
		
		return option;
	
	}
	
	getSelectOptions( optionsArray, selectID ) {
				
		const options 		=	[];
		const optionsLoop	=	optionsArray.concat( [ 'all' ] ); // Add a default selection
		
		optionsLoop.forEach( option => {
				
			const optionValue 	= this.setOptionValue( option, selectID );
			const optionName	= this.setOptionName( option, selectID );
			
			options.push(
				<option key={ optionValue } value={ optionValue }>
					{ optionName }
				</option>
			);
		
		});
		
		return options;
		
	}
	
	maybeAddConjunction( selectID ) {
		
		let conj;
		
		switch( selectID ) {
			
			case 'periods'	:
				conj = ' for '; break;
			
			case 'assets'	:
				conj = ' of '; break;
			
		}
		
		return conj;
		
	}
	
	getSelects( selectsObject ) {
		
		const selectsGroup	=	[];
		
		for( const selectID in selectsObject ) {
			
			const selectOptions	=	this.getSelectOptions( selectsObject[ selectID ], selectID );
			const selected		=	this.props[ f.showify( selectID ) ];
			const conj			=	this.maybeAddConjunction( selectID );
			
			selectsGroup.push(
				
				<React.Fragment key={ selectID }>
				
					{ conj && <span>{ conj }</span> }
					
					<select id={ selectID } onChange={ this.props.selectionHandler } value={ selected }>
					
						{ selectOptions }
					
					</select>
				
				</React.Fragment>
				
			)
			
		}
		
		return selectsGroup;
	}
	
	render() {
		
		const 	{ assets, periods } = this.props;
		const 	variables 		= {
					'actions'	:	[ 'buy', 'sell' ],
					'assets'	:	assets,
					'periods'	:	periods,
				};
		
		const	userSelections	=	this.getSelects( variables );
				
		return(
		
			<div>
				
				Showing { userSelections }
			
			</div>
			
		)
	}

}

export default TransactionNavigation;