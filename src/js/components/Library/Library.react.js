import React, { Component } from 'react';
import { Link } from 'react-router';

import FullViewMessage from '../Shared/FullViewMessage.react';
import TracksList from '../Shared/TracksList.react';
import Dropzone from '../Shared/Dropzone.react';
import AppActions from '../../actions/AppActions';
const dialog = electron.remote.dialog;



/*
|--------------------------------------------------------------------------
| Global View
|--------------------------------------------------------------------------
*/

export default class Library extends Component {

    static propTypes = {
        library: React.PropTypes.object,
        tracks: React.PropTypes.object,
        trackPlayingId: React.PropTypes.string,
        playlists: React.PropTypes.array,
        playerStatus: React.PropTypes.string,
    }

    constructor(props) {
        super(props);
    }

    getLibraryComponent() {
        // Loading library
        if(this.props.tracks.all === null) {
            return (
                <FullViewMessage>
                    <p>Loading library...</p>
                </FullViewMessage>
            );
        }

        // Empty library
        if (this.props.tracks.all.length === 0) {
            if(this.props.library.refreshing) {
                return (
                    <FullViewMessage>
                        <p>Your library is being scanned =)</p>
                        <p className='sub-message'>
                            hold still...
                        </p>
                    </FullViewMessage>
                );
            }

            return (
                <FullViewMessage>
                    <p>Too bad, there is no music in your library =(</p>
                    <p className='sub-message'>
                        <span>nothing found yet, but that's fine, you can always </span>
                        <Link to='/settings/library'>add your music here</Link>
                    </p>
                </FullViewMessage>
            );
        }

        // Empty search
        if (this.props.tracks.sub.length === 0) {
            return (
                <FullViewMessage>
                    <p>Your search returned no results</p>
                </FullViewMessage>
            );
        }

        // All good !
        return (
            <TracksList
                type='library'
                playerStatus={ this.props.playerStatus }
                tracks={ this.props.tracks.sub }
                trackPlayingId={ this.props.trackPlayingId }
                playlists={ this.props.playlists }
            />
        );
    }

    onDrop(e) {
        const files = [];
        const eventFiles = e.dataTransfer.files;

        for(let i = 0; i < eventFiles.length; i++) {
            files.push(eventFiles[i].path);
        }

        AppActions.library.add(files);
    }

    openFolderSelector() {
        dialog.showOpenDialog({
            properties: ['multiSelections', 'openDirectory'],
        }, (result) => {
            if(result) {
                AppActions.library.add(result);
            }
        });
    }

    render() {
        return (
            <div className='view view-library' >
                { this.getLibraryComponent() }
                <Dropzone
                    title='新增音樂'
                    subtitle='Drop files or folders here'
                    onDrop={ this.onDrop }
                    onClick={ this.openFolderSelector }
                />
            </div>
        );
    }
}
