import React, { Component } from 'react';
import { Link } from 'react-router';
import { Row } from 'react-bootstrap';
import FullViewMessage from '../Shared/FullViewMessage.react';
import TracksList from '../Shared/TracksList.react';
import Header from '../Header/Header.react';
import app from '../../lib/app';
import KeyBinding from 'react-keybinding-component';
import classnames from 'classnames';
import PlayingBar from '../Header/PlayingBar.react';
import WindowControls from '../Header/WindowControls.react';
import PlayerControls from '../Header/PlayerControls.react';
import VolumeControl from './VolumeControl.react';
import Util from '../../utils/utils'
import { connect } from 'react-redux';

/*
|--------------------------------------------------------------------------
| Global View
|--------------------------------------------------------------------------
*/

class MusicPlayer extends Component {

    static propTypes = {
        store: React.PropTypes.object,
        children: React.PropTypes.object,
        library: React.PropTypes.object,
        tracks: React.PropTypes.object,
        trackPlayingId: React.PropTypes.string,
        playlists: React.PropTypes.array,
        playerStatus: React.PropTypes.string,
        queue: React.PropTypes.array,
        queueCursor: React.PropTypes.number,
        shuffle: React.PropTypes.bool,
        repeat: React.PropTypes.string,
        useNativeFrame: React.PropTypes.bool,
    }
    constructor(props) {
        super(props);
        this.state = {
          title: '音樂名稱',
          artist: ['演唱者'],
          cover: 'http://placeholdit.imgix.net/~text?txtsize=100&txt=%E2%99%AA&w=256&h=256',
        };
        // this.onKey = this.onKey.bind(this);
    }

    
  async componentWillMount() {
      const { queue, trackPlayingId } = this.props;
      console.log("!componentWillMount!!!!!!!!!!!", queue, trackPlayingId);
      if (queue.length > 0) {
        let target = null;
        if (trackPlayingId) {
          target = queue.filter((data) => data._id === trackPlayingId)[0]
        } else {
          target = queue[0];
        }
        await this.showInfo(target);
      }
    }
    

    async componentWillUpdate(nextProps, nextState) {
      const isNewSong = this.props.trackPlayingId !== nextProps.trackPlayingId && nextProps.trackPlayingId;
      const isQueueUpdate = JSON.stringify(this.props.queue) !== JSON.stringify(nextProps.queue) && this.props.queue.length > 0;
      if(isNewSong) {
        const target = nextProps.queue.filter((data) => data._id === nextProps.trackPlayingId)[0];
        await this.showInfo(target);
      } else if (isQueueUpdate) {
        const target = nextProps.queue[0];
        await this.showInfo(target);
      }
    }

    showInfo = async(target) => {
        const title = target.title;
        const artist = target.artist;
        let cover = this.state.cover;
        if (target.path.indexOf('http') !== 0) {
          cover = await Util.fetchCover(target.path);
          cover = `${encodeURI(cover).replace(/'/g, '\\\'').replace(/"/g, '\\"')}`;
        }
        this.setState({ title, artist, cover });
    }

    render() {
        const config = { ...app.config.getAll() };
        const { queue } = this.props;
        const { title, artist, cover } = this.state;
        return (

            <div className='view' style={{ overflow: '', background: '#333842' }} >

                <div style={{ width: '100%', height: '30%', background: '#282C34' }}>
                    <strong style={{ display: 'flex', textAlign: 'center', margin: '0 auto', justifyContent: 'center', color: 'white', fontSize: 22, paddingTop: '3%' }}>{title}</strong>
                    <strong style={{ display: 'flex', textAlign: 'center', margin: '0 auto', justifyContent: 'center', color: 'white', fontSize: 14, marginTop: '25px' }}>{artist}</strong>
                </div>

                <img
                  style={{ display: 'block', margin: '0 auto', marginTop: '-3%', justifyContent: 'center', alignItems: 'center', alignmentAdjust: 'center', height: '40%' }}
                  src={cover}
                />
                <br /><br />

                <div style={{ width: '100%', height: '30%', background: '#282C34', verticalAlign: 'flex-end' ,Bottom:'0',paddingTop:'20px'}}>
                    <PlayingBar
                        ref={(ref) => this.playingBar = ref}
                        queue={queue}
                        queueCursor={queue.length > 0 ? this.props.queueCursor : null}
                        shuffle={this.props.shuffle}
                        repeat={this.props.repeat}
                        hideCover
                    />
                    <PlayerControls style={{marginLeft:'',display: 'flex', alignItem: 'center'}}
                        playerStatus={this.props.playerStatus}
                    />
                    <VolumeControl style={{ position:'absolute',marginTop:'-30px' }}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
      store: {...state},
      queue: state.tracks.library.all || [],
      queueCursor: state.queueCursor || 0,
    };
}

export default connect(mapStateToProps)(MusicPlayer);
