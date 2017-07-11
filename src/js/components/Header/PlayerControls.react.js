import React, { PureComponent } from 'react';
import Icon from 'react-fontawesome';
import VolumeControl from './VolumeControl.react';

import AppActions from '../../actions/AppActions';

/*
|--------------------------------------------------------------------------
| PlayerControls
|--------------------------------------------------------------------------
*/

export default class PlayerControls extends PureComponent {

    static propTypes = {
        playerStatus: React.PropTypes.string,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='player-controls'  style={{color:'white',marginLeft:'46.5%'}}>
                <button type='button' className='player-control previous' title='Previous' onClick={ AppActions.player.previous }>
                    <Icon name='backward' />
                </button>
                <button className='player-control play' title={ this.props.playerStatus === 'play' ? 'Pause' : 'Play' } onClick={ AppActions.player.playToggle }>
                    <Icon name={ this.props.playerStatus === 'play' ? 'pause' : 'play' } fixedWidth />
                </button>
                <button type='button' className='player-control forward' title='Next' onClick={ AppActions.player.next }>
                    <Icon name='forward' />
                </button>
                {
                    this.props.showVolume ? <VolumeControl /> : null
                }
            </div>
        );
    }
}
