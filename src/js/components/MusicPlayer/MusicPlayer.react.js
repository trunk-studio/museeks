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

/*
|--------------------------------------------------------------------------
| Global View
|--------------------------------------------------------------------------
*/

export default class MusicPlayer extends Component {

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
        // this.onKey = this.onKey.bind(this);
    }

    render() {
        const config = { ...app.config.getAll() };
        console.log(this.props.queue);
        console.log(this.props.queueCursor);
        const MusicArr = [{
            "album": "Unknown",
            "albumartist": [],
            "artist": [
                "16個夏天插曲 艾怡良"
            ],
            "disk": {
                "no": 0,
                "of": 0
            },
            "duration": 232.9425,
            "genre": [],
            "loweredMetas": {
                "artist": [
                    "16個夏天插曲 艾怡良"
                ],
                "album": "unknown",
                "albumartist": [],
                "title": "如果從此",
                "genre": []
            },
            "path": "C:\\Users\\USER\\Music\\new Music\\16個夏天插曲 艾怡良 - 如果從此.mp3",
            "playCount": 0,
            "title": "如果從此",
            "track": {
                "no": 0,
                "of": 0
            },
            "year": "",
            "_id": "32755d75"
        }, {
            "album": "Unknown",
            "albumartist": [],
            "artist": [
                "楊丞琳 Rainie Yang"
            ],
            "disk": {
                "no": 0,
                "of": 0
            },
            "duration": 259.6135,
            "genre": [],
            "loweredMetas": {
                "artist": [
                    "楊丞琳 rainie yang"
                ],
                "album": "unknown",
                "albumartist": [],
                "title": "相愛的方法（植劇場-荼蘼 片尾曲）",
                "genre": []
            },
            "path": "C:\\Users\\USER\\Music\\new Music\\楊丞琳 Rainie Yang - 相愛的方法（植劇場-荼蘼 片尾曲）.mp3",
            "playCount": 0,
            "title": "相愛的方法（植劇場-荼蘼 片尾曲）",
            "track": {
                "no": 0,
                "of": 0
            },
            "year": "",
            "_id": "7fd33adf"
        }]
        return (

            <div className='view' style={{ overflow: '', background: '#333842' }} >

                <div style={{ width: '100%', height: '30%', background: '#282C34' }}>
                    <strong style={{ display: 'flex', textAlign: 'center', margin: '0 auto', justifyContent: 'center', color: 'white', fontSize: 22, paddingTop: '3%' }}>Music Title  音樂標題</strong>
                    <strong style={{ display: 'flex', textAlign: 'center', margin: '0 auto', justifyContent: 'center', color: 'white', fontSize: 14, marginTop: '25px' }}>Music Author  演唱者</strong>
                </div>

                <img style={{ display: 'block', margin: '0 auto', marginTop: '-3%', justifyContent: 'center', alignItems: 'center', alignmentAdjust: 'center', height: '40%' }} src="http://www.designformusic.com/wp-content/uploads/2015/10/insurgency-digital-album-cover-design.jpg" />
                <br /><br />

                <div style={{ width: '100%', height: '30%', background: '#282C34', verticalAlign: 'flex-end' ,Bottom:'0',paddingTop:'20px'}}>
                    <PlayingBar
                        queue={MusicArr}
                        queueCursor={0}
                        shuffle={this.props.shuffle}
                        repeat={this.props.repeat}
                    />
                    <PlayerControls style={{marginLeft:'',display: 'flex', alignItem: 'center'}}
                        playerStatus={this.props.playerStatus}
                    />
                    <VolumeControl style={{position:'absolute',marginTop:'-30px'}}/>
                </div>
            </div>
        );
    }
}

