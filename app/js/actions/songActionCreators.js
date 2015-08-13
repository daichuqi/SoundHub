// actions relating to songs/song trees/etc in general

import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/appUtils';

const ActionType = Constants.ActionTypes;

export default {

  // retrieve all songs from server
  getAllSongs() {
    Utils.get('/allSongs')
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log("dispatch songs ", json);
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_ALL_SONGS,
        songs: json
      })
    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  },

  // retrieve song tree
  getSongTree(song) {
    Utils.getTree('/tree', song)
    .then((response) => {
      return response;
    })
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_SONG_TREE,
        message: 'Song tree received',
        songTree: json
      })
    })
    .catch((err) => {
      console.log('getSongTree failed: ', err)
    })
  },

  // add song into database
  addSong(songData) {
    Utils.post('/addSong', songData)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.SONG_ADD_SUCCESS,
        message: 'Song successfully added',
        songData: songData
      });
      console.log('dispatched')
    })
    .catch((err) => {
      console.log('failed', err)
    })
  },

  // find all songs uploaded by user
  getUserCreatedSongs(user) {
    Utils.post('/mySongs', user)
    .then((response) => {

    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  },

  // fork a song
  forkSong(userId, songId) {
    let forkInfo = {
      userId: userId,
      songId: songId
    }
    Utils.post('/addFork', forkInfo)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.FORK_SUCCESS,
        forkInfo: forkInfo
      })
    })
    .catch((err) => {
      console.log('forking failed: ', err)
    })
  },

  // add upvote or downvote to song
  addSongVote(userId, songId, value) {
    let voteInfo = {
      userId: userId,
      songId: songId,
      value: value
    }
    Dispatcher.dispatch({
      type: ActionType.VOTE,
      voteInfo: voteInfo
    })
    Utils.post('/addVote', voteInfo)
    .catch((err) => {
      console.log('voting failed: ', err)
    })
  },

  // find all songs forked by user
  getAllForks(userId) {
    Utils.post('/myForks', userId)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log("dispatch forked songs ", json);
      Dispatcher.dispatch({
        type: ActionType.GET_USER_FORKS,
        songs: json
      })
    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  },

  createFromFork(forkSong){
    Dispatcher.dispatch({
      type:ActionType.CREATE_FROM_FORKS,
      song:forkSong,
      page:'create'
    })
  }

}
